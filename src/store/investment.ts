import { useEffect } from 'react';
import { useAuth } from './auth';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export function useInvestmentReturns() {
  const { user } = useAuth();

  useEffect(() => {
    const checkReturns = async () => {
      if (!isFirebaseConfigured || !db || !user?.uid) return;

      try {
        const q = query(collection(db, 'users', user.uid, 'activePlans'), where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) return;

        const now = new Date();
        const userRef = doc(db, 'users', user.uid);
        let totalNewReturns = 0;

        for (const planDoc of querySnapshot.docs) {
          const plan = planDoc.data();
          const lastReturnDate = plan.lastReturnDate?.toDate() || plan.startDate?.toDate();
          
          if (!lastReturnDate) continue;

          // Calculate how many 24-hour periods have passed
          const diffTime = now.getTime() - lastReturnDate.getTime();
          const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (daysPassed > 0) {
            // Calculate returns
            const returnsToAdd = Math.min(daysPassed, plan.duration - (plan.returnsReceived || 0));
            
            if (returnsToAdd > 0) {
              const returnAmount = returnsToAdd * plan.dailyReturn;
              totalNewReturns += returnAmount;

              const newReturnsReceived = (plan.returnsReceived || 0) + returnsToAdd;
              const newStatus = newReturnsReceived >= plan.duration ? 'completed' : 'active';
              
              // Update plan
              await updateDoc(planDoc.ref, {
                returnsReceived: newReturnsReceived,
                lastReturnDate: new Date(lastReturnDate.getTime() + returnsToAdd * 24 * 60 * 60 * 1000),
                status: newStatus
              });

              // Save transaction for this return
              const txRef = doc(collection(db, 'users', user.uid, 'transactions'));
              await setDoc(txRef, {
                type: 'return',
                amount: `+${returnAmount}`,
                status: 'Completed',
                title: `Daily Return - ${plan.name} Plan`,
                date: new Date().toLocaleDateString(),
                timestamp: serverTimestamp(),
              });

              // Save notification
              const notifRef = doc(collection(db, 'users', user.uid, 'notifications'));
              await setDoc(notifRef, {
                title: 'Investment Return Received',
                message: `You received ${returnAmount} PKR from your ${plan.name} plan.`,
                timestamp: serverTimestamp(),
                read: false,
              });
            }
          }
        }

        // Update user balance if there are new returns
        if (totalNewReturns > 0) {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            await updateDoc(userRef, {
              balance: (userData.balance || 0) + totalNewReturns,
              withdrawBalance: (userData.withdrawBalance || 0) + totalNewReturns
            });
          }
        }

      } catch (error) {
        console.error("Error checking investment returns:", error);
      }
    };

    // Check immediately on mount, then every minute
    checkReturns();
    const interval = setInterval(checkReturns, 60000);
    
    return () => clearInterval(interval);
  }, [user]);
}

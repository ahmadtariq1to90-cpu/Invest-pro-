import { useEffect } from 'react';
import { useAuth } from './auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useInvestmentReturns() {
  const { user } = useAuth();

  useEffect(() => {
    const checkReturns = async () => {
      if (!isSupabaseConfigured || !user?.uid) return;

      try {
        const { data: activePlans, error: plansError } = await supabase
          .from('active_plans')
          .select('*')
          .eq('user_id', user.uid)
          .eq('status', 'active');
          
        if (plansError || !activePlans || activePlans.length === 0) return;

        const now = new Date();
        let totalNewReturns = 0;

        for (const plan of activePlans) {
          const lastReturnDate = new Date(plan.last_return_date || plan.start_date);
          
          if (!lastReturnDate) continue;

          // Calculate how many 24-hour periods have passed
          const diffTime = now.getTime() - lastReturnDate.getTime();
          const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (daysPassed > 0) {
            // Calculate returns
            const returnsToAdd = Math.min(daysPassed, plan.duration - (plan.returns_received || 0));
            
            if (returnsToAdd > 0) {
              const returnAmount = returnsToAdd * plan.daily_return;
              totalNewReturns += returnAmount;

              const newReturnsReceived = (plan.returns_received || 0) + returnsToAdd;
              const newStatus = newReturnsReceived >= plan.duration ? 'completed' : 'active';
              
              // Update plan
              await supabase.from('active_plans').update({
                returns_received: newReturnsReceived,
                last_return_date: new Date(lastReturnDate.getTime() + returnsToAdd * 24 * 60 * 60 * 1000).toISOString(),
                status: newStatus
              }).eq('id', plan.id);

              // Save transaction for this return
              await supabase.from('transactions').insert({
                user_id: user.uid,
                type: 'return',
                amount: `+${returnAmount}`,
                status: 'Completed',
                title: `Daily Return - ${plan.name} Plan`,
                date: new Date().toLocaleDateString(),
              });

              // Save notification
              await supabase.from('notifications').insert({
                user_id: user.uid,
                title: 'Investment Return Received',
                message: `You received ${returnAmount} PKR from your ${plan.name} plan.`,
                read: false,
              });
            }
          }
        }

        // Update user balance if there are new returns
        if (totalNewReturns > 0) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('balance, withdraw_balance')
            .eq('id', user.uid)
            .single();
            
          if (userData && !userError) {
            await supabase.from('users').update({
              balance: (userData.balance || 0) + totalNewReturns,
              withdraw_balance: (userData.withdraw_balance || 0) + totalNewReturns
            }).eq('id', user.uid);
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

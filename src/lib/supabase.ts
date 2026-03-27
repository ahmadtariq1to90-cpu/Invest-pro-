import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kllhkwwsvzdinugafakm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbGhrd3dzdnpkaW51Z2FmYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTkyOTgsImV4cCI6MjA5MDEzNTI5OH0.IiQmMZmG9wlrI967OIIv-dXo9uXtfHfAjWyioNJdgag';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = true;

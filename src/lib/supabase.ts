import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdwhhisuykqywatsixwm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd2hoaXN1eWtxeXdhdHNpeHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2MzUwNDcsImV4cCI6MjA0NTIxMTA0N30.t3_qEyuFUJDosdLoGzOLyXIurD880Sudf6QralXu6II';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
};

export async function getLeaderboard(operation: string) {
  const { data } = await supabase
    .from('scores')
    .select(`
      id,
      score,
      operation_type,
      created_at,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('operation_type', operation)
    .order('score', { ascending: false })
    .limit(10);
  
  return data;
}

export async function saveScore(score: number, operation: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      operation_type: operation
    })
    .select()
    .single();
}
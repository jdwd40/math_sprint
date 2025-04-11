import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mnofvytwpqvmheeufxci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ub2Z2eXR3cHF2bWhlZXVmeGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTc3MjQsImV4cCI6MjA1Njk5MzcyNH0.45mRVoDyga0FHsPMTG0fBOcrp-lsVHiiMZR0F9TeBMU';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
};

export async function getLeaderboard(operation: string) {
  const { data } = await supabase
    .from('math_scores')
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
    .from('math_scores')
    .insert({
      user_id: user.id,
      score,
      operation_type: operation
    })
    .select()
    .single();
}

export async function resetScores() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Only allow users to reset their own scores
  return await supabase
    .from('math_scores')
    .delete()
    .eq('user_id', user.id);
}
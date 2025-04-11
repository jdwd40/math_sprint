import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  loadUser: async () => {
    set({ isLoading: true }); // Set loading to true at the start
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          // Try to fetch the user profile
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id);
          
          if (error) {
            console.log('Error fetching profile:', error.message);
            set({ user, profile: null });
            return;
          }
          
          // Check if profile exists
          if (profiles && profiles.length > 0) {
            set({ user, profile: profiles[0] });
          } else {
            // No profile found, create one
            const username = user.email ? user.email.split('@')[0] : `user_${Date.now()}`;
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                username,
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Failed to create profile:', insertError);
              set({ user, profile: null });
            } else {
              set({ user, profile: newProfile });
            }
          }
        } catch (profileError) {
          // Handle any unexpected errors
          console.error('Error handling profile:', profileError);
          set({ user, profile: null });
        }
      } else {
        set({ user: null, profile: null });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ user: null, profile: null });
    } finally {
      set({ isLoading: false }); // Always set loading to false at the end
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      try {
        // Try to fetch the user profile
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          set({ user: data.user, profile: null });
          return;
        }
        
        // Check if profile exists
        if (profiles && profiles.length > 0) {
          set({ user: data.user, profile: profiles[0] });
        } else {
          // No profile found, create one
          const username = email.split('@')[0]; // Use part of email as default username
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username,
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('Failed to create profile:', insertError);
            set({ user: data.user, profile: null });
          } else {
            set({ user: data.user, profile: newProfile });
          }
        }
      } catch (profileError) {
        console.error('Error handling profile:', profileError);
        set({ user: data.user, profile: null });
      }
    }
  },

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
          })
          .select()
          .single();
        
        if (profileError) {
          console.error('Failed to create profile:', profileError);
          set({ user: data.user, profile: null });
        } else {
          set({ user: data.user, profile });
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        set({ user: data.user, profile: null });
      }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
import { supabase } from '../config/supabase';
import { Alert } from 'react-native';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  cityTown: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            gender: data.gender,
            city_town: data.cityTown,
          },
        },
      });

      if (authError) throw authError;

      // Wait a bit for the trigger to create the user record, then update it
      if (authData.user) {
        // Wait for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { error: updateError } = await supabase
          .from('users')
          .update({
            phone_number: data.phoneNumber,
            gender: data.gender,
            city_town: data.cityTown,
            full_name: data.fullName,
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.warn('User profile update error (may already exist):', updateError);
          // Don't throw - trigger may have already created it
        }

        // Sign out the user after signup (don't auto-sign in)
        await supabase.auth.signOut();
      }

      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message || 'Failed to sign up' };
    }
  },

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error: error.message || 'Failed to sign in' };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: error.message || 'Failed to sign out' };
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'tsamaya://reset-password',
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message || 'Failed to reset password' };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Failed to get user' };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message || 'Failed to get session' };
    }
  },
};


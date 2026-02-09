import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const SUPABASE_URL = 'https://bawslwhakxzvaivrmcid.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd3Nsd2hha3h6dmFpdnJtY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjI1NTEsImV4cCI6MjA4MDgzODU1MX0.L9yyS4C0aYisCwGku846ehobufWKOcmc7-EvsRjQK-o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lijmeggbgpqjaaonaeoo.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam1lZ2diZ3BxamFhb25hZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NzAzOTMsImV4cCI6MjAyNjM0NjM5M30.DWUqz-9RpoZsZ9AOg7slQD-itQHzUwBt-bJ1HOY7GmU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const appTables = {
  PARENT: 'profiles', // profiles for user (parent)
  CHILDREN: 'children',
  ACTIVITIES: 'activities',
  NOTIFICATIONS: 'notifications',
  TIME: 'usagelimitation'
};

export const appStorage = supabase.storage.from('avatars'); //

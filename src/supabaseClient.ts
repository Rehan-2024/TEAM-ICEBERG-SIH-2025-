// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Your Supabase project URL
const supabaseUrl = 'https://npqlumwbqssqfjtrqwib.supabase.co'; 

// Your Supabase project's public Anon Key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wcWx1bXdicXNzcWZqdHJxd2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODkxMjYsImV4cCI6MjA3Mzk2NTEyNn0.gwW6wWKKeR5BEApFzZSBAdWt-VARBQcsTtufUrlAJpw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hclrooaoqgkgrgqtollj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbHJvb2FvcWdrZ3JncXRvbGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODg1OTMsImV4cCI6MjA4NzA2NDU5M30.nWJRm5C-BuVKCvBmGeEB62F7xzPTetgBqflocdvsj8g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

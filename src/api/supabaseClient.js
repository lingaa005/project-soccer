import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://vhimkuqrghgrdyuxqlza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaW1rdXFyZ2hncmR5dXhxbHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzIxMjMsImV4cCI6MjA2NjE0ODEyM30.HbtfGuzY4mED91hSGYZWZ_m9c2DWNuK3Br5oQqSXtDg';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
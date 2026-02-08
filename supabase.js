// supabase.js – Client setup (do NOT change keys here if shared publicly)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://aiwigwfsajdnwfpcziqf.supabase.co'; // your project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd2lnd2ZzYWpkbndmcGN6aXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzExMTksImV4cCI6MjA4MDU0NzExOX0.7Mk1IUVbxhCnwQ4HYo-02G4W2pNoBtSbRe8X4UizstA

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

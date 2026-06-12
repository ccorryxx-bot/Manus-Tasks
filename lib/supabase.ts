import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ftskwiglyljczawquebj.supabase.co";
// anon/public key — safe to use in client
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2t3aWdseWxqY3phd3F1ZWJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg5OTQ2NiwiZXhwIjoyMDk2NDc1NDY2fQ.vxozaYE5jCCr42hkj8KLEy3mt5WHqR3kt-bw0PZYz3s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Game {
  id: number;
  name: string;
  provider: string;
  category: string;
  thumbnail_url: string;
  player_count: number;
  is_new: boolean;
  is_hot: boolean;
  sort_order: number;
}

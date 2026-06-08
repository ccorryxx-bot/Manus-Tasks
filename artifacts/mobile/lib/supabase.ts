import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  balance: number;
  vip_level: number;
  avatar_url: string | null;
  created_at: string;
};

export type Game = {
  id: string;
  name: string;
  provider: string | null;
  category: string;
  thumbnail_url: string | null;
  player_count: number;
  is_new: boolean;
  is_hot: boolean;
  sort_order: number;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: "deposit" | "withdrawal" | "reward";
  amount: number;
  status: "pending" | "completed" | "failed";
  note: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string | null;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase, type Profile } from "@/lib/supabase";

const USER_ID_KEY = "casino_user_id";
const BALANCE_KEY = "casino_balance";

type AppContextType = {
  userId: string;
  profile: Profile | null;
  balance: number;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  unreadCount: number;
  setUnreadCount: (n: number) => void;
};

const AppContext = createContext<AppContextType>({
  userId: "",
  profile: null,
  balance: 0,
  isLoading: true,
  refreshBalance: async () => {},
  updateBalance: async () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
});

function generateUserId(): string {
  return "user_" + Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  useEffect(() => {
    initUser();
  }, []);

  async function initUser() {
    try {
      let uid = await AsyncStorage.getItem(USER_ID_KEY);
      if (!uid) {
        uid = generateUserId();
        await AsyncStorage.setItem(USER_ID_KEY, uid);
      }
      setUserId(uid);

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .single();

      if (existingProfile) {
        setProfile(existingProfile as Profile);
        setBalance(Number(existingProfile.balance));
      } else {
        const newProfile: Omit<Profile, "id" | "created_at"> = {
          user_id: uid,
          username: "Player" + Math.floor(Math.random() * 9999),
          balance: 10000,
          vip_level: 0,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        } as any;

        const { data: created } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();

        if (created) {
          setProfile(created as Profile);
          setBalance(10000);
        } else {
          setBalance(10000);
        }
      }
    } catch {
      const cachedBalance = await AsyncStorage.getItem(BALANCE_KEY);
      setBalance(cachedBalance ? Number(cachedBalance) : 10000);
    } finally {
      setIsLoading(false);
    }
  }

  const refreshBalance = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("balance, vip_level")
        .eq("user_id", userId)
        .single();
      if (data) {
        setBalance(Number(data.balance));
        setProfile((prev) =>
          prev ? { ...prev, balance: Number(data.balance), vip_level: data.vip_level } : prev
        );
      }
    } catch {}
  }, [userId]);

  const updateBalance = useCallback(
    async (amount: number) => {
      const newBalance = balance + amount;
      setBalance(newBalance);
      await AsyncStorage.setItem(BALANCE_KEY, String(newBalance));
      if (userId) {
        await supabase
          .from("profiles")
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }
    },
    [balance, userId]
  );

  return (
    <AppContext.Provider
      value={{
        userId,
        profile,
        balance,
        isLoading,
        refreshBalance,
        updateBalance,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

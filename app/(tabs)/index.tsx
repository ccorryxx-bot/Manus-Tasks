import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterIconRow, FilterId } from "@/components/FilterIconRow";
import { GameCard } from "@/components/GameCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { supabase, Game } from "@/lib/supabase";
import { WithdrawModal } from "@/components/WithdrawModal";

const H_PAD   = 6;
const COL_GAP = 8;
const ROW_GAP = 8;
const PAGE    = 20;

const PROVIDER_COLORS: Record<string, string[]> = {
  pg:   ["#8B4513","#3d1a00"],
  pp:   ["#1a1a6b","#0a0a3d"],
  jili: ["#006b3d","#003d1a"],
  jdb:  ["#6b3d00","#3d1a00"],
};

// Filter → Supabase query params
const FILTER_MAP: Record<FilterId, { provider?: string; category?: string }> = {
  pp:       { provider: "pp" },
  jili:     { provider: "jili" },
  fishing:  { category: "fishing" },
  favorite: {},
};

function BokehLayer() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[b.c, { top:"10%",  left:"15%",  width:120, height:120, backgroundColor:"rgba(120,40,220,0.28)" }]} />
      <View style={[b.c, { top:"35%",  right:"5%",  width:90,  height:90,  backgroundColor:"rgba(40,80,200,0.22)" }]} />
      <View style={[b.c, { top:"60%",  left:"30%",  width:140, height:140, backgroundColor:"rgba(90,20,180,0.2)" }]} />
      <View style={[b.c, { bottom:"10%",right:"20%",width:80,  height:80,  backgroundColor:"rgba(50,100,220,0.25)" }]} />
      <WithdrawModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} />
    </View>
  );
}
const b = StyleSheet.create({ c: { position:"absolute", borderRadius:999 } });

export default function LobbyScreen() {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isLandscape   = W > H;
  const SIDEBAR_L     = isLandscape ? 0 : 72;
  const SIDEBAR_R     = isLandscape ? 0 : 40;
  const contentWidth  = W - SIDEBAR_L - SIDEBAR_R;
  const COLUMNS       = isLandscape ? 4 : 3;
  const cardW         = (contentWidth - H_PAD * 2 - COL_GAP * (COLUMNS - 1)) / COLUMNS;
  const heroH         = isLandscape ? 160 : 200;

  const [activeNav,    setActiveNav]    = useState("ငွေထုတ်");
  const [activeFilter, setActiveFilter] = useState<FilterId>("pp");
  const [favorites,    setFavorites]    = useState<Set<number>>(new Set());
  const [games,        setGames]        = useState<Game[]>([]);
  const [page,         setPage]         = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [hasMore,      setHasMore]      = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const fetchGames = useCallback(async (pageNum: number, filter: FilterId) => {
    if (loading) return;
    setLoading(true);
    try {
      let q = supabase.from("games").select("*");

      if (filter === "favorite") {
        if (favorites.size === 0) { setGames([]); setLoading(false); return; }
        q = q.in("id", Array.from(favorites));
      } else {
        const p = FILTER_MAP[filter];
        if (p.provider) q = q.eq("provider", p.provider);
        if (p.category) q = q.eq("category", p.category);
      }

      const { data } = await q
        .order("sort_order", { ascending: true })
        .range(pageNum * PAGE, (pageNum + 1) * PAGE - 1);

      if (!data || data.length < PAGE) setHasMore(false);
      setGames(prev => pageNum === 0 ? (data ?? []) : [...prev, ...(data ?? [])]);
      setPage(pageNum + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [loading, favorites]);

  // Reload when filter changes
  useEffect(() => {
    setGames([]);
    setPage(0);
    setHasMore(true);
    fetchGames(0, activeFilter);
  }, [activeFilter]);

  const toggleFav = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const featuredGame = games[0];
  const gridGames    = games.slice(1);
  const pairs: Game[][] = [];
  for (let i = 0; i < gridGames.length; i += COLUMNS)
    pairs.push(gridGames.slice(i, i + COLUMNS));

  const renderPair = useCallback(({ item }: { item: Game[] }) => (
    <View style={[styles.pair, { gap: COL_GAP }]}>
      {item.map(g => (
        <GameCard
          key={g.id}
          name={g.name}
          imageUri={g.thumbnail_url}
          bgColors={PROVIDER_COLORS[g.provider] ?? ["#2d1b6b","#1a0a3d"]}
          players={g.player_count}
          badge={g.is_hot ? "Hot!" : g.is_new ? "New!" : null}
          liked={favorites.has(g.id)}
          onLike={() => toggleFav(g.id)}
          cardWidth={cardW}
          cardHeight={cardW}
        />
      ))}
      {item.length < COLUMNS &&
        Array.from({ length: COLUMNS - item.length }).map((_,i) => (
          <View key={`e${i}`} style={{ width: cardW }} />
        ))}
    </View>
  ), [cardW, isLandscape, COLUMNS, favorites]);

  const topPad    = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 0 : insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar hidden style="light" />
      <LinearGradient colors={["#1a0a3d","#0d1b4b"]} start={{x:0.3,y:0}} end={{x:0.7,y:1}} style={StyleSheet.absoluteFill}/>
      <BokehLayer />

      <View style={[styles.frame, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        {!isLandscape && <LeftSidebar activeId={activeNav} onSelect={(id) => { setActiveNav(id); if(id==="ငွေထုတ်") setShowWithdraw(true); }}/>}

        <View style={styles.main}>
          <View style={styles.top}>
            <FilterIconRow
              activeFilter={activeFilter}
              onFilterChange={(id) => { setActiveFilter(id); }}
            />
            {!isLandscape && (
              <TouchableOpacity style={styles.pill} activeOpacity={0.8}>
                <Text style={styles.pillTxt}>သင်အတွက်</Text>
              </TouchableOpacity>
            )}
          </View>

          {games.length === 0 && loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#9933ff" />
            </View>
          ) : (
            <FlatList
              data={[{ key:"hero" }, ...pairs.map((p,i) => ({ key:String(i), pair:p }))]}
              keyExtractor={item => item.key}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.scroll, { paddingHorizontal: H_PAD, gap: ROW_GAP }]}
              onEndReached={() => { if (hasMore) fetchGames(page, activeFilter); }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loading ? <ActivityIndicator color="#9933ff" style={{ marginVertical:12 }}/> : null}
              renderItem={({ item }) => {
                if (item.key === "hero") {
                  if (!featuredGame) return null;
                  return (
                    <GameCard
                      name={featuredGame.name}
                      imageUri={featuredGame.thumbnail_url}
                      bgColors={PROVIDER_COLORS[featuredGame.provider] ?? ["#2d1b6b","#1a0a3d"]}
                      players={featuredGame.player_count}
                      badge={featuredGame.is_hot ? "Hot!" : featuredGame.is_new ? "New!" : null}
                      liked={favorites.has(featuredGame.id)}
                      onLike={() => toggleFav(featuredGame.id)}
                      featured
                      cardWidth={contentWidth - H_PAD * 2}
                      cardHeight={heroH}
                    />
                  );
                }
                return renderPair({ item: item.pair! });
              }}
            />
          )}
        </View>

        {!isLandscape && <RightSidebar onRefresh={() => { setHasMore(true); setGames([]); setPage(0); fetchGames(0, activeFilter); }}/>}
      </View>
      <WithdrawModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex:1, backgroundColor:"#1a0a3d" },
  frame:  { flex:1, flexDirection:"row" },
  main:   { flex:1 },
  top:    { zIndex:20 },
  scroll: { paddingTop:4, paddingBottom:12 },
  pair:   { flexDirection:"row" },
  center: { flex:1, justifyContent:"center", alignItems:"center" },
  pill:   { alignSelf:"center", borderWidth:1.5, borderColor:"#4499ff", borderRadius:20, paddingHorizontal:20, paddingVertical:6, marginBottom:8 },
  pillTxt:{ fontSize:13, fontWeight:"600", color:"#4499ff" },
});

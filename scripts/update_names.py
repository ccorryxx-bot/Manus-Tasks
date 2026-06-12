#!/usr/bin/env python3
"""
READ Diamond-BETT game_cards → UPDATE Native App games names
Diamond-BETT: READ ONLY
"""
import urllib.request, json, time

# Diamond-BETT — READ ONLY
DB_URL  = "https://xjqrwcsxiaybpztzestb.supabase.co"
DB_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcXJ3Y3N4aWF5YnB6dHplc3RiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NDEwOSwiZXhwIjoyMDk0MzUwMTA5fQ.AAKLa2QN7vjRJivwlOz0W9z2kWnHwrMamAjvMVbhr4s"

# Native App
NA_URL  = "https://ftskwiglyljczawquebj.supabase.co"
NA_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2t3aWdseWxqY3phd3F1ZWJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg5OTQ2NiwiZXhwIjoyMDk2NDc1NDY2fQ.vxozaYE5jCCr42hkj8KLEy3mt5WHqR3kt-bw0PZYz3s"

def get(url, key, path):
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        headers={"Authorization": f"Bearer {key}", "apikey": key}
    )
    res = urllib.request.urlopen(req)
    return json.loads(res.read())

def patch(url, key, path, data):
    payload = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        data=payload, method="PATCH",
        headers={
            "Authorization": f"Bearer {key}",
            "apikey": key,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
    )
    urllib.request.urlopen(req)

# Step 1: Fetch game names from Diamond-BETT (READ ONLY)
print("Fetching game names from Diamond-BETT...")
all_games = []
offset = 0
while True:
    data = get(DB_URL, DB_KEY, 
        f"game_cards?select=game_code,game_name,provider_code&limit=500&offset={offset}")
    if not data: break
    all_games.extend(data)
    print(f"  Fetched {len(all_games)} games...")
    if len(data) < 500: break
    offset += 500
    time.sleep(0.2)

print(f"Total from Diamond-BETT: {len(all_games)}")
print(f"Sample columns: {list(all_games[0].keys()) if all_games else 'none'}")

# Step 2: Build uid → name mapping
uid_to_name = {}
for g in all_games:
    code = g.get('game_code','')
    name = g.get('game_name','')
    if code and name:
        uid_to_name[code] = name

print(f"Name mappings built: {len(uid_to_name)}")

# Step 3: Fetch Native App games
print("\nFetching Native App games...")
na_games = get(NA_URL, NA_KEY, "games?select=id,name&limit=2000")
print(f"Native App games: {len(na_games)}")

# Step 4: Update names
updated = 0
skipped = 0
for g in na_games:
    gid   = g['id']
    current_name = g['name']
    # Extract uid from current name (we stored first 12 chars of uid as name)
    # Better: fetch thumbnail_url and extract uid from it
    pass

# Re-fetch with thumbnail_url
na_games = get(NA_URL, NA_KEY, "games?select=id,thumbnail_url&limit=2000")

for g in na_games:
    gid = g['id']
    url = g.get('thumbnail_url','')
    # Extract uid: last part before .jpg
    if '/' in url:
        uid = url.split('/')[-1].replace('.jpg','')
        if uid in uid_to_name:
            try:
                patch(NA_URL, NA_KEY, 
                    f"games?id=eq.{gid}",
                    {"name": uid_to_name[uid]})
                updated += 1
                if updated % 50 == 0:
                    print(f"  Updated {updated} names...")
            except Exception as e:
                skipped += 1
        else:
            skipped += 1
    time.sleep(0.05)

print(f"\n✅ Done! Updated: {updated}, Skipped: {skipped}")

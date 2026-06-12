#!/usr/bin/env python3
import urllib.request, json, time

DB_URL = "https://xjqrwcsxiaybpztzestb.supabase.co"
DB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcXJ3Y3N4aWF5YnB6dHplc3RiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3NDEwOSwiZXhwIjoyMDk0MzUwMTA5fQ.AAKLa2QN7vjRJivwlOz0W9z2kWnHwrMamAjvMVbhr4s"
NA_URL = "https://ftskwiglyljczawquebj.supabase.co"
NA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2t3aWdseWxqY3phd3F1ZWJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg5OTQ2NiwiZXhwIjoyMDk2NDc1NDY2fQ.vxozaYE5jCCr42hkj8KLEy3mt5WHqR3kt-bw0PZYz3s"

def get(url, key, path):
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        headers={"Authorization": f"Bearer {key}", "apikey": key}
    )
    return json.loads(urllib.request.urlopen(req).read())

def patch(url, key, path, data):
    req = urllib.request.Request(
        f"{url}/rest/v1/{path}",
        data=json.dumps(data).encode(), method="PATCH",
        headers={
            "Authorization": f"Bearer {key}", "apikey": key,
            "Content-Type": "application/json", "Prefer": "return=minimal"
        }
    )
    urllib.request.urlopen(req)

# Step 1: Get Diamond-BETT names
print("Fetching from Diamond-BETT...")
all_db = []
offset = 0
while True:
    data = get(DB_URL, DB_KEY,
        f"game_cards?select=game_code,game_name&limit=500&offset={offset}")
    if not data: break
    all_db.extend(data)
    if len(data) < 500: break
    offset += 500
    time.sleep(0.2)

uid_name = {g['game_code']: g['game_name'] 
            for g in all_db if g.get('game_code') and g.get('game_name')}
print(f"Mappings: {len(uid_name)}")

# Step 2: Get ALL Native App games (fix: limit 2000)
print("Fetching Native App games...")
na_games = get(NA_URL, NA_KEY,
    "games?select=id,thumbnail_url&limit=2000&order=id.asc")
print(f"Native App games: {len(na_games)}")

# Step 3: Update names
updated = 0
skipped = 0
for g in na_games:
    gid = g['id']
    url = g.get('thumbnail_url') or ''  # fix: handle None
    if not url or '/' not in url:
        skipped += 1
        continue
    uid = url.split('/')[-1].replace('.jpg', '')
    if uid in uid_name:
        try:
            patch(NA_URL, NA_KEY, f"games?id=eq.{gid}", {"name": uid_name[uid]})
            updated += 1
            if updated % 100 == 0:
                print(f"  Updated {updated}...")
        except Exception as e:
            skipped += 1
    else:
        skipped += 1
    time.sleep(0.03)

print(f"\n✅ Done! Updated: {updated}, Skipped: {skipped}")

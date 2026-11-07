# Day 2: AYAM GEPREK (sudah dirender, belum diposting)

## File

| | File | Catatan |
|---|---|---|
| Instagram Reels | `instagram/day2-reel.mp4` | 1080×1920, 24 fps, 62 dtk, −14 LUFS, caption di y 1450 |
| TikTok | `tiktok/day2-tiktok.mp4` | sama, caption di y 1280 (di atas deskripsi TikTok) |

## Naskah (disetujui user)

18 baris narasi, suara ElevenLabs "Mang Juned (Warung Komen)" (`bwyCvXbDGcE93hF4UWld`, `eleven_v4`).
Teks lengkap ada di `pieces/warung-day2/voice/script.json`. Di teks untuk TTS, "gw" ditulis "gue"
supaya tidak dieja huruf per huruf; di layar tetap "gw".

Keputusan bawaan (user bilang "Setuju" tanpa memilih opsi):
- Adegan sial-lucu: asap sambal bikin Juned batuk dan bersin, kucing kabur.
- Papan pelanggan: 1 → 5 (sesuai 5 like komen pemenang).
- "Warung Mas Joko", "legeg" dan onigiri tidak dimasukkan.

## Konsep

Menu bertambah (lihat `episodes/KONSEP.md`). Ayam geprek adalah menu pertama di papan MENU; papan gerobak tetap
"WARUNG KOMEN"; ajakan penutup: "ADU LIKE: MENU KE-2".

## Nama penonton di video

Diambil dari screenshot user (7 Nov 2026). IG pakai @username, TikTok pakai nama tampilan (TikTok tidak menampilkan
@username di daftar komen). Kalau ada yang minta namanya dihapus, hapus dari `src/scenes/Day2.tsx` lalu render ulang.

| Tempat | Nama |
|---|---|
| Kartu komen | @arcvival_2, @febyy243, @o_onyl15, @tae.shell, IJN DZEKI (kopi), @_.szsbillaa (pemenang), fatiii (borong) |
| Pelanggan pertama | @_.szsbillaa |
| Antrean pelanggan 1–5 | @_.szsbillaa, THE LUCKY GUY, @tae.shell, @o_onyl15, fatiii |
| Kubu NASGOR | @ex.cl77, kelvin, @aliftrndk, @arcvival_2, hafizapizzaa, ROGO SAMBOYO PUTRO |
| Kubu MIE AYAM | @febyy243, nazz, @isnn05, azell?, Faxzzz., _Faniiii_ |

Versi TikTok menampilkan @username TikTok untuk penonton TikTok (lihat `handles` di `DAY2_TIKTOK`,
`src/episode.ts`; daftar pengikut tidak disimpan di repo publik). `instagram/day2-reel.mp4` adalah file yang sudah tayang di IG.

Di keramaian, nama muncul bergiliran (±1 detik per orang) supaya label besar dan tidak bertumpuk.

## Suara

- Flow ElevenLabs: https://elevenlabs.io/app/flows/RdjxYZdss7VKC4RgyzNA (2 take per baris).
- Semua take ada di `pieces/warung-day2/voice/takes/` (`<id>-a.mp3`, `<id>-b.mp3`). Take yang dipakai
  disalin ke `voice/<id>.mp3` dan dipercepat 1,1× (`atempo=1.1`) supaya durasi 62 dtk, bukan 67.
  Pilihan take: buka b, belanja b, goreng b, pedes b, geprek b ("Gepret" di take a); sisanya a.

## Membuat ulang

```
node .claude/skills/animate/tools/voice.mjs pieces/warung-day2 --model small --lang id   # perlu: pip install faster-whisper
python3 pieces/warung-day2/mix.py                                                          # musik + sfx + suara -> mix.wav
ffmpeg -i pieces/warung-day2/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 remotion/warung-netizen/public/day2/audio.wav
cp pieces/warung-day2/voice.json remotion/warung-netizen/src/data/voice-day2.json
cd remotion/warung-netizen && npm i
npx remotion render WarungDay2 out/warung-day2-ig.mp4 --codec h264 --crf 18
npx remotion render WarungDay2TikTok out/warung-day2-tiktok.mp4 --codec h264 --crf 18
```

Adegan: `remotion/warung-netizen/src/scenes/Day2.tsx`; urutan potongan: `src/WarungDay2.tsx`.
`lib.ts` sekarang punya `makeVoice()` dan `MouthCtx`, jadi tiap episode punya timing suara dan lip-sync sendiri
(Day 1 tidak berubah).

## Caption (usulan)

```
Day 2 🍳 Elu pada nyuruh gw masak AYAM GEPREK?! Buset dah. Oke, gw turutin 😭
Menu pertama resmi masuk papan. Hatur nuhun @_.szsbillaa, pelanggan pertama gw 📒
Kubu nasgor & mie ayam protes… ya udah, komen menu ke-2, nyang paling banyak like gw masak besok!
#warungkomen #day2
```

## Posting

Belum diposting. Ikuti bagian "Posting" di `HANDOFF.md` (IG lewat Composio, TikTok manual, saran 19.00 WIB).

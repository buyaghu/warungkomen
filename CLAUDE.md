# Instruksi untuk Claude: Warung Komen

Proyek ini dikerjakan bergantian oleh beberapa akun Claude. Semua keputusan dan status ada di repo, bukan di
ingatan percakapan. Bahasa kerja dengan user: **Bahasa Indonesia**.

## Mulai dari sini

1. `episodes/KONSEP.md`: konsep seri (sudah disetujui, jangan diubah tanpa izin user).
2. `characters/mang-juned.md`: suara dan gaya bicara Mang Juned.
3. HANDOFF episode terbaru: `episodes/dayN/HANDOFF.md` (sekarang: `episodes/day4/HANDOFF.md`).
4. Catatan produksi episode sebelumnya: `episodes/day2/README.md`.

## Aturan kerja

- **Naskah dulu, minta persetujuan user**, baru produksi. Tanyakan pilihan dengan opsi singkat.
- **Posting itu publik**: posting hanya kalau user minta. Instagram lewat Composio (lihat HANDOFF); TikTok
  **manual oleh user** dari HP (siapkan video versi TikTok, cover, caption, komentar pin).
- Nama penonton boleh ditampilkan (sudah disetujui), pakai @username publik. Kalau ada yang minta dihapus, hapus.
- Setelah tiap tahap: commit dan push ke repo ini, lalu perbarui HANDOFF/README episode.
- **Arahan visual terbaru user (Day 3): gambar tetap full frame, karakter besar. Jangan pakai subtitle transkrip terus-menerus atau panel bawah yang mengecilkan adegan. Teks cukup sesekali untuk penekanan, kartu komentar/nama akun, menu dan CTA; jangan menutupi karakter.**
- Jangan memakai Google Fonts di Remotion (render headless tidak bisa mengambilnya); font Fredoka sudah lokal.

## Alat dan ID

| Apa | Nilai |
|---|---|
| Suara ElevenLabs | "Mang Juned (Warung Komen)", `voice_id: bwyCvXbDGcE93hF4UWld`, model `eleven_v4`. Teks TTS: tulis "gue" (bukan "gw") supaya tidak dieja; di layar tetap "gw". |
| Instagram (Composio) | akun `instagram_mumper-tickle`, ig_user_id `39546597871650793` (@warungkomen). API **tidak** memberi username komentator; minta screenshot ke user. |
| TikTok | @warungkomen. Posting manual oleh user. Data publik (profil, video, komen + like + @username) bisa dibaca lewat Composio toolkit TikHub; lihat `episodes/day4/HANDOFF.md`. |
| Threads | Belum tersambung ke Composio. |

## Produksi (ringkas; detail di `episodes/day2/README.md`)

```
cd remotion/warung-netizen && npm i
# suara: buat take per baris di ElevenLabs -> pieces/warung-dayN/voice/<id>.mp3 + voice/script.json
pip install faster-whisper
node .claude/skills/animate/tools/voice.mjs pieces/warung-dayN --model small --lang id
python3 pieces/warung-dayN/mix.py        # salin dari day2 lalu sesuaikan cue sfx
ffmpeg -i pieces/warung-dayN/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 remotion/warung-netizen/public/dayN/audio.wav
cp pieces/warung-dayN/voice.json remotion/warung-netizen/src/data/voice-dayN.json
npx remotion render WarungDayN out/warung-dayN-ig.mp4 --codec h264 --crf 18
npx remotion render WarungDayNTikTok out/warung-dayN-tiktok.mp4 --codec h264 --crf 18
```

- 1080×1920, 24 fps, target 45–62 detik, audio −14 LUFS.
- Caption di layar: IG `captionY` 1450, TikTok 1280. Cek still tiap adegan di dua versi (teks tidak terpotong/bertumpuk).
- Lip-sync per episode: `makeVoice()` + `MouthCtx` di `src/lib.ts`. Nama penonton per platform: `handles` di `src/episode.ts`.
- Episode props (`src/episode.ts`): `day`, `menu` (daftar menu sejauh ini), `pelangganAkhir`, `rules`, `handles`, `captionY`.

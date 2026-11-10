# Serah terima: Day 4 Warung Komen — NASI DAUN JERUK

Ditulis Selasa 10 Nov 2026 malam. Baca `CLAUDE.md` dulu.

## Status

- Voting Day 3 → pemenang **Nasi daun jeruk**, @gord0nbleu_ (IG), 4 like. Rincian: `results.md`.
- Naskah 21 baris disetujui user ("naskah setuju", durasi 60 detik oke). `NASKAH.md`.
- Suara: flow ElevenLabs https://elevenlabs.io/app/flows/Eo36TVG9rhZUYdBZrspo , 2 take per baris, eleven_v4, voice Mang Juned. Take dipilih dengan `pieces/warung-day4/audit_takes.py` (faster-whisper small), dirakit `build_voice.py`.
- **Durasi akhir 65 detik**, bukan 60: total take 73 detik, tempo dipercepat 1,16–1,24x supaya tetap wajar. Lebih pendek dari itu butuh potong baris.
- Audio: `mix.py` (musik + SFX sintetis), loudnorm −14 LUFS → `remotion/warung-netizen/public/day4/audio.wav`.
- Remotion: `src/scenes/Day4Full.tsx`, `src/WarungDay4.tsx`, `DAY4`/`DAY4_TIKTOK` di `episode.ts`, `CoverDay4`. Full frame, tanpa subtitle berjalan. Frame pertama = Juned kaget pegang daun jeruk (bukan kartu teks).
- Output: `instagram/day4-reel.mp4`, `tiktok/day4-tiktok.mp4`, cover `day4-cover.png/jpg`, caption dan komentar pin di masing-masing folder.
- **Belum diposting.** Posting hanya kalau user minta.

## Pemakaian data baru

- TikTok sekarang bisa dibaca lewat Composio toolkit **TikHub** (instant account, dibayar dari saldo Composio user, ±$0,0005–0,001 per panggilan):
  `TIK_HUB_TIKTOK_APP_V3_GET_USER_PROFILE` (unique_id `warungkomen`), `TIK_HUB_TIKTOK_APP_V3_FETCH_VIDEO_SEARCH_RESULT` (keyword `warungkomen`, region `ID`) untuk mencari aweme_id, `TIK_HUB_TIKTOK_APP_V3_FETCH_VIDEO_COMMENTS` untuk komentar + like + @handle.
  `FETCH_USER_POST_VIDEOS` tidak tersedia di instant account. API kadang tidak mengembalikan semua komentar; cek sisa lewat screenshot.

## Voting Day 5

- Batas yang dipakai di caption/komentar pin: **Kamis 12 Nov 2026, 17.00 WIB** (asumsi tayang Rabu 11 Nov). Sesuaikan kalau jadwal tayang berubah.

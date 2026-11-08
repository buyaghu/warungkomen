# Day 3 — MIE AYAM

Naskah 30 baris dengan target 95 detik disetujui user. Produksi IG + TikTok selesai; paket final siap ditinjau dan belum diposting.

## Cerita

Mie ayam menang dengan 42 like pada satu komentar TikTok, dibanding 28 like nasi goreng IG. User menyetujui screenshot terakhir sebagai dasar khusus Day 3. Menu kini **Ayam geprek + Mie ayam**; gerobak tetap WARUNG KOMEN, CABANG 1/100. Pelanggan cerita naik 5 → 8.

## Produksi

- Suara Mang Juned tetap `bwyCvXbDGcE93hF4UWld`, model `eleven_v4`.
- Flow: https://elevenlabs.io/app/flows/RyXyKWvX95kdd6wGFgiT
- 30 node, dua take per baris. Take dan ID generasi tercatat di `pieces/warung-day3/voice/generation-manifest.json`.
- Pemeriksaan lokal menggunakan faster-whisper **base**, bukan small, agar unduhan lebih ringan. Transkripsi per take di `voice/take-audit.json`. Ejaan pengenal bukan naskah layar.
- Angka kritis 42 diperiksa ulang dengan ElevenLabs Scribe. Take B baris 3 dipakai; take A baris 26 dipilih untuk kata geprek.
- Hening tepi dipangkas. Tempo bagian sekitar 1,06–1,23×. Timeline akhir: pembukaan 0–15, belanja 15–30, masak 30–58, pelanggan 58–77, penutup 77–95 detik.
- Lip-sync mengikuti waktu kata hasil pengenalan aktual, diskalakan mengikuti tempo take; teks caption mengikuti naskah yang disetujui.
- Caption IG y1450, TikTok y1280, dibungkus maksimum sekitar 31 karakter per baris. Karakter foreground tertentu dinaikkan 180 px di TikTok agar wajah tidak tertutup caption; karakter di kartu penutup diperkecil ke skala 0,6 agar seluruh label tetap terbaca.
- Musik dan SFX disintesis lokal mengikuti pola Day 2; audio dinormalisasi dua pass. Pengukuran WAV: −13,96 LUFS, true peak −1,90 dBTP.
- `Customer` Day 2 hanya ditambah export untuk dipakai ulang; komposisi Day 1/2 tidak diganti.

## Membuat ulang

```bash
python3 pieces/warung-day3/build_voice.py
python3 pieces/warung-day3/mix.py
python3 pieces/warung-day3/normalize.py
cd remotion/warung-netizen
npm ci
npx remotion render WarungDay3 out/warung-day3-ig.mp4 --codec h264 --crf 18
npx remotion render WarungDay3TikTok out/warung-day3-tiktok.mp4 --codec h264 --crf 18
npx remotion still CoverDay3 out/day3-cover.png
```

Python memerlukan numpy. Audit ulang take memerlukan faster-whisper dan model base; rekonstruksi audio dari take dan hasil audit yang disimpan tidak memerlukan panggilan berbayar. mix.wav dan voice.wav adalah keluaran sementara, tidak dikomit.

## Paket akhir

- `instagram/day3-reel.mp4`, `instagram/day3-cover.png`, `instagram/day3-POSTING.md`.
- `tiktok/day3-tiktok.mp4`, `tiktok/day3-cover.png`, `tiktok/day3-POSTING.md`.
- Subtitle tambahan: `pieces/warung-day3/captions.srt`.
- Spesifikasi: 1080×1920, 24 fps, H.264/AAC, 95 detik.

Posting IG hanya saat user meminta; TikTok tetap manual. Tetapkan tanggal penutupan voting berdasarkan hari publikasi aktual, bukan tanggal pembuatan video.

## Validasi final

- TypeScript dan ESLint pada file yang diubah: lolos.
- Timing 30 baris dan seluruh waktu kata berada dalam rentang 0–95 detik: lolos.
- Frame tiap adegan IG dan TikTok diperiksa, termasuk koreksi posisi label penutup TikTok.
- Detail decode, dimensi, durasi, FPS, audio, loudness dan SHA-256: lihat `validation.json`.
- Penutup TikTok diperbaiki dengan render frame 1848–2279, lalu disambungkan pada detik 77; audio AAC asli dipertahankan. Video hasil sambungan diperiksa ulang.

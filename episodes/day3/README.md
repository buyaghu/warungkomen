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
- Tata letak aktif: gambar penuh, karakter besar, tanpa subtitle narasi terus-menerus atau panel bawah. Teks berupa penekanan sesekali dan kartu komentar. Lihat arahan terbaru user di bagian akhir.
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
- Transkrip SRT arsip: `pieces/warung-day3/captions.srt` (tidak dirender ke video).
- Spesifikasi: 1080×1920, 24 fps, H.264/AAC, 95 detik.

Posting IG hanya saat user meminta; TikTok tetap manual. Tetapkan tanggal penutupan voting berdasarkan hari publikasi aktual, bukan tanggal pembuatan video.

## Validasi final

- TypeScript dan ESLint pada file yang diubah: lolos.
- Timing 30 baris dan seluruh waktu kata berada dalam rentang 0–95 detik: lolos.
- Frame tiap adegan IG dan TikTok diperiksa, termasuk koreksi posisi label penutup TikTok.
- Detail decode, dimensi, durasi, FPS, audio, loudness dan SHA-256: lihat `validation.json`.
- Riwayat: penutup TikTok versi pertama pernah diperbaiki terpisah. Revisi tata letak terbaru mengganti seluruh adegan dan berlaku pada kedua platform.

## Revisi tata letak atas koreksi user

User melaporkan subtitle menutupi karakter dan nama akun sulit terlihat. Perbaikan visual ini tidak mengubah naskah, suara, hasil voting, atau durasi.

- Komponen adegan baru: `src/scenes/Day3Layout.tsx`. Main `WarungDay3.tsx` menggunakan layout ini.
- Adegan dibatasi pada y0–1190; aktor dan properti utama ditata ulang agar tetap utuh dalam area tersebut.
- Subtitle ditempatkan pada panel terpisah di bawah panggung, pusat y1300, maksimal dua baris. Jarak minimum antara batas panggung dan tepi subtitle 34,5 px termasuk outline.
- Nama akun tampil pada kartu komentar berukuran besar (40–56 px), dengan label platform, kutipan dan like yang relevan. Nama tidak ditempel pada tubuh/gerobak.
- Kedua varian kini memakai framing aman yang sama, sehingga satu master render dapat digunakan untuk IG maupun TikTok tanpa render/enkode ulang atau perubahan suara.
- Empat akun yang dikreditkan berasal dari komentar penonton yang sudah ditinjau; screenshot mentah dan daftar pengikut tidak ditambahkan ke repo.
- Frame tiap adegan dan detik 14 diperiksa. Batas subtitle untuk seluruh 30 baris dicatat pada `layout-validation.json`. Master pengganti selesai; kedua MP4 lolos decode utuh, durasi 95,019 detik, 1080×1920, 24 fps, audio −14,02 LUFS.

Kartu label di pembuka dirapikan dengan render frame 0–359 lalu digabung pada detik 15. Audio AAC master dipertahankan. Master hasil akhir digunakan untuk kedua platform, karena tata letak dan properti tampilan keduanya identik.

## Arahan terbaru user — gambar penuh, tanpa subtitle berjalan

User menolak pengecilan adegan untuk memberi ruang subtitle. Perbaikan terbaru mengembalikan gambar penuh 1080×1920 dan karakter besar, menghapus seluruh layer subtitle narasi serta panel bawah. Teks hanya berupa penekanan adegan, kartu komentar, papan menu dan CTA.

- Komponen aktif sekarang `src/scenes/Day3Full.tsx`; root tidak memakai clipPath, Captions3 atau Footer3. Tata letak panel v2 di atas hanya riwayat, bukan hasil akhir.
- Kartu akun besar tetap dipakai, ditempatkan di ruang kosong di atas karakter. Pemenang dan runner-up tetap terlihat jelas.
- Naskah, audio dan durasi 95 detik tidak berubah.
- Contoh frame diperiksa pada seluruh rangkaian adegan; render pengganti berlangsung.

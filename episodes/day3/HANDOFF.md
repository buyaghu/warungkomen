# Serah terima: Day 3 Warung Komen

Ditulis Sabtu 7 Nov 2026 malam, setelah Day 2 tayang. Baca `CLAUDE.md` dulu.

## Status Day 2

- **Instagram:** tayang 7 Nov 2026, 21.07 WIB: https://www.instagram.com/reel/DfcW6oGlycE/
  - media id `18116197025133137`. Komentar aturan Day 3 sudah diposting (id `18471551608190111`); pin manual oleh user.
  - Posting pertama (20.50 WIB, media `18003123506812320`) **diarsipkan** user. Jangan dihitung/dipakai.
- **TikTok:** paket di `tiktok/day2-POSTING.md`; diunggah manual oleh user. Tanyakan link/statusnya.
- Isi Day 2: ayam geprek (menu #1), pelanggan pertama @_.szsbillaa, papan pelanggan 1 → 5,
  kubu nasgor & mie ayam protes, ajakan "ADU LIKE: MENU KE-2".

## Voting Day 3

- **Batas:** Minggu 8 Nov 2026, **17.00 WIB** (10.00 UTC). Aturan: **satu komen dengan like terbanyak** menang,
  gabungan IG + TikTok (seperti Day 1, lihat `episodes/day1/results.md`).
- **Ambil komen IG:** Composio `INSTAGRAM_GET_IG_MEDIA_COMMENTS` (ig_media_id `18116197025133137`,
  fields `id,text,like_count,timestamp`). Username komentator tidak keluar dari API: minta screenshot ke user.
- **TikTok:** minta screenshot komen (dengan jumlah like) ke user.
- Buat `episodes/day2/results.md` (format sama dengan `episodes/day1/results.md`): inventaris komen, like,
  pemenang, runner-up, komen nyeleneh, nama yang bisa ditampilkan. Komen lewat batas jam 17.00 tidak dihitung.

## Day 3: arah cerita (usulan, minta persetujuan user)

- Menu pemenang masuk papan sebagai **menu #2** (menu #1 ayam geprek tetap ada).
- Kalau pemenangnya nasgor atau mie ayam: payoff dari protes Day 2 ("kubu ___ menang!").
- Pelanggan bertambah dari 5. Pakai nama komentator (dari screenshot user). Daftar pengikut sengaja tidak disimpan di repo publik ini; minta screenshot daftar pengikut ke user kalau perlu.
- Ide: papan "PELANGGAN SETIA" untuk yang komen di Day 1 dan Day 2.
- Ajakan penutup: "ADU LIKE: MENU KE-3".

## Produksi Day 3

1. Naskah ±16–18 baris (maks ±8 kata/baris), gaya `characters/mang-juned.md`. Minta persetujuan.
2. Suara: ElevenLabs (voice id di `CLAUDE.md`), satu node per baris dalam satu flow; unduh take ke
   `pieces/warung-day3/voice/takes/`, pilih take dengan transkripsi (faster-whisper), percepat `atempo` kalau
   terlalu panjang, lalu `voice.mjs`.
3. Remotion: salin pola `src/scenes/Day2.tsx` → `Day3.tsx`, `WarungDay2.tsx` → `WarungDay3.tsx`, tambah
   `DAY3`/`DAY3_TIKTOK` di `src/episode.ts` (`menu: ["Ayam geprek", "<menu #2>"]`, `handles` TikTok), daftarkan di `Root.tsx`.
   Komponen yang bisa dipakai ulang: `Comment` (kartu komen + nama), `NameTag`/`Customer` (nama di atas kepala,
   pakai `spot()` supaya bergiliran), `MenuBoard`, `Plate`, `Cobek`, `Burst`.
4. Audio: salin `pieces/warung-day2/mix.py`, ganti cue sfx sesuai adegan.
5. Render IG + TikTok, cek still tiap adegan, salin ke `instagram/day3-reel.mp4` dan `tiktok/day3-tiktok.mp4`.
6. Posting IG (Composio) saat user minta: ambil file dari GitHub blob API di workbench Composio →
   `upload_local_file` → `INSTAGRAM_POST_IG_USER_MEDIA` (REELS, `video_file` s3key, `thumb_offset`,
   `share_to_feed`) → `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH` → komentar aturan via `INSTAGRAM_POST_IG_MEDIA_COMMENTS`.
   Caption IG: mention @username IG penonton yang tampil.
7. Paket TikTok: `tiktok/day3-POSTING.md` (video, cover, caption dengan @username TikTok, komentar pin, label AI).


## Pembaruan 8 November 2026 — hasil dan draf

- User menyetujui screenshot terakhir sekitar 20.57–21.01 WIB sebagai dasar voting khusus Day 3, menggantikan snapshot batas awal 17.00 WIB.
- Menu pemenang **Mie ayam**, satu komentar TikTok 42 like; runner-up nasi goreng IG 28 like. Ringkasan di `episodes/day2/results.md`.
- Draf 18 baris dan usulan adegan: `episodes/day3/NASKAH.md`. **Belum disetujui user; belum produksi suara/video dan belum posting.**
- Usulan pelanggan cerita 5 → 8; tidak disamakan dengan angka pengikut.
- Identitas pemenang dan komentar asli tersedia dalam percakapan kerja; cocokkan handles episode sebelumnya sebelum produksi. Jangan salin daftar pengikut atau folder screenshot ke repo publik.
- Langkah berikutnya: minta tinjauan naskah konkret, revisi sesuai masukan, baru produksi setelah disetujui.

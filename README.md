# Warung Komen

Seri video pendek harian: **Mang Juned**, korban PHK, membuka warung gerobak, dan **menunya ditentukan oleh komen penonton**.
Satu episode per hari ("Day N"). Tayang di Instagram dan TikTok **@warungkomen**.

- Komen = pesan menu. Komen dengan like terbanyak sampai jam 17.00 WIB besoknya = dimasak di episode berikutnya.
- Menu **bertambah** setiap hari (papan MENU), gerobak = **CABANG 1/100**.
- Nama penonton yang berkomentar ditampilkan di video.

## Status

| Episode | Menu | Status |
|---|---|---|
| Day 1 | (papan menu kosong) | Tayang 6 Nov 2026 (IG + TikTok) |
| Day 2 | 1. Ayam geprek | IG tayang 7 Nov 2026 21.07 WIB: https://www.instagram.com/reel/DfcW6oGlycE/ · TikTok diunggah manual oleh user |
| Day 3 | 2. Mie ayam (ayam geprek tetap ada) | IG dijadwalkan 9 Nov 2026 pukul 11.00 WIB; paket TikTok manual siap untuk jam yang sama. Belum terbit saat persiapan. Lihat `episodes/day3/HANDOFF.md`. |
| Day 4 | 3. Nasi daun jeruk | IG tayang 10 Nov 2026 20.53 WIB: https://www.instagram.com/reel/DfkDr-YkejE/ · TikTok tayang lewat Higgsfield (10 Nov malam). Lihat `episodes/day4/HANDOFF.md`. |

## Isi repo

| Folder | Isi |
|---|---|
| `characters/mang-juned.md` | Panduan karakter dan gaya bicara (gw/elu, Betawi-Sunda, nyablak). **Wajib dibaca.** |
| `episodes/KONSEP.md` | Konsep seri yang sudah disetujui (menu bertambah, cabang 1/100). |
| `episodes/dayN/` | Hasil voting, serah terima, catatan produksi per episode. |
| `remotion/warung-netizen/` | Proyek video (Remotion). Komposisi `WarungDay1`, `WarungDay2`, versi `…TikTok`. |
| `pieces/warung-dayN/` | Naskah suara, take ElevenLabs, timing per kata (`voice.json`), skrip mix audio. |
| `instagram/`, `tiktok/` | File final yang diposting, cover, paket akun, panduan posting. |
| `.claude/skills/animate/` | Skill animasi (MIT, cth9191/animate); dipakai untuk `tools/voice.mjs` (timing per kata). |

## Melanjutkan dengan Claude

Baca `CLAUDE.md`, lalu `episodes/day4/HANDOFF.md`.

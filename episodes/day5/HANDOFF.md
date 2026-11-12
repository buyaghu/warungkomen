# Serah terima: Day 5 Warung Komen — BAKSO KEJU

Ditulis Kamis 12 Nov 2026 malam. Baca `CLAUDE.md` dulu.

## Status

- Voting Day 4 → pemenang **Bakso keju**, @evelyn.chipi67 (IG), **58 like** (rekor). Rincian: `results.md`, bukti screenshot di `bukti/`.
- Keputusan user 12 Nov (dicatat di `episodes/KONSEP.md`):
  - **Dana cabang 2 (A+B):** toples MODAL (tabungan, tidak pernah cukup) + **Babe Rojali** (juragan gerobak bekas) janji gerobak kedua saat 1.000 pelanggan, bayar nyicil.
  - **PELANGGAN = total pengikut nyata IG + TikTok** (bio: "Follow = jadi pelanggan"). Day 5: 673 (IG 31 + TikTok 642, 12 Nov 21.15 WIB). Papan: PELANGGAN 673 / 1.000 → CABANG 2.
- Naskah disetujui ("Lanjut produksi dan posting sekarang aja"): `NASKAH.md`. Baris l07 dan l16 dipotong di audio demi durasi (gag bakso kotak tetap di gambar).
- Suara: flow ElevenLabs https://elevenlabs.io/app/flows/x6rw4s1om62VxZ1nJ6rU , 2 take per baris (l19 hanya 1 take; take kedua macet pending). Audit `audit_takes.py` (faster-whisper small), rakit `build_voice.py`, tempo 1,16–1,25x. **Durasi 67 detik.**
- Audio: `mix.py` → loudnorm −14 LUFS → `remotion/warung-netizen/public/day5/audio.wav`.
- Remotion: `src/scenes/Day5Full.tsx` (Hook5, Drinks, Cook5, Serve, Lapak, Closing5; komponen baru `Bakso`, `BaksoBowl`, `Jar`, `Rojali`), `src/WarungDay5.tsx`, `DAY5`/`DAY5_TIKTOK`, `CoverDay5`. Angka pelanggan: konstanta `PELANGGAN`/`TARGET` di `Day5Full.tsx`.
- Output: `instagram/day5-reel.mp4`, `tiktok/day5-tiktok.mp4` (file sama), cover `day5-cover.png/jpg`, caption + komentar pin di kedua folder.
- Voting Day 6 ditutup **Sabtu 14 Nov 2026, 17.00 WIB**.

## Posting

Lihat `publish-result.json` (diisi setelah terbit).

## Untuk Day 6

- Ambil angka pengikut nyata saat produksi untuk papan PELANGGAN n / 1.000 (IG: Composio `INSTAGRAM_GET_USER_INFO`; TikTok: TikHub `TIK_HUB_TIKTOK_APP_V3_GET_USER_PROFILE`).
- Toples MODAL terus terisi pelan-pelan; Babe Rojali boleh muncul sebentar.
- Day 5 TikTok: cari aweme_id lewat `TIK_HUB_TIKTOK_APP_V3_FETCH_VIDEO_SEARCH_RESULT` (keyword `warungkomen`, region `ID`).

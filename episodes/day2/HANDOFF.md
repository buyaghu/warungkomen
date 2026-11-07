# Serah terima: buat video Day 2 Warung Komen

Baca file ini dulu sebelum mengerjakan Day 2. Semua keputusan di bawah sudah disetujui user.

## Konteks proyek

- **Seri:** Warung Komen. Mang Juned (korban PHK) membuka warung gerobak, dan menunya ditentukan dari komen penonton. Satu episode per hari: "Day N".
- **Akun:** Instagram `@warungkomen` (Kreator, tersambung ke Composio sebagai akun `instagram_mumper-tickle`, ig_user_id `39546597871650793`) dan TikTok `@warungkomen` (upload manual dari HP, tidak tersambung).
- **Day 1 sudah tayang** (6 Nov 2026, 23.00 WIB). Hasil dan inventaris komennya: `episodes/day1/results.md`.

## Keputusan untuk Day 2

- **Menu pemenang: AYAM GEPREK.** Komen IG "Semangat kakkk, ayam geprek aja kaaa", 5 like.
- **Runner-up dan bahan drama:** nasi goreng (komen TikTok 3 like; bersama mie ayam paling banyak disebut, 6 kali). Kubu nasgor dan mie ayam "protes" → buka voting Day 3.
- **Komen nyeleneh untuk dicolek:** "Jualan sawit kakk", "baso tanpa tepung" (balasan kreator: "itu bukan bakso, itu rendang custom bentuk bulat"), "borong apa aja yg ditulis netizen lain", "legeg", onigiri dengan meme kucing, "Warung Mas Joko".
- **Pelanggan pertama di Buku Bon:** pengirim komen ayam geprek (IG `_.szsbillaa`).
- **Hasil final:** like komen TikTok "lontong ayam" sudah dikonfirmasi 0, jadi ayam geprek tetap pemenang.

## Karakter dan suara

- **Panduan karakter (wajib dibaca):** `characters/mang-juned.md`. Mang Juned, Betawi-Sunda, **gw/elu**, nyablak.
- **Suara narasi:** ElevenLabs "Mang Juned (Warung Komen)", `voice_id: bwyCvXbDGcE93hF4UWld`, model `eleven_v4`. Day 1 masih memakai suara lama "Wibowo"; Day 2 adalah episode pertama dengan suara baru.
- **Lip-sync:** mulut Juned digerakkan dari timing kata di `voice.json` (lihat `mouthAt` di `remotion/warung-netizen/src/lib.ts`).

## Produksi (Remotion: pilihan user, bukan cut-paper)

- **Proyek:** `remotion/warung-netizen/`. Jalankan `npm i` dulu, karena node_modules tidak ikut di repo.
- **Bahan yang bisa dipakai ulang:** `src/Juned.tsx` (karakter + lip-sync), `src/Props.tsx` (Sky, Ground, Cloud, Gerobak, Sticker, Caption, Board, Cat, Birds), `src/lib.ts` (FPS 24, palet, `pop`, `ev`, `VW`, `mouthAt`), dan pola adegan di `src/scenes/Part1.tsx` dan `Part2.tsx`.
- **Font:** Fredoka sudah dibundel lokal di `public/fonts/fredoka.woff2`. Jangan pakai Google Fonts, karena render headless tidak bisa mengambilnya lewat proxy.
- **Episode props:** `src/episode.ts` (`EpisodeSchema`, `captionY`). IG: `captionY` 1450. TikTok: 1280, di atas area deskripsi TikTok.
- **Dua render:** versi IG (`WarungDay2`) dan versi TikTok (`WarungDay2TikTok`), 9:16, 1080×1920, sekitar 45–60 detik.
- **Audio:** buat baris narasi di ElevenLabs (satu file per baris), susun timing per kata seperti di `pieces/warung-day1/voice.json` dengan `.claude/skills/animate/tools/voice.mjs <piece> --model small --lang id`, lalu tambahkan musik dan efek suara. Day 1 memakai mix dari skill animate; untuk Day 2 boleh membuat mix baru dengan cara yang sama, atau memakai musik sederhana.
- **Cek visual:** render still per adegan, pastikan teks tidak terpotong, tidak tertutup UI IG/TikTok, dan tidak bertumpuk.

## Alur Day 2 (usulan, minta persetujuan user dulu)

1. Pembuka: "Day 2". Mang Juned membacakan hasil voting secara nyablak ("elu pada pelit like… nyang menang: AYAM GEPREK!").
2. Colek 2–3 komen nyeleneh (sawit, bakso tanpa tepung, borong semua).
3. Memasak ayam geprek: belanja, menggoreng, mengulek sambal, gerobak mulai berasap. Ada adegan sial-lucu.
4. Pelanggan pertama datang. Nama di Buku Bon. Papan PELANGGAN 1 → beberapa.
5. Kubu nasi goreng dan mie ayam protes → CTA voting Day 3: "Komen menu besok!"

Ikuti alur kerja skill: cek cerita → cek tampilan → storyboard → render. Tanyakan pilihan ke user dengan opsi.

## Posting

- **Instagram:** lewat Composio. Ambil file video dari repo dengan GitHub blob API di workbench Composio, lalu `upload_local_file` → `INSTAGRAM_POST_IG_USER_MEDIA` (REELS, `video_file` s3key, `thumb_offset`) → cek status FINISHED → publish di jam yang dijadwalkan (pakai `send_later`). Komentar aturan bisa diposting lewat `POST /{media-id}/comments`. Pin komentar dilakukan manual.
- **TikTok:** manual dari HP, pakai file versi TikTok.
- **Jadwal saran:** 19.00 WIB.
- **Caption:** gaya Mang Juned (gw/elu) + `#warungkomen #day2`.

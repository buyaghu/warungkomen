# Konsep seri Warung Komen (disetujui user, 7 Nov 2026)

- **Mang Juned bukan chef.** Dia pemilik warung gerobak yang masak sendiri: korban PHK, modal pesangon,
  gerobak bekas. Topi chef hanya muncul di mimpi (restoran 100 cabang). Sehari-hari pakai celemek oranye.
- **Gerobak = cabang pertama.** Target besar: 100 cabang. Di layar selalu ada **CABANG n/100**.
- **Menu BERTAMBAH, tidak bergilir.** Setiap hari, komen dengan like terbanyak menjadi menu baru yang
  ditambahkan ke papan MENU. Menu lama tetap ada.
  - Day 1: papan menu kosong.
  - Day 2: 1. Ayam geprek.
  - Day 3: 2. (pemenang voting Day 2), dan seterusnya.
- **Papan gerobak tetap "WARUNG KOMEN"**, bukan nama menu. Menu ditulis di papan kapur di sebelah gerobak.
- **Pelanggan dan cabang tumbuh pelan-pelan.** Angka di papan PELANGGAN naik tiap episode. Cabang ke-2
  menjadi momen besar di masa depan (misalnya saat pengikut tembus angka tertentu); belum diputuskan kapan.
- Di Remotion, daftar menu adalah prop episode: `menu` di `src/episode.ts`. Untuk Day N, salin daftar
  Day N−1 dan tambah satu item.

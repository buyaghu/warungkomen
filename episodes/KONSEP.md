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
- **Pelanggan = pengikut.** Sejak Day 5 (disetujui user 12 Nov 2026) angka PELANGGAN di papan = total pengikut nyata IG + TikTok saat produksi ("Follow = jadi pelanggan" di bio). Day 1–4 masih angka cerita (1, 5, 8, 11). Cabang tumbuh pelan-pelan. Cabang ke-2
  menjadi momen besar: lihat bagian "Cabang 2" di bawah (target 1.000 pengikut, lalu voting lokasi).
- Di Remotion, daftar menu adalah prop episode: `menu` di `src/episode.ts`. Untuk Day N, salin daftar
  Day N−1 dan tambah satu item.

## Cabang 2 (disetujui user, 10 Nov 2026)

- **Pemicu:** total pengikut IG + TikTok @warungkomen tembus **1.000**. Angka awal saat disetujui: 644 (TikTok 620 + IG 24).
- **Mulai Day 5:** tampilkan papan "PELANGGAN n / 1.000 → CABANG 2" di setiap episode, dengan angka nyata saat produksi
  (IG: Composio `INSTAGRAM_GET_USER_INFO`; TikTok: TikHub `TIK_HUB_TIKTOK_APP_V3_GET_USER_PROFILE`). Jadikan ajakan follow.
- **Saat tembus 1.000:** buka voting netizen untuk lokasi dan nama cabang 2, dengan aturan yang sama seperti voting menu
  (satu komen, like terbanyak di IG + TikTok). Episode berikutnya: Mang Juned membuka cabang 2 di lokasi pemenang; layar menjadi CABANG 2/100.
- Voting menu harian tetap berjalan seperti biasa.

### Dana cabang 2 (disetujui user, 12 Nov 2026: opsi A+B)

- **Toples MODAL (tabungan omzet):** tiap episode receh dari pelanggan masuk toples MODAL dan terlihat bertambah pelan-pelan (angka cerita, seperti PELANGGAN). Isinya tidak pernah cukup untuk gerobak kedua.
- **Babe Rojali:** juragan gerobak bekas, tempat Juned beli gerobak pertama. Janji: kalau pengikut tembus 1.000, gerobak kedua dikasih dan dibayar nyicil dari omzet (isi toples). Inilah alasan cerita target 1.000 pengikut.
- Saat tembus 1.000: Babe Rojali menyerahkan gerobak kedua, Juned mengosongkan toples untuk cicilan pertama dan menambah halaman di buku bon.
- Jangan dibingkai sebagai donasi atau investasi sungguhan dari penonton; follow cukup "bantu Juned dapet gerobak".

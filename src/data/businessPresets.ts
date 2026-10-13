/**
 * Presets and Dynamic Label Configuration for UsahaQu 1.61 Core Engine
 * Supports 5 Business Presets: BengkelQu, KedaiQu, RitelQu, KlinikQu, TitipQu
 */

export type BusinessPresetType = 'bengkelqu' | 'kedaiqu' | 'ritelqu' | 'klinikqu' | 'titipqu';

export interface BusinessPresetConfig {
  id: BusinessPresetType;
  appName: string;
  tagline: string;
  categoryName: string;
  badgeCode: string;
  iconName: string;
  colorTheme: string;
  
  // Dynamic Labels
  labels: {
    // Core Module Labels
    serviceModule: string;       // Servis | Pesanan | Penjualan | Tindakan | Titip Jual
    serviceSubtitle: string;
    itemOrPart: string;           // Sparepart | Bahan & Menu | Stok Barang | Obat/Alkes | Barang Titipan
    itemOrPartPlural: string;
    unitOrVehicle: string;        // Kendaraan | Meja/Dapur | Barcode/SKU | Pasien | Penitip/Vendor
    unitIdentifier: string;       // No. Polisi | No. Meja | Barcode / SKU | No. Rekam Medis / NIK | Kode Penitip / Vendor
    unitModelLabel: string;       // Tipe Kendaraan | Tipe Pesanan (Dine-in/Takeaway) | Kategori Produk | Keluhan / Poli | Komisi / Bagi Hasil
    operatorOrStaff: string;      // Mekanik | Koki / Pelayan | Kasir / Pramuniaga | Dokter / Tenaga Medis | Penjaga Toko / Petugas
    operatorPlural: string;
    customerLabel: string;        // Pelanggan | Tamu / Pelanggan | Pembeli / Member | Pasien | Pembeli & Mitra Penitip
    
    // Work Order / Process Steps (5 Steps)
    flowStep1: string;            // Registrasi Unit Masuk | Pesanan Baru | Kasir POS Baru | Pendaftaran Pasien | Penerimaan Titipan
    flowStep2: string;            // Antrian Servis | Antrian Dapur | Scan & Pilih Barang | Antrian Berobat | Penjualan di Kasir
    flowStep3: string;            // Pengerjaan Mekanik | Proses Masak Dapur | Hitung Grosir/Eceran | Pemeriksaan & Resep | Rekap Hasil Terjual
    flowStep4: string;            // Selesai & Penyerahan | Makanan Siap / Antar | Cetak Nota Bluetooth | Kasir & Ambil Obat | Hitung Bagi Hasil
    flowStep5: string;            // Total Servis | Total Pesanan | Closing Shift POS | Total Tindakan Medis | Retur Barang Sisa
    
    // POS & Cashier Specifics
    cashierModule: string;        // Kasir | Kasir & Pesanan | Kasir POS | Kasir Farmasi | Kasir Konsinyasi
    cashierTicketName: string;    // Tiket Servis | Tiket Dapur/Bar | Struk Belanja | Resep & Faktur | Nota Konsinyasi
    
    // Inventory & Catalog Specifics
    stockModule: string;          // Stok | Bahan & Menu | Stok Barang | Obat & Alkes | Barang Titipan
    criticalStockAlert: string;   // Suku Cadang Menipis | Bahan Baku Menipis | Peringatan Stok Kritis | Obat & Alkes Kritis | Stok Titipan Kritis
    inboundStockTitle: string;    // Sparepart Datang | Penerimaan Bahan Masuk | Restok dari Supplier | Penerimaan Obat Masuk | Penerimaan Barang Titipan
    damagedStockTitle: string;    // Barang Rusak / Afkir | Makanan Rusak / Basi | Barang Rusak / Cacat | Obat Expired / Rusak | Retur Barang Sisa / Rusak
    
    // Feature Specific Highlight
    specificFeatureTitle: string;
    specificFeatureDesc: string;
  };

  // Sample Categories
  sampleCategories: string[];
  
  // Sample Units (e.g. Botol, Porsi, Pcs, Tablet, Bungkus)
  sampleUnits: string[];
}

export const BUSINESS_PRESETS: Record<BusinessPresetType, BusinessPresetConfig> = {
  bengkelqu: {
    id: 'bengkelqu',
    appName: 'BengkelQu',
    tagline: 'Solusi Lengkap Manajemen Bengkel Motor & Mobil',
    categoryName: 'Jasa Otomotif & Servis',
    badgeCode: 'BQ',
    iconName: 'Wrench',
    colorTheme: '#008952',
    labels: {
      serviceModule: 'Servis',
      serviceSubtitle: 'Operasional Antrian & Servis Unit',
      itemOrPart: 'Sparepart',
      itemOrPartPlural: 'Suku Cadang & Sparepart',
      unitOrVehicle: 'Kendaraan',
      unitIdentifier: 'No. Polisi',
      unitModelLabel: 'Tipe Kendaraan',
      operatorOrStaff: 'Mekanik',
      operatorPlural: 'Tim Mekanik',
      customerLabel: 'Pelanggan',
      
      flowStep1: 'Registrasi Unit Masuk',
      flowStep2: 'Antrian Servis',
      flowStep3: 'Proses Pengerjaan Mekanik',
      flowStep4: 'Selesai & Penyerahan',
      flowStep5: 'Total Servis',
      
      cashierModule: 'Kasir',
      cashierTicketName: 'Tiket Servis',
      
      stockModule: 'Stok',
      criticalStockAlert: 'Sparepart Kritis (Menipis)',
      inboundStockTitle: 'Sparepart Datang (Inbound)',
      damagedStockTitle: 'Barang Rusak / Afkir',
      
      specificFeatureTitle: 'Riwayat Servis Berkala per No. Polisi',
      specificFeatureDesc: 'Lacak riwayat servis rutin, ganti oli, dan riwayat keluhan berdasarkan Nomor Polisi kendaraan.'
    },
    sampleCategories: [
      'Oli & Pelumas',
      'Sistem Rem',
      'Transmisi / CVT',
      'Busi & Kelistrikan',
      'Ban & Velg',
      'Filter & Karburator',
      'Jasa Bengkel'
    ],
    sampleUnits: ['Botol', 'Pcs', 'Set', 'Bungkus', 'Liter']
  },

  kedaiqu: {
    id: 'kedaiqu',
    appName: 'KedaiQu',
    tagline: 'Sistem Kasir & Operasional Dapur F&B / Cafe / Warung',
    categoryName: 'Kuliner & F&B / Cafe / Warung',
    badgeCode: 'KQ',
    iconName: 'UtensilsCrossed',
    colorTheme: '#D97706',
    labels: {
      serviceModule: 'Pesanan',
      serviceSubtitle: 'Pesanan Meja & Alur Dapur',
      itemOrPart: 'Menu / Bahan',
      itemOrPartPlural: 'Daftar Menu & Bahan Baku',
      unitOrVehicle: 'Meja / Lokasi',
      unitIdentifier: 'No. Meja / Lokasi',
      unitModelLabel: 'Tipe Pesanan (Dine-in / Takeaway)',
      operatorOrStaff: 'Koki / Pelayan',
      operatorPlural: 'Koki & Pelayan',
      customerLabel: 'Tamu / Pelanggan',
      
      flowStep1: 'Pesanan Baru (Dine-in / Takeaway)',
      flowStep2: 'Antrian Dapur',
      flowStep3: 'Proses Masak Dapur',
      flowStep4: 'Makanan Siap / Antar',
      flowStep5: 'Total Pesanan',
      
      cashierModule: 'Kasir',
      cashierTicketName: 'Tiket Pesanan Dapur & Bar',
      
      stockModule: 'Stok',
      criticalStockAlert: 'Bahan Baku Kritis / Hampir Habis',
      inboundStockTitle: 'Penerimaan Bahan Baku Masuk',
      damagedStockTitle: 'Bahan Basi / Rusak (Spoilage)',
      
      specificFeatureTitle: 'Cetak Tiket Dapur / Bar & Manajemen Nomor Meja',
      specificFeatureDesc: 'Kirim tiket pesanan langsung ke seksi dapur/bar dan lacak status meja yang sedang terisi.'
    },
    sampleCategories: [
      'Makanan Berat',
      'Camilan / Snack',
      'Minuman Kopi',
      'Minuman Non-Kopi',
      'Bahan Baku Dapur',
      'Bahan Tambahan'
    ],
    sampleUnits: ['Porsi', 'Pcs', 'Cup', 'Gelas', 'Bungkus', 'Kg', 'Liter']
  },

  ritelqu: {
    id: 'ritelqu',
    appName: 'RitelQu',
    tagline: 'POS Cepat, Barcode Scanner, & Multi-Harga Eceran / Grosir',
    categoryName: 'Toko, Minimarket, Fashion & Grosir',
    badgeCode: 'RQ',
    iconName: 'ShoppingBag',
    colorTheme: '#2563EB',
    labels: {
      serviceModule: 'Penjualan',
      serviceSubtitle: 'Transaksi Kasir POS & Kasir Cepat',
      itemOrPart: 'Stok Barang',
      itemOrPartPlural: 'Katalog Barang & SKU',
      unitOrVehicle: 'Barcode / SKU',
      unitIdentifier: 'Barcode / Kode SKU',
      unitModelLabel: 'Harga (Eceran / Grosir)',
      operatorOrStaff: 'Kasir / Pramuniaga',
      operatorPlural: 'Kasir & Pramuniaga',
      customerLabel: 'Pembeli / Member',
      
      flowStep1: 'Transaksi Kasir POS',
      flowStep2: 'Scan Barcode Camera / HP',
      flowStep3: 'Opsi Harga Grosir vs Eceran',
      flowStep4: 'Cetak Nota Bluetooth',
      flowStep5: 'Closing Shift Kasir',
      
      cashierModule: 'Kasir POS',
      cashierTicketName: 'Struk Belanja Kasir',
      
      stockModule: 'Stok',
      criticalStockAlert: 'Peringatan Stok Kritis (Mau Habis)',
      inboundStockTitle: 'Input Restok dari Supplier',
      damagedStockTitle: 'Barang Rusak / Cacat / Return',
      
      specificFeatureTitle: 'Peringatan Stok Kritis & Input Restok dari Supplier',
      specificFeatureDesc: 'Alert otomatis saat stok di bawah batas minimal, scan barcode cepat, dan opsi harga eceran vs grosir.'
    },
    sampleCategories: [
      'Makanan & Minuman Kemasan',
      'Kebutuhan Pokok (Sembako)',
      'Perawatan Tubuh & Sabun',
      'Alat Tulis & Kantor',
      'Pakaian / Fashion',
      'Aksesoris & Lainnya'
    ],
    sampleUnits: ['Pcs', 'Pack', 'Dus', 'Lusin', 'Bungkus', 'Kg']
  },

  klinikqu: {
    id: 'klinikqu',
    appName: 'KlinikQu',
    tagline: 'Praktek Dokter, Apotek, Rekam Medis, & Layanan Terintegrasi',
    categoryName: 'Jasa Kesehatan, Apotek & Perawatan',
    badgeCode: 'KlQ',
    iconName: 'HeartPulse',
    colorTheme: '#0D9488',
    labels: {
      serviceModule: 'Tindakan',
      serviceSubtitle: 'Pemeriksaan / Tindakan & Rekam Medis',
      itemOrPart: 'Obat / Alkes',
      itemOrPartPlural: 'Master Obat & Alat Kesehatan',
      unitOrVehicle: 'Pasien',
      unitIdentifier: 'ID Pasien / Rekam Medis',
      unitModelLabel: 'Poli / Kategori Pasien',
      operatorOrStaff: 'Dokter / Tenaga Medis',
      operatorPlural: 'Dokter, Bidan & Perawat',
      customerLabel: 'Pasien',
      
      flowStep1: 'Pendaftaran Pasien',
      flowStep2: 'Antrian Berobat',
      flowStep3: 'Pemeriksaan & Resep Dokter',
      flowStep4: 'Kasir & Pengambilan Obat',
      flowStep5: 'Total Tindakan Medis',
      
      cashierModule: 'Kasir Farmasi',
      cashierTicketName: 'Faktur Tindakan & Resep Obat',
      
      stockModule: 'Stok',
      criticalStockAlert: 'Obat Kritis / Menipis',
      inboundStockTitle: 'Penerimaan Obat & Alkes Masuk',
      damagedStockTitle: 'Obat Expired / Rusak',
      
      specificFeatureTitle: 'Pencatatan Rekam Medis Ringkas & Riwayat Berobat',
      specificFeatureDesc: 'Catatan diagnosa, resep obat yang diberikan, serta histori riwayat berobat pasien terdata rapi.'
    },
    sampleCategories: [
      'Obat Bebas & Sirup',
      'Antibiotik & Resep Dokter',
      'Vitamin & Suplemen',
      'Alat Medis Habis Pakai',
      'Jasa Konsultasi / Tindakan',
      'Salep & Obat Luar'
    ],
    sampleUnits: ['Tablet', 'Strip', 'Botol', 'Ampul', 'Pcs', 'Tube']
  },

  titipqu: {
    id: 'titipqu',
    appName: 'TitipQu',
    tagline: 'Manajemen Konsinyasi, Vendor Penitip, & Bagi Hasil Otomatis',
    categoryName: 'Konsinyasi & Titip Jual',
    badgeCode: 'TQ',
    iconName: 'Boxes',
    colorTheme: '#7C3AED',
    labels: {
      serviceModule: 'Titip Jual',
      serviceSubtitle: 'Alur Penerimaan & Konsinyasi Vendor',
      itemOrPart: 'Barang Titipan',
      itemOrPartPlural: 'Daftar Barang Titipan Mitra',
      unitOrVehicle: 'Penitip / Vendor',
      unitIdentifier: 'Kode Penitip / Vendor',
      unitModelLabel: 'Skema Bagi Hasil / Komisi',
      operatorOrStaff: 'Penjaga Toko / Petugas',
      operatorPlural: 'Petugas Toko & Admin',
      customerLabel: 'Pembeli & Mitra Penitip',
      
      flowStep1: 'Penerimaan Barang Titipan',
      flowStep2: 'Penjualan di Kasir',
      flowStep3: 'Rekap Hasil Terjual',
      flowStep4: 'Penghitungan Bagi Hasil / Komisi',
      flowStep5: 'Retur Barang Sisa',
      
      cashierModule: 'Kasir Konsinyasi',
      cashierTicketName: 'Nota Titip Jual & Bukti Setor',
      
      stockModule: 'Stok',
      criticalStockAlert: 'Stok Barang Titipan Menipis',
      inboundStockTitle: 'Penerimaan Barang Titipan Masuk',
      damagedStockTitle: 'Retur Barang Sisa / Rusak',
      
      specificFeatureTitle: 'Laporan Otomatis Hak Pemasok / Penitip & Rekap Retur',
      specificFeatureDesc: 'Hitung otomatis porsi penjualan pemilik barang vs toko, cetak rekap bagi hasil, dan tanda terima retur sisa.'
    },
    sampleCategories: [
      'Makanan Ringan Titipan',
      'Kue & Roti Basah',
      'Minuman Kemasan Mitra',
      'Kerajinan & Souvenir',
      'Fashion / Pakaian Titip Jual',
      'Aksesoris Lokal'
    ],
    sampleUnits: ['Pcs', 'Bungkus', 'Box', 'Cup', 'Set', 'Toples']
  }
};

/**
 * Helper to fetch config by preset id with fallback to BengkelQu
 */
export function getBusinessPreset(presetId?: BusinessPresetType | string): BusinessPresetConfig {
  if (!presetId) return BUSINESS_PRESETS.bengkelqu;
  const clean = presetId.toLowerCase().trim();
  if (clean.includes('kedai')) return BUSINESS_PRESETS.kedaiqu;
  if (clean.includes('ritel') || clean.includes('retail') || clean.includes('toko')) return BUSINESS_PRESETS.ritelqu;
  if (clean.includes('klinik') || clean.includes('medika') || clean.includes('apotek')) return BUSINESS_PRESETS.klinikqu;
  if (clean.includes('titip') || clean.includes('konsinyasi')) return BUSINESS_PRESETS.titipqu;
  return BUSINESS_PRESETS.bengkelqu;
}

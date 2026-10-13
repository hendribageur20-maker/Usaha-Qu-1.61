/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * UsahaQu 1.61 - Dynamic Preset Manager & State Controller
 * Manages 5 Business Ecosystem Presets on 1 Universal Core Engine:
 * - BengkelQu
 * - KedaiQu
 * - RitelQu
 * - KlinikQu
 * - TitipQu
 */

import { MenuModuleConfig, SubMenuItemConfig } from '../types';

export type ActivePreset = 'BengkelQu' | 'KedaiQu' | 'RitelQu' | 'KlinikQu' | 'TitipQu';

export interface PresetMeta {
  id: 'bengkelqu' | 'kedaiqu' | 'ritelqu' | 'klinikqu' | 'titipqu';
  activePreset: ActivePreset;
  tagline: string;
  category: string;
  logoBadge: 'BQ' | 'KQ' | 'RQ' | 'KlQ' | 'TQ';
  dashboardTitle: string;
  statUnitLabel: string;
  quickActionButtonText: string;
  menu1Title: string;
  menu1Subtitle: string;
  colorTheme: string;
  statLabels: {
    waiting: string;
    inProgress: string;
    completed: string;
  };
  sampleShopName: string;
}

export const PRESET_CONFIGS: Record<ActivePreset, PresetMeta> = {
  BengkelQu: {
    id: 'bengkelqu',
    activePreset: 'BengkelQu',
    tagline: 'Jasa Otomotif, Servis & Suku Cadang',
    category: 'Jasa Otomotif & Servis',
    logoBadge: 'BQ',
    dashboardTitle: 'Menu Utama Bengkel',
    statUnitLabel: 'Unit',
    quickActionButtonText: '+ Antrian',
    menu1Title: 'Servis',
    menu1Subtitle: 'Manajemen Servis & Antrian',
    colorTheme: '#008952',
    statLabels: {
      waiting: 'Menunggu',
      inProgress: 'Dikerjakan',
      completed: 'Selesai'
    },
    sampleShopName: 'BengkelQu Motor Berkah Jaya'
  },
  KedaiQu: {
    id: 'kedaiqu',
    activePreset: 'KedaiQu',
    tagline: 'Kuliner, F&B, Cafe & Resto',
    category: 'Kuliner & F&B / Cafe / Warung',
    logoBadge: 'KQ',
    dashboardTitle: 'Menu Utama Kedai',
    statUnitLabel: 'Meja/Porsi',
    quickActionButtonText: '+ Pesanan',
    menu1Title: 'Pesanan',
    menu1Subtitle: 'Pesanan Meja & Alur Dapur',
    colorTheme: '#D97706',
    statLabels: {
      waiting: 'Menunggu',
      inProgress: 'Dimasak',
      completed: 'Siap Saji'
    },
    sampleShopName: 'KedaiQu Kopi & Dapur Berkah'
  },
  RitelQu: {
    id: 'ritelqu',
    activePreset: 'RitelQu',
    tagline: 'Minimarket, Toko, Fashion & Grosir',
    category: 'Toko, Minimarket & Grosir',
    logoBadge: 'RQ',
    dashboardTitle: 'Menu Utama Toko',
    statUnitLabel: 'Transaksi',
    quickActionButtonText: '+ Kasir POS',
    menu1Title: 'Penjualan',
    menu1Subtitle: 'Transaksi Kasir POS & Cepat',
    colorTheme: '#2563EB',
    statLabels: {
      waiting: 'Antri Kasir',
      inProgress: 'Diproses',
      completed: 'Transaksi Sukses'
    },
    sampleShopName: 'RitelQu Mart Berkah Jaya'
  },
  KlinikQu: {
    id: 'klinikqu',
    activePreset: 'KlinikQu',
    tagline: 'Klinik Medis, Apotek & Praktek Dokter',
    category: 'Jasa Kesehatan, Apotek & Rawat',
    logoBadge: 'KlQ',
    dashboardTitle: 'Menu Utama Klinik',
    statUnitLabel: 'Pasien',
    quickActionButtonText: '+ Pasien Baru',
    menu1Title: 'Tindakan',
    menu1Subtitle: 'Pemeriksaan & Rekam Medis',
    colorTheme: '#0D9488',
    statLabels: {
      waiting: 'Antri Berobat',
      inProgress: 'Diperiksa',
      completed: 'Selesai Resep'
    },
    sampleShopName: 'KlinikQu Medika & Apotek Sehat'
  },
  TitipQu: {
    id: 'titipqu',
    activePreset: 'TitipQu',
    tagline: 'Konsinyasi, Lapak & Titip Jual Mitra',
    category: 'Konsinyasi & Titip Jual',
    logoBadge: 'TQ',
    dashboardTitle: 'Menu Utama Konsinyasi',
    statUnitLabel: 'Barang Titipan',
    quickActionButtonText: '+ Titip Barang',
    menu1Title: 'Titip Jual',
    menu1Subtitle: 'Alur Penerimaan Titipan & Vendor',
    colorTheme: '#7C3AED',
    statLabels: {
      waiting: 'Titipan Masuk',
      inProgress: 'Terjual Kasir',
      completed: 'Rekap Selesai'
    },
    sampleShopName: 'TitipQu Sentra Titip Jual'
  }
};

export const ALL_ACTIVE_PRESETS: ActivePreset[] = [
  'BengkelQu',
  'KedaiQu',
  'RitelQu',
  'KlinikQu',
  'TitipQu'
];

/**
 * Normalizes any preset key (e.g. 'bengkelqu', 'BengkelQu', 'BENGKELQU')
 * into the canonical ActivePreset format.
 */
export function normalizePreset(preset?: string | null): ActivePreset {
  if (!preset) return 'BengkelQu';
  const clean = preset.trim().toLowerCase();
  if (clean.includes('kedai')) return 'KedaiQu';
  if (clean.includes('ritel') || clean.includes('retail') || clean.includes('toko')) return 'RitelQu';
  if (clean.includes('klinik') || clean.includes('medika') || clean.includes('apotek')) return 'KlinikQu';
  if (clean.includes('titip') || clean.includes('konsinyasi')) return 'TitipQu';
  return 'BengkelQu';
}

/**
 * Retrieves the full preset metadata based on activePreset
 */
export function getPresetMeta(preset?: string | null): PresetMeta {
  const normalized = normalizePreset(preset);
  return PRESET_CONFIGS[normalized] || PRESET_CONFIGS.BengkelQu;
}

/**
 * Checks which presets are currently unlocked according to licensing rules:
 * - Trial Mode (10 Hari Pertama): All 5 modules are freely unlocked.
 * - PRO / Subscribed Mode: 1 Default Active Preset is locked to user account.
 *   Additional modules can be unlocked via Add-On (+Rp 1.000/hari).
 */
export function getUnlockedPresets(
  isTrialActive: boolean,
  defaultActivePreset: ActivePreset = 'BengkelQu'
): ActivePreset[] {
  if (isTrialActive) {
    return ALL_ACTIVE_PRESETS;
  }

  const saved = localStorage.getItem('bq_unlocked_presets');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalizedList = parsed.map(normalizePreset);
        // Ensure default active preset is always included
        if (!normalizedList.includes(defaultActivePreset)) {
          normalizedList.push(defaultActivePreset);
        }
        return normalizedList;
      }
    } catch (e) {
      // ignore
    }
  }

  // Default: only the 1 locked preset
  return [defaultActivePreset];
}

/**
 * Checks if a specific preset is unlocked for the user
 */
export function isPresetUnlocked(
  preset: ActivePreset,
  isTrialActive: boolean,
  defaultActivePreset: ActivePreset = 'BengkelQu'
): boolean {
  if (isTrialActive) return true;
  const unlocked = getUnlockedPresets(isTrialActive, defaultActivePreset);
  return unlocked.includes(preset);
}

/**
 * Unlocks an additional module for PRO mode (+Rp 1.000/hari add-on)
 */
export function unlockAdditionalPreset(
  preset: ActivePreset,
  defaultActivePreset: ActivePreset = 'BengkelQu'
): ActivePreset[] {
  const current = getUnlockedPresets(false, defaultActivePreset);
  const normalized = normalizePreset(preset);
  if (!current.includes(normalized)) {
    const updated = [...current, normalized];
    localStorage.setItem('bq_unlocked_presets', JSON.stringify(updated));
    return updated;
  }
  return current;
}

/**
 * Dynamically transforms the 8 Master Menu Modules according to activePreset:
 * - Module 1: Servis (BengkelQu) | Pesanan (KedaiQu) | Penjualan (RitelQu) | Tindakan (KlinikQu) | Titip Jual (TitipQu)
 * - Modules 2-8: Kasir, Stok, Staff, Pelanggan, Marketing, Laporan, Setting (Consistent core names)
 */
export function getDynamicModulesForPreset(
  preset: ActivePreset,
  baseModules: MenuModuleConfig[]
): MenuModuleConfig[] {
  const meta = getPresetMeta(preset);

  return baseModules.map((mod) => {
    if (mod.id === 'servis') {
      return {
        ...mod,
        title: meta.menu1Title,
        subtitle: meta.menu1Subtitle,
        // Map submenus dynamically if applicable
        subMenus: mod.subMenus.map((sub: SubMenuItemConfig) => {
          if (sub.id === 'registrasi') {
            return {
              ...sub,
              title: preset === 'KedaiQu' 
                ? 'Pesanan Baru' 
                : preset === 'RitelQu' 
                ? 'Kasir POS Baru' 
                : preset === 'KlinikQu' 
                ? 'Pendaftaran Pasien' 
                : preset === 'TitipQu' 
                ? 'Penerimaan Titipan' 
                : 'Registrasi'
            };
          }
          if (sub.id === 'antrian') {
            return {
              ...sub,
              title: preset === 'KedaiQu' 
                ? 'Antrian Dapur' 
                : preset === 'RitelQu' 
                ? 'Scan Barang' 
                : preset === 'KlinikQu' 
                ? 'Antrian Berobat' 
                : preset === 'TitipQu' 
                ? 'Penjualan Kasir' 
                : 'Antrian'
            };
          }
          if (sub.id === 'proses') {
            return {
              ...sub,
              title: preset === 'KedaiQu' 
                ? 'Proses Masak' 
                : preset === 'RitelQu' 
                ? 'Grosir / Eceran' 
                : preset === 'KlinikQu' 
                ? 'Pemeriksaan Resep' 
                : preset === 'TitipQu' 
                ? 'Rekap Terjual' 
                : 'Proses'
            };
          }
          if (sub.id === 'selesai') {
            return {
              ...sub,
              title: preset === 'KedaiQu' 
                ? 'Makanan Siap' 
                : preset === 'RitelQu' 
                ? 'Cetak Nota' 
                : preset === 'KlinikQu' 
                ? 'Ambil Obat' 
                : preset === 'TitipQu' 
                ? 'Bagi Hasil' 
                : 'Selesai'
            };
          }
          if (sub.id === 'total-service') {
            return {
              ...sub,
              title: preset === 'KedaiQu' 
                ? 'Total Pesanan' 
                : preset === 'RitelQu' 
                ? 'Closing Shift' 
                : preset === 'KlinikQu' 
                ? 'Total Tindakan' 
                : preset === 'TitipQu' 
                ? 'Retur Sisa' 
                : 'Total Service'
            };
          }
          return sub;
        })
      };
    }
    return mod;
  });
}

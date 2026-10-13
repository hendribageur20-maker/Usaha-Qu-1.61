import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Lock, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  Store,
  Info
} from 'lucide-react';
import { 
  ActivePreset, 
  ALL_ACTIVE_PRESETS, 
  PRESET_CONFIGS, 
  isPresetUnlocked, 
  unlockAdditionalPreset 
} from '../../utils/presetManager';
import { SubscriptionState, WorkshopProfile } from '../../types';

interface ModuleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: ActivePreset;
  onSelectPreset: (preset: ActivePreset) => void;
  subscription?: SubscriptionState;
  profile?: WorkshopProfile;
  onOpenSubscription?: () => void;
}

export const ModuleSwitcherModal: React.FC<ModuleSwitcherModalProps> = ({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset,
  subscription,
  profile,
  onOpenSubscription
}) => {
  const [unlockTarget, setUnlockTarget] = useState<ActivePreset | null>(null);
  const [unlockSuccessToast, setUnlockSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  // Cek apakah masa trial 10 hari masih aktif
  const isTrialActive = Boolean(subscription?.isTrialActive);
  const trialDaysRemaining = subscription?.trialDaysRemaining ?? 10;

  // Modul default terkunci untuk akun PRO (berdasarkan profil pertama atau activePreset)
  const defaultLockedPreset = (profile?.selectedPreset as ActivePreset) || 'BengkelQu';

  // Handler memilih modul
  const handleCardClick = (preset: ActivePreset) => {
    const isUnlocked = isPresetUnlocked(preset, isTrialActive, defaultLockedPreset);
    
    if (isUnlocked) {
      onSelectPreset(preset);
      onClose();
    } else {
      // Modul terkunci di mode PRO, tampilkan konfirmasi unlock Add-On (+Rp 1.000/hari)
      setUnlockTarget(preset);
    }
  };

  // Handler konfirmasi unlock modul tambahan (+Rp 1.000/hari)
  const handleConfirmUnlock = (preset: ActivePreset) => {
    unlockAdditionalPreset(preset, defaultLockedPreset);
    setUnlockTarget(null);
    setUnlockSuccessToast(`Modul ${preset} berhasil dibuka via Add-On (+Rp 1.000/hari)!`);
    onSelectPreset(preset);
    setTimeout(() => {
      setUnlockSuccessToast(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Box */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-switcher-title"
        className="relative z-10 w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile handle pull bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#008952] flex items-center justify-center border border-emerald-100">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="module-switcher-title" className="text-base font-extrabold text-slate-900 tracking-tight">
                Pilih Modul Aktif UsahaQu
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                1 Universal Core Engine • Multi-Bisnis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela pemilihan modul"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* License & Trial Policy Banner */}
        <div className="px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 shrink-0">
          {isTrialActive ? (
            <div className="flex items-start gap-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-[#008952]">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-[11.5px] leading-snug">
                <span className="font-extrabold text-emerald-800">
                  Mode Trial ({trialDaysRemaining} Hari Tersisa):{' '}
                </span>
                <span className="text-emerald-700 font-medium">
                  Bebas switch dan jelajahi seluruh 5 modul usaha tanpa batasan.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-blue-50/80 border border-blue-200/80 rounded-xl p-2.5 text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11.5px] leading-snug">
                <span className="font-extrabold text-blue-900">
                  Mode Berlangganan (PRO):{' '}
                </span>
                <span className="text-blue-700 font-medium">
                  1 Akun Default mengunci 1 Modul Aktif. Buka modul tambahan dengan Add-On (+Rp 1.000/hari).
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {unlockSuccessToast && (
          <div className="mx-5 mt-2 bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl text-center shadow-md animate-in fade-in">
            ✓ {unlockSuccessToast}
          </div>
        )}

        {/* List of 5 Presets */}
        <div className="p-5 space-y-2.5 overflow-y-auto flex-1">
          {ALL_ACTIVE_PRESETS.map((preset) => {
            const meta = PRESET_CONFIGS[preset];
            const isSelected = preset === activePreset;
            const isUnlocked = isPresetUnlocked(preset, isTrialActive, defaultLockedPreset);

            return (
              <div
                key={preset}
                onClick={() => handleCardClick(preset)}
                className={`group relative rounded-2xl p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/60 border-[#008952] ring-2 ring-emerald-500/20 shadow-sm'
                    : isUnlocked
                    ? 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-emerald-300'
                    : 'bg-slate-50/70 border-slate-200 opacity-90 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Avatar Badge & Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs text-white ${
                        isUnlocked ? '' : 'grayscale-30'
                      }`}
                      style={{ backgroundColor: meta.colorTheme }}
                    >
                      {meta.logoBadge}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                          {preset}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {meta.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {meta.tagline}
                      </p>
                      
                      {/* Dynamic Labels Pills */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                        <span className="bg-white/90 border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                          Modul 1: {meta.menu1Title}
                        </span>
                        <span className="bg-white/90 border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                          Statistik: {meta.statUnitLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill or Unlock Action */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#008952] text-white text-[10.5px] font-extrabold flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Aktif</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPreset(preset);
                          onClose();
                        }}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#008952] text-slate-700 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Pilih</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[10.5px] font-extrabold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Terkunci 🔒</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Alert if clicked on locked item */}
                {!isUnlocked && unlockTarget === preset && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 bg-amber-50/90 rounded-xl p-3 text-amber-900 animate-in fade-in">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold">
                          Buka Modul {preset}?
                        </p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Akun PRO mengunci 1 Modul Aktif. Anda dapat menambah modul ini via Lisensi Add-On (+Rp 1.000/hari).
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmUnlock(preset);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Buka Modul (+Rp 1.000/hari)</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUnlockTarget(null);
                            }}
                            className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 shrink-0">
          {/* Tombol Utama: Tambah Modul/Cabang Baru (+Rp 1.000/hari) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSubscription) {
                onClose();
                onOpenSubscription();
              } else {
                // Cari modul yang belum terbuka untuk dibuka
                const locked = ALL_ACTIVE_PRESETS.find(
                  (p) => !isPresetUnlocked(p, isTrialActive, defaultLockedPreset)
                );
                if (locked) {
                  setUnlockTarget(locked);
                } else {
                  alert('Semua 5 modul sudah terbuka dan aktif pada akun Anda!');
                }
              }
            }}
            className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-[0.99] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Modul / Cabang Baru (+Rp 1.000/hari)</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span>UsahaQu 1.61 Multi-Platform</span>
            {onOpenSubscription && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubscription();
                }}
                className="text-[#008952] font-bold hover:underline cursor-pointer"
              >
                Pengaturan Lisensi & Slot →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  Check, 
  Copy, 
  Mail, 
  Key, 
  Zap, 
  Store, 
  ShieldCheck, 
  X, 
  Laptop, 
  ExternalLink,
  Clock,
  Users,
  Building2,
  Calculator
} from 'lucide-react';
import { SubscriptionPlanId, SubscriptionState, ProDurationOption, ProTierOption } from '../../types';
import { 
  getOrCreateDeviceId, 
  buildMailtoRequest, 
  DEVELOPER_EMAIL, 
  PRO_TIERS, 
  calculateTierPrice,
  calculateAddonBranchProrate
} from '../../utils/licenseManager';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionState;
  onSelectPlan: (planId: SubscriptionPlanId, durationDays: number) => void;
  onActivateSerialKey: (serialKey: string) => { success: boolean; message: string };
  workshopName?: string;
  contactPhone?: string;
  onActivateBranchTrial?: () => { success: boolean; message: string };
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSelectPlan,
  onActivateSerialKey,
  workshopName = 'Bengkel Qu Motor',
  contactPhone = '0812-3456-7890',
  onActivateBranchTrial
}) => {
  if (!isOpen) return null;

  const deviceId = subscription.deviceId || getOrCreateDeviceId();

  // Selected Tier: 'basic' | 'core' | 'addon_branch'
  const [selectedTier, setSelectedTier] = useState<ProTierOption>('core');

  // Selected duration: 1, 3, 6, 12 Bulan
  const [selectedDuration, setSelectedDuration] = useState<ProDurationOption>(1);

  // Serial key input
  const [inputSerial, setInputSerial] = useState('');
  const [activationResult, setActivationResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copy feedback
  const [copiedDeviceId, setCopiedDeviceId] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);

  const DURATION_OPTIONS: { months: ProDurationOption; days: number; label: string; badge?: string }[] = [
    { months: 1, days: 30, label: '1 Bulan' },
    { months: 3, days: 90, label: '3 Bulan', badge: 'Kuartal' },
    { months: 6, days: 180, label: '6 Bulan', badge: 'Semester' },
    { months: 12, days: 365, label: '12 Bulan', badge: '1 Tahun' }
  ];

  const currentPriceCalculation = calculateTierPrice(selectedTier, selectedDuration);

  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopiedDeviceId(true);
    setTimeout(() => setCopiedDeviceId(false), 2000);
  };

  const handleCopyEmailText = () => {
    const isBranchAddon = selectedTier === 'addon_branch' || selectedTier === 'corporate' || selectedTier === 'AddOnBranch';
    const prorate = calculateAddonBranchProrate(subscription.subscriptionExpiryDate, Date.now(), selectedDuration);
    const tierMeta = PRO_TIERS[selectedTier] || PRO_TIERS.core;

    let subjectText = `Permintaan Serial Number [${tierMeta.name}] [${selectedDuration} Bulan] - ${deviceId}`;
    let durationLine = `• Durasi: ${selectedDuration} Bulan (${currentPriceCalculation.days} Hari)`;
    let totalLine = `• Total: ${currentPriceCalculation.formattedPrice} (${currentPriceCalculation.days} hari × ${tierMeta.rateLabel})`;

    if (isBranchAddon && prorate.isProrated) {
      subjectText = `Permintaan Serial Number [Add-On Cabang Pro-Rata ${prorate.days} Hari] - ${deviceId}`;
      durationLine = `• Durasi: Pro-Rata ${prorate.days} Hari (Sinkronisasi Masa Aktif PRO s.d ${prorate.coreExpiryFormatted})`;
      totalLine = `• Total: ${prorate.formattedPrice} (${prorate.days} hari × Rp 1.000 / hari)`;
    }

    const text = `Kepada: ${DEVELOPER_EMAIL}\nPerihal: ${subjectText}\n\n• Device ID: ${deviceId}\n• Paket: ${tierMeta.name}\n${durationLine}\n${totalLine}\n• Nama Bengkel: ${workshopName}\n• Kontak: ${contactPhone}\n\nMohon dibuatkan Serial Number aktivasi lisensi BengkelQu sesuai kalkulasi di atas. Terima kasih!`;
    navigator.clipboard.writeText(text);
    setCopiedEmailText(true);
    setTimeout(() => setCopiedEmailText(false), 2000);
  };

  const handleDoActivate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputSerial.trim()) {
      setActivationResult({ success: false, message: 'Mohon masukkan kode Serial Number terlebih dahulu.' });
      return;
    }

    const res = onActivateSerialKey(inputSerial.trim());
    setActivationResult(res);
  };

  const handlePrimaryFooterAction = () => {
    if (selectedTier === 'basic') {
      onSelectPlan('basic', 365);
      onClose();
      return;
    }

    // Jika sudah ada input serial key, jalankan aktivasi
    if (inputSerial.trim()) {
      handleDoActivate();
      return;
    }

    // Jika belum ada serial key, scroll ke input dan berikan notifikasi panduan
    const inputEl = document.getElementById('serial-input-field');
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setActivationResult({
      success: false,
      message: 'Silakan kirim email permintaan di atas untuk mendapatkan Serial Number, lalu masukkan kodenya di sini.'
    });
  };

  const expiryDateFormatted = subscription.subscriptionExpiryDate 
    ? new Date(subscription.subscriptionExpiryDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-6 max-h-[92vh] overflow-y-auto border border-slate-100 animate-in fade-in zoom-in-95">
        
        {/* ================= 1. HEADER POP-UP ================= */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#008952] text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                Lisensi BengkelQu
              </span>
              {subscription.isTrialActive && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">
                  Trial: Sisa {subscription.trialDaysRemaining} Hari
                </span>
              )}
              {subscription.isSubscribed && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                  PRO AKTIF {expiryDateFormatted ? `s.d ${expiryDateFormatted}` : ''}
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Pilihan Paket Lisensi BengkelQu
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              3 Menu Utama (Service, Kasir, Stok) 100% Gratis Selamanya. Upgrade ke PRO untuk Modul Lengkap.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar Ringkas */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#008952] flex items-center justify-center font-black shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">
                {subscription.isSubscribed 
                  ? `Paket PRO Aktif (${subscription.subscriptionDurationMonths || 1} Bulan)` 
                  : subscription.isTrialActive 
                  ? `Masa Uji Coba Trial PRO (Sisa ${subscription.trialDaysRemaining} Hari)` 
                  : 'Mode Basic (Solo Mode) Aktif'}
              </span>
              <span className="text-[11px] text-slate-500">
                {subscription.isSubscribed && expiryDateFormatted
                  ? `Berlaku hingga ${expiryDateFormatted}`
                  : 'Menu Service, Kasir, dan Inventaris tetap dapat digunakan 100% bebas'}
              </span>
            </div>
          </div>
          {subscription.isTrialActive && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-mono text-[11px] font-black shrink-0">
              {subscription.trialDaysRemaining} Hari
            </span>
          )}
        </div>

        {/* ================= 2. PILIHAN CARD PAKET (3 CARD MINIMALIS) ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Pilih Paket Lisensi:</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              Struktur Harga Transparan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* CARD 1: Basic (Free Lifetime - Rp 0) */}
            <div
              onClick={() => setSelectedTier('basic')}
              className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedTier === 'basic'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-blue-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      Basic (Free Lifetime - Rp 0)
                    </h3>
                    <span className="text-[10px] text-blue-700 font-bold block mt-0.5">
                      100% Gratis Selamanya (Solo Mode)
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedTier === 'basic' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {selectedTier === 'basic' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="py-2 border-y border-slate-100 my-2">
                  <span className="text-base font-black text-slate-900 block font-mono">Rp 0</span>
                  <span className="text-[9.5px] text-slate-500">Gratis Tanpa Biaya Berlangganan</span>
                </div>

                <ul className="text-[10.5px] text-slate-600 space-y-1.5 leading-snug">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Akses 3 Core Menu Utama: <strong>Servis</strong>, <strong>Kasir</strong>, <strong>Stok</strong> Bebas Selamanya</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Modul <strong>Servis</strong> (Registrasi, Antrian, Proses, Selesai)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Modul <strong>Kasir</strong> (Pembayaran Tunai, QRIS, Struk WA/Printer)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Modul <strong>Stok</strong> (Katalog Sparepart & Stok Minimum)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 2: PRO (Rp 1.000 / Hari) [Paling Populer] */}
            <div
              onClick={() => setSelectedTier('core')}
              className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedTier === 'core'
                  ? 'border-[#008952] bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-amber-400 text-amber-950 font-black text-[8.5px] px-2 py-0.5 rounded-full shadow-2xs border border-amber-300">
                Paling Populer
              </div>

              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      PRO (Rp 1.000 / Hari)
                    </h3>
                    <span className="text-[10px] text-[#008952] font-bold block mt-0.5">
                      Paket Rekomendasi Bengkel
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedTier === 'core' ? 'border-[#008952] bg-[#008952] text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {selectedTier === 'core' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="py-2 border-y border-slate-100 my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-[#008952] font-mono">Rp 1.000</span>
                    <span className="text-[10px] text-slate-500 font-medium">/ Hari</span>
                  </div>
                  <span className="text-[9.5px] text-slate-500">Mulai Rp 30.000 / Bulan</span>
                </div>

                <ul className="text-[10.5px] text-slate-600 space-y-1.5 leading-snug">
                  <li className="flex items-start gap-1.5 font-medium text-slate-800">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span>Semua Fitur Paket Basic</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span>Modul <strong>Staff</strong> (Absen, Jadwal, Rekap)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span>Modul <strong>Marketing</strong> (Broadcast WhatsApp & Voucher Promo)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span>Modul <strong>Pelanggan</strong> & Riwayat Service Lengkap</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span><strong>Laporan Audit 24 Kolom</strong> (Ekspor Excel/CSV)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#008952] shrink-0 mt-0.5" />
                    <span>Profil Bengkel, PIN Owner, & Tautkan HP Toko</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 3: Add-On (+1 Cabang Baru): Rp 1.000 / Hari */}
            <div
              onClick={() => {
                setSelectedTier('addon_branch');
                if (!subscription?.isBranchTrialActive && !subscription?.isBranchSubscribed && onActivateBranchTrial) {
                  onActivateBranchTrial();
                }
              }}
              className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedTier === 'addon_branch' || selectedTier === 'corporate'
                  ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-purple-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      Add-On (+1 Cabang Baru)
                    </h3>
                    <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
                      Rp 1.000 / Hari per Cabang
                    </span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedTier === 'addon_branch' || selectedTier === 'corporate' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {(selectedTier === 'addon_branch' || selectedTier === 'corporate') && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="py-2 border-y border-slate-100 my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-purple-700 font-mono">Rp 1.000</span>
                    <span className="text-[10px] text-slate-500 font-medium">/ Hari</span>
                  </div>
                  <span className="text-[9.5px] text-slate-500">Trial 10 Hari Auto-ON Tersedia</span>
                </div>

                <ul className="text-[10.5px] text-slate-600 space-y-1.5 leading-snug">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>Buka Slot Cabang Baru Instan</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>Tautkan HP Aktif untuk Cabang Baru</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>Pengelolaan Multi-Cabang Terintegrasi</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>Laporan Komparasi Omset & Laba Antar Cabang</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* ================= DETAIL PAKET AKTIF & OPSI PEMBELIAN ================= */}
        {selectedTier === 'basic' ? (
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-black text-blue-950">
              <Store className="w-4 h-4 text-blue-600" />
              <span>Paket Basic Aktif 100% Gratis Selamanya</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Anda tidak perlu membayar atau memasukkan kode serial key. Seluruh menu operasional penting seperti <strong>Service, Kasir POS, dan Inventaris Stok</strong> tetap dapat digunakan tanpa batasan waktu.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 animate-in fade-in">
            
            {/* Pilihan Durasi Langganan */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Pilih Durasi Langganan:</span>
                <span className="text-[11px] text-slate-500">1, 3, 6, 12 Bulan</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map((opt) => {
                  const price = calculateTierPrice(selectedTier, opt.months);
                  const isSelected = selectedDuration === opt.months;

                  return (
                    <button
                      key={opt.months}
                      type="button"
                      onClick={() => setSelectedDuration(opt.months)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#008952] bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">{opt.label}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{opt.days} Hari</span>
                      </div>
                      <span className="text-[10px] font-black text-[#008952] font-mono mt-1.5 block">
                        {price.formattedPrice}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ringkasan Biaya */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Ringkasan Pilihan:</span>
                  <span className="font-bold text-slate-900">
                    {PRO_TIERS[selectedTier].name} ({selectedDuration} Bulan / {currentPriceCalculation.days} Hari)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">
                    {currentPriceCalculation.days} hari × {PRO_TIERS[selectedTier].rateLabel}
                  </span>
                  <span className="font-mono font-black text-sm text-[#008952]">
                    {currentPriceCalculation.formattedPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Device ID Card */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-[#008952]" />
                  Device ID Perangkat Ini:
                </span>
                <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  Terkunci per Perangkat
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 font-mono text-xs font-black text-slate-800 tracking-wider">
                  {deviceId}
                </div>
                <button
                  type="button"
                  onClick={handleCopyDeviceId}
                  className="bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedDeviceId ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Kirim Request Email ke Developer Hendri */}
            {(() => {
              const isBranchAddon = selectedTier === 'addon_branch' || selectedTier === 'corporate' || selectedTier === 'AddOnBranch';
              const prorate = calculateAddonBranchProrate(subscription.subscriptionExpiryDate, Date.now(), selectedDuration);
              const mailtoUrl = buildMailtoRequest(
                deviceId,
                selectedTier,
                selectedDuration,
                workshopName,
                contactPhone,
                isBranchAddon ? prorate : undefined
              );

              return (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#008952]" />
                      Permintaan Serial Number ke Developer:
                    </span>
                    <span className="text-[10.5px] font-mono text-slate-600 font-bold">
                      {DEVELOPER_EMAIL}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={mailtoUrl}
                      className="flex-1 bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Kirim Email Permintaan Serial Number</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyEmailText}
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copiedEmailText ? 'Tersalin!' : 'Salin Format'}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Form Input Serial Number */}
            <form onSubmit={handleDoActivate} className="bg-white border-2 border-emerald-600/30 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#008952]" />
                <h4 className="font-extrabold text-xs text-slate-900">
                  Sudah Menerima Serial Number? Masukkan di Bawah:
                </h4>
              </div>

              <div className="space-y-1">
                <input
                  id="serial-input-field"
                  type="text"
                  value={inputSerial}
                  onChange={(e) => {
                    setInputSerial(e.target.value.toUpperCase());
                    setActivationResult(null);
                  }}
                  placeholder="Contoh: BQPRO-CORE-3M-A48F-72E1"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 tracking-wider uppercase placeholder:text-slate-400 placeholder:normal-case focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                <span className="text-[10px] text-slate-400 block">
                  Format: BQPRO-[PAKET]-[DURASI]M-[KODE-4]-[KODE-4]
                </span>
              </div>

              {activationResult && (
                <div className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  activationResult.success 
                    ? 'bg-emerald-100 text-[#008952] border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {activationResult.success ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                  <span>{activationResult.message}</span>
                </div>
              )}
            </form>

          </div>
        )}

        {/* ================= 3. FOOTER BUTTON ================= */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handlePrimaryFooterAction}
            className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white py-3 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Pilih Paket & Aktifkan Lisensi →</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>BengkelQu v1.60 • Lisensi Terverifikasi</span>
            <span className="font-mono">Dev: {DEVELOPER_EMAIL}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

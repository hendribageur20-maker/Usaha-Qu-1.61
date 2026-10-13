import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle2, Store, User, MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import { WorkshopProfile } from '../../types';
import { AppLogo } from '../common/AppLogo';

interface BasicProfileViewProps {
  onBack: () => void;
  profile: WorkshopProfile;
  onSaveProfile: (updated: WorkshopProfile) => void;
}

export const BasicProfileView: React.FC<BasicProfileViewProps> = ({
  onBack,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<WorkshopProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Top Header Hijau Solid */}
      <div className="bg-[#008952] text-white px-5 pt-4 pb-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Basic: Profil Bengkel</h1>
              <p className="text-xs text-emerald-100 font-medium">Informasi & Identitas Pemilik</p>
            </div>
          </div>
          <div className="px-2.5 py-1 bg-white/20 rounded-full text-[11px] font-bold text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Basic</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isSaved && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#008952]" />
            <span>Profil bengkel berhasil disimpan dan diperbarui!</span>
          </div>
        )}

        {/* Form Card Profil Bengkel */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#008952] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Formulir Profil Bengkel</h3>
              <p className="text-[11px] text-slate-400">Data resmi identitas outlet & kepemilikan</p>
            </div>
          </div>

          {/* Info Foto Profil Google jika login dengan Google */}
          {formData.photoUrl && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <img
                src={formData.photoUrl}
                alt="Foto Profil Google"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Foto Profil Google</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                    Tersinkronisasi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Diisi otomatis dari Akun Google: {formData.email}
                </p>
              </div>
            </div>
          )}

          {/* Preset Ekosistem UsahaQu 1.61 */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#008952]" />
                Preset Ekosistem Usaha (Universal Engine)
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#008952]">
                1 Core Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Pilih jenis usaha untuk menyesuaikan Dynamic Label (Servis, Kasir, Stok) & alur kerja operasional secara instan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { id: 'BengkelQu', label: 'BengkelQu', category: 'Jasa Otomotif & Servis', badge: 'BQ', defaultName: 'BengkelQu Motor Berkah Jaya' },
                { id: 'KedaiQu', label: 'KedaiQu', category: 'Kuliner & F&B / Cafe / Warung', badge: 'KQ', defaultName: 'KedaiQu Kopi & Dapur Berkah' },
                { id: 'RitelQu', label: 'RitelQu', category: 'Toko, Minimarket & Grosir', badge: 'RQ', defaultName: 'RitelQu Mart & Toko Berkah' },
                { id: 'KlinikQu', label: 'KlinikQu', category: 'Jasa Medis, Apotek & Rawat', badge: 'KlQ', defaultName: 'KlinikQu Medika & Apotek Sehat' },
                { id: 'TitipQu', label: 'TitipQu', category: 'Konsinyasi & Titip Jual', badge: 'TQ', defaultName: 'TitipQu Konsinyasi & Mart Titip' }
              ].map((item) => {
                const currentPresetNormalized = (formData.selectedPreset || 'BengkelQu').toLowerCase();
                const isSelected = currentPresetNormalized === item.id.toLowerCase();
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        selectedPreset: item.id as any,
                        workshopName: formData.workshopName.includes('Qu') ? item.defaultName : formData.workshopName
                      });
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#008952] shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-white/80 border-slate-200/80 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isSelected ? 'bg-[#008952] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#008952]' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#008952]" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate leading-tight">
                        {item.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Nama Usaha / Bengkel */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Store className="w-3.5 h-3.5 text-[#008952]" />
              Nama Usaha / Toko *
            </label>
            <input
              type="text"
              required
              value={formData.workshopName}
              onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
              placeholder="Contoh: BengkelQu Motor Berkah Jaya"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 2. Alamat */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#008952]" />
              Alamat Lengkap *
            </label>
            <textarea
              rows={3}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Otto Iskandardinata No. 128, Bandung"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 3. Nama Pemilik */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-[#008952]" />
              Nama Pemilik *
            </label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Contoh: Bpk. Ahmad Fauzi Rachman, S.T."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 4. No HP & 5. Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-[#008952]" />
                Nomor HP / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-[#008952]" />
                Alamat Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Contoh: kontak@bengkelqu-bandung.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-2xl shadow-md shadow-emerald-700/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.3]" />
              <span>Simpan Profil Bengkel</span>
            </button>
          </div>
        </form>

        {/* Preview Card Struk / Nota Letterhead dengan AppLogo Dinamis */}
        <div className="bg-white rounded-2xl p-4 border border-dashed border-emerald-300 shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Pratinjau KOP Nota & Logo Usaha Dinamis:
          </span>
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <AppLogo
              name={formData.workshopName}
              variant="auto"
              shape="rounded"
              size="md"
            />
            <div className="min-w-0 flex-1 text-left space-y-0.5">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase truncate">{formData.workshopName}</h4>
              <p className="text-[11px] text-slate-600 truncate">{formData.address}</p>
              <p className="text-[10px] text-slate-500 truncate">
                Pemilik: {formData.ownerName} • WA: {formData.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

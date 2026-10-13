import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2, 
  Store, 
  X,
  User,
  Mail,
  ChevronRight
} from 'lucide-react';
import { UserSession, WorkshopProfile } from '../../types';
import { SafeArea } from '../common/SafeArea';
import { AppLogo } from '../common/AppLogo';
import { GoogleSignIn, GoogleAccountProfile } from '../../services/googleSignIn';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultEmail?: string;
  profile?: WorkshopProfile;
  onUpdateProfile?: (updated: WorkshopProfile) => void;
}

// Komponen Ikon Resmi Google Multi-Color SVG
const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'bangorhendri@gmail.com',
  profile,
  onUpdateProfile
}) => {
  // Form input states (WA / PIN)
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '0812-3456-7890');
  const [pin, setPin] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Account Chooser Modal
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Modal buat akun usaha baru
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPin, setNewPin] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Dynamic store name from settings/profile
  const storeName = profile?.workshopName || 'Bengkel Qu Motor Berkah Jaya';

  // Popstate trap (pushAndRemoveUntil simulator) untuk menjaga pengguna tetap di LoginScreen jika Back HP ditekan
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.pathname);
    };
    window.addEventListener('popstate', preventBackNavigation);
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // 1. Eksekusi Google Sign-In (Auto Login dengan Akun Google)
  const handleExecuteGoogleLogin = async (accountOverride?: Partial<GoogleAccountProfile>) => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      // Panggil GoogleSignIn API
      const googleUser = await GoogleSignIn.signIn(accountOverride);

      // Ambil nama, email, dan foto profil dari akun Google untuk mengisi data awal Profil Usaha secara otomatis
      const updatedProfile: WorkshopProfile = {
        workshopName: profile?.workshopName || `Bengkel ${googleUser.name.split(' ')[0]} Jaya`,
        ownerName: googleUser.name,
        phone: profile?.phone || '0812-3456-7890',
        address: profile?.address || 'Jl. Otto Iskandardinata No. 128, Bandung',
        email: googleUser.email,
        photoUrl: googleUser.photoUrl
      };

      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }
      localStorage.setItem('bq_profile', JSON.stringify(updatedProfile));

      // Bentuk UserSession
      const session: UserSession = {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.photoUrl,
        role: 'Owner',
        autoLogin: true,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      setTimeout(() => {
        setIsGoogleLoading(false);
        setShowGoogleChooser(false);
        onLoginSuccess(session);
      }, 450);
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMessage('Gagal menghubungkan Akun Google: ' + (err?.message || 'Silakan coba lagi.'));
    }
  };

  // 2. Handle alternatif login: WhatsApp & PIN
  const handleLoginWA = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    const cleanPin = pin.trim();

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Nomor WhatsApp / HP wajib diisi minimal 8 digit.');
      return;
    }

    if (!cleanPin || cleanPin.length < 4) {
      setErrorMessage('PIN wajib diisi minimal 4 digit.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        name: profile?.ownerName || 'Bpk. Ahmad Fauzi (Owner)',
        email: cleanPhone.includes('@') ? cleanPhone : `${cleanPhone.replace(/\D/g, '')}@usahaqu.id`,
        avatar: profile?.photoUrl,
        role: 'Owner',
        autoLogin: true,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      onLoginSuccess(session);
    }, 450);
  };

  // 3. Handle "Mode Coba / Demo Test Drive" shortcut
  const handleDemoTestDrive = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const demoSession: UserSession = {
        name: 'Bpk. Ahmad Fauzi (Owner Demo)',
        email: 'demo-owner@usahaqu.id',
        role: 'Owner',
        autoLogin: true,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      onLoginSuccess(demoSession);
    }, 350);
  };

  // 4. Handle "Buat Akun Usaha Baru (Free Lifetime)"
  const handleRegisterNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    setRegisterSuccess(true);
    const updatedProfile: WorkshopProfile = {
      workshopName: newStoreName.trim(),
      ownerName: newOwnerName.trim() || 'Pemilik Usaha',
      phone: newPhone.trim() || '0812-0000-0000',
      address: profile?.address || 'Jl. Usaha Mandiri No. 1, Kota Baru',
      email: profile?.email || 'kontak@usahaqu.id'
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedProfile);
    }
    localStorage.setItem('bq_profile', JSON.stringify(updatedProfile));

    setTimeout(() => {
      setShowRegisterModal(false);
      const newSession: UserSession = {
        name: updatedProfile.ownerName,
        email: `${(newPhone || '0812').replace(/\D/g, '')}@usahaqu.id`,
        role: 'Owner',
        autoLogin: true,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      onLoginSuccess(newSession);
    }, 600);
  };

  return (
    <SafeArea topOnly bottomOnly className="flex-1 bg-white flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-between px-6 py-4 max-w-md mx-auto w-full select-none overflow-y-auto">
        {/* 1. TOP BRANDING & LOGO */}
        <div className="pt-1 sm:pt-3 flex flex-col items-center text-center">
          {/* Logo UQ / BQ estetik hijau dengan teks putih tebal */}
          <div className="mb-2.5">
            <AppLogo
              profile={profile}
              name={storeName}
              variant="UQ"
              shape="rounded"
              size="lg"
              showVersionBadge={true}
              versionText="1.61"
            />
          </div>

          {/* Judul Aplikasi Master App UsahaQu 1.61 */}
          <div className="flex items-center gap-1.5 justify-center">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              UsahaQu <span className="text-[#008952]">1.61</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008952] border border-emerald-200">
              BengkelQu
            </span>
          </div>

          {/* Tagline Resmi */}
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-[280px]">
            Satu Solusi Kelola Semua Jenis Usaha
          </p>

          {/* Info Preset Usaha Dinamis dari Setting/Profil Toko */}
          <div className="mt-2 text-[11px] text-slate-600 font-semibold bg-slate-50 border border-slate-200/80 rounded-full px-3 py-0.5 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#008952]" />
            <span className="truncate max-w-[220px]">{storeName}</span>
          </div>
        </div>

        {/* 2. AUTHENTICATION CONTAINER */}
        <div className="my-auto py-3 space-y-3.5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,137,82,0.06)] border border-slate-100 space-y-4">
            {/* Pesan Kesalahan Validasi */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* FITUR 1: TOMBOL "LANJUTKAN DENGAN GOOGLE" (GOOGLE SIGN-IN) */}
            {/* ========================================================= */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                disabled={isGoogleLoading || isLoading}
                className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-2xl shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-75 relative group"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-600">Menghubungkan Akun Google...</span>
                  </div>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      Lanjutkan dengan Google
                    </span>
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#008952] border border-emerald-100 hidden sm:inline">
                      Auto Login
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400">
                Otomatis mengisi nama, email & foto profil pemilik usaha
              </p>
            </div>

            {/* PEMBATAS / DIVIDER PILIHAN LOGIN ALTERNATIF */}
            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                Atau WhatsApp & PIN
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* ========================================================= */}
            {/* FITUR 2: LOGIN ALTERNATIF NOMOR WA / HP & PIN            */}
            {/* ========================================================= */}
            <form onSubmit={handleLoginWA} className="space-y-3.5">
              {/* INPUT 1: Nomor WhatsApp / HP */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800 rounded-2xl border border-slate-200 focus:border-[#008952] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* INPUT 2: PIN (4-6 Digit) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    PIN Keamanan (4-6 Digit)
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    PIN Demo: 1234
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan 4-6 Digit PIN"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold tracking-wider text-slate-800 rounded-2xl border border-slate-200 focus:border-[#008952] focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* TOMBOL UTAMA: Masuk Sekarang (Warna Hijau BQ) */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Memverifikasi Akun...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* TOMBOL SEKUNDER: Buat Akun Usaha Baru (Free Lifetime) */}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="w-full bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold py-2.5 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#008952]" />
                <span>Buat Akun Usaha Baru (Free Lifetime)</span>
              </button>
            </form>
          </div>

          {/* TOMBOL PINTAS: Mode Coba / Demo Test Drive */}
          <div>
            <button
              type="button"
              onClick={handleDemoTestDrive}
              disabled={isLoading || isGoogleLoading}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/80 hover:border-emerald-300 active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#008952] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 group-hover:text-[#008952] transition-colors">
                      Mode Coba / Demo Test Drive
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/70 text-emerald-900">
                      Instan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Langsung uji coba semua modul tanpa form panjang
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* 3. FOOTER KEAMANAN & ENGINE INFO */}
        <div className="pt-2 pb-1 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008952]" />
            <span>UsahaQu v1.61 • Core Engine Active</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Sistem Terproteksi • Google Identity Services & Cloud Session
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL GOOGLE ACCOUNT CHOOSER (SIMULASI RESMI GOOGLE ONE-TAP) */}
      {/* ========================================================= */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-5 sm:p-6 space-y-4">
            {/* Header Google Identity */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pilih Akun Google</h3>
                  <p className="text-[11px] text-slate-400">untuk melanjutkan ke UsahaQu 1.61</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGoogleChooser(false);
                  setShowCustomGoogleInput(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showCustomGoogleInput ? (
              <div className="space-y-2.5">
                {/* Akun 1: Akun Pengembang / Pengguna Terdeteksi (Hendri Bangor) */}
                <div
                  onClick={() =>
                    handleExecuteGoogleLogin({
                      name: 'Hendri Bangor',
                      email: 'bangorhendri@gmail.com',
                      photoUrl:
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                    })
                  }
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                      alt="Hendri Bangor"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-[#008952] transition-colors">
                          Hendri Bangor
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#008952]">
                          Pemilik
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        bangorhendri@gmail.com
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#008952] group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Akun 2: Akun Demo Owner Alternatif */}
                <div
                  onClick={() =>
                    handleExecuteGoogleLogin({
                      name: 'Ahmad Fauzi (Owner BengkelQu)',
                      email: 'ahmad.fauzi@gmail.com',
                      photoUrl:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
                    })
                  }
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                      alt="Ahmad Fauzi"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-xs"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 group-hover:text-[#008952] transition-colors block">
                        Ahmad Fauzi
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        ahmad.fauzi@gmail.com
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#008952] group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Opsi: Gunakan Akun Google Lain */}
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full py-2.5 px-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer border border-dashed border-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gunakan Akun Google Lain...</span>
                </button>
              </div>
            ) : (
              /* Form Input Kustom Akun Google */
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nama Akun Google
                  </label>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Contoh: Hendri Pratama"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Alamat Email Google (@gmail.com)
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="Contoh: namaanda@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail.trim()) return;
                      handleExecuteGoogleLogin({
                        name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
                        email: customGoogleEmail.trim(),
                        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          customGoogleName || customGoogleEmail
                        )}`
                      });
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#008952] text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    Masuk Akun Ini
                  </button>
                </div>
              </div>
            )}

            {/* Note Kebijakan Privasi Google */}
            <p className="text-[10px] text-center text-slate-400 pt-1 leading-relaxed">
              Dengan melanjutkan, Google membagikan nama, alamat email, dan foto profil Anda dengan UsahaQu sesuai Kebijakan Privasi.
            </p>
          </div>
        </div>
      )}

      {/* MODAL PENDAFTARAN: Buat Akun Usaha Baru (Free Lifetime) */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#008952] flex items-center justify-center font-bold text-xs">
                  UQ
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Daftar Akun Usaha Baru</h3>
                  <span className="text-[10px] text-[#008952] font-semibold">100% Free Lifetime Solo</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {registerSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#008952] mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Akun Usaha Berhasil Dibuat!</h4>
                <p className="text-xs text-slate-500">
                  Menyiapkan ruang kerja usaha dan masuk ke dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterNewAccount} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nama Usaha / Bengkel *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Contoh: Bengkel Motor Berkah Jaya"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nama Pemilik (Owner)
                  </label>
                  <input
                    type="text"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Fauzi"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Contoh: 0812-9876-5432"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Buat PIN Akses (4-6 Digit)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Default: 1234"
                    className="w-full px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-[#008952]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#008952] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Mulai Gunakan UsahaQu (Gratis)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </SafeArea>
  );
};

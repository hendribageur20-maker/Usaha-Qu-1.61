import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  CalendarDays, 
  Search, 
  Download, 
  Plus, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Users
} from 'lucide-react';
import { Mechanic } from '../../types';

interface StaffAttendanceRecord {
  id: string;
  staffName: string;
  role: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  status: 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpha';
  shift: string;
  notes?: string;
}

interface StaffScheduleItem {
  id: string;
  staffName: string;
  role: string;
  shift: string;
  hours: string;
  assignedStation: string;
  days: string[];
}

interface StaffViewProps {
  initialTab?: string;
  onBack: () => void;
  mechanics?: Mechanic[];
}

export const StaffView: React.FC<StaffViewProps> = ({
  initialTab = 'staff-absen',
  onBack,
  mechanics = []
}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab === 'jadwal' || initialTab === 'staff-jadwal') return 'staff-jadwal';
    if (initialTab === 'rekap' || initialTab === 'staff-rekap') return 'staff-rekap';
    return 'staff-absen';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // State: Absensi Harian
  const [attendanceList, setAttendanceList] = useState<StaffAttendanceRecord[]>([
    {
      id: 'att-1',
      staffName: 'Mas Joko Santoso',
      role: 'Kepala Mekanik',
      date: todayStr,
      timeIn: '07:55 WIB',
      timeOut: '17:02 WIB',
      status: 'Hadir',
      shift: 'Shift Pagi (08:00 - 17:00)',
      notes: 'Tepat waktu, buka bengkel'
    },
    {
      id: 'att-2',
      staffName: 'Mas Budi Prasetyo',
      role: 'Teknisi CVT & Injeksi',
      date: todayStr,
      timeIn: '08:05 WIB',
      status: 'Terlambat',
      shift: 'Shift Pagi (08:00 - 17:00)',
      notes: 'Terlambat 5 menit karena hujan'
    },
    {
      id: 'att-3',
      staffName: 'Mas Agus Salim',
      role: 'Mekanik Servis Cepat',
      date: todayStr,
      timeIn: '08:00 WIB',
      status: 'Hadir',
      shift: 'Shift Pagi (08:00 - 17:00)',
      notes: 'Hadir tepat waktu'
    },
    {
      id: 'att-4',
      staffName: 'Mbak Siti Nurhaliza',
      role: 'Kasir & Front Desk',
      date: todayStr,
      timeIn: '07:50 WIB',
      status: 'Hadir',
      shift: 'Shift Pagi (08:00 - 17:00)',
      notes: 'Standby mesin POS kasir'
    }
  ]);

  // Modal Input Absen Baru
  const [isAbsenModalOpen, setIsAbsenModalOpen] = useState(false);
  const [selectedStaffForAbsen, setSelectedStaffForAbsen] = useState('Mas Joko Santoso');
  const [selectedStatus, setSelectedStatus] = useState<'Hadir' | 'Terlambat' | 'Izin' | 'Sakit'>('Hadir');
  const [absenNotes, setAbsenNotes] = useState('');

  // State: Jadwal Kerja
  const [schedules, setSchedules] = useState<StaffScheduleItem[]>([
    {
      id: 'sch-1',
      staffName: 'Mas Joko Santoso',
      role: 'Kepala Mekanik',
      shift: 'Shift Pagi',
      hours: '08:00 - 17:00 WIB',
      assignedStation: 'Pit 1 (Bore Up & Turun Mesin)',
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    },
    {
      id: 'sch-2',
      staffName: 'Mas Budi Prasetyo',
      role: 'Teknisi Injeksi & Kelistrikan',
      shift: 'Shift Pagi',
      hours: '08:00 - 17:00 WIB',
      assignedStation: 'Pit 2 (Scanner & Remap Injeksi)',
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    },
    {
      id: 'sch-3',
      staffName: 'Mas Agus Salim',
      role: 'Mekanik Servis Cepat',
      shift: 'Shift Siang',
      hours: '09:00 - 18:00 WIB',
      assignedStation: 'Pit 3 (Ganti Oli & CVT)',
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    },
    {
      id: 'sch-4',
      staffName: 'Mbak Siti Nurhaliza',
      role: 'Kasir Utama',
      shift: 'Full Shift Kasir',
      hours: '08:00 - 17:30 WIB',
      assignedStation: 'Meja Kasir & Front Office',
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    }
  ]);

  // State: Rekap Bulanan
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');

  const handleSimpanAbsen = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newRecord: StaffAttendanceRecord = {
      id: `att-${Date.now()}`,
      staffName: selectedStaffForAbsen,
      role: selectedStaffForAbsen.includes('Kasir') || selectedStaffForAbsen.includes('Siti') ? 'Kasir' : 'Mekanik',
      date: todayStr,
      timeIn: selectedStatus === 'Izin' || selectedStatus === 'Sakit' ? '-' : timeStr,
      status: selectedStatus,
      shift: 'Shift Reguler (08:00 - 17:00)',
      notes: absenNotes || (selectedStatus === 'Hadir' ? 'Presensi tercatat manual' : selectedStatus)
    };

    setAttendanceList([newRecord, ...attendanceList]);
    setIsAbsenModalOpen(false);
    setAbsenNotes('');
    showToast(`Presensi ${selectedStaffForAbsen} berhasil dicatat.`);
  };

  const handleExportRekapCSV = () => {
    const headers = 'No,Nama Karyawan,Jabatan,Tanggal,Jam Masuk,Jam Pulang,Status,Shift,Keterangan\n';
    const rows = attendanceList.map((item, idx) => 
      `${idx + 1},"${item.staffName}","${item.role}","${item.date}","${item.timeIn}","${item.timeOut || '-'}","${item.status}","${item.shift}","${item.notes || '-'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_absen_${selectedMonth.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berkas Rekap Absen CSV berhasil diunduh!');
  };

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'staff-absen':
        return {
          title: 'Absen Karyawan',
          subtitle: 'Presensi Masuk & Pulang Harian Staff Bengkel'
        };
      case 'staff-jadwal':
        return {
          title: 'Jadwal Kerja Staff',
          subtitle: 'Jadwal Shift Kerja Mekanik & Kasir'
        };
      case 'staff-rekap':
        return {
          title: 'Rekap Absen Karyawan',
          subtitle: 'Rekapitulasi Kehadiran & Jam Kerja Bulanan'
        };
      default:
        return {
          title: 'Staff Bengkel',
          subtitle: 'Presensi & Jadwal Karyawan'
        };
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen pb-12">
      {/* Top Header */}
      <div className="bg-[#008952] text-white px-5 pt-4 pb-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{headerMeta.title}</h1>
              <p className="text-xs text-emerald-100 font-medium">{headerMeta.subtitle}</p>
            </div>
          </div>

          {activeTab === 'staff-absen' && (
            <button
              onClick={() => setIsAbsenModalOpen(true)}
              className="bg-white text-[#008952] hover:bg-emerald-50 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Absen</span>
            </button>
          )}

          {activeTab === 'staff-rekap' && (
            <button
              onClick={handleExportRekapCSV}
              className="bg-white text-[#008952] hover:bg-emerald-50 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('staff-absen')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
              activeTab === 'staff-absen' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Absen Harian
          </button>
          <button
            onClick={() => setActiveTab('staff-jadwal')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
              activeTab === 'staff-jadwal' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Jadwal Shift
          </button>
          <button
            onClick={() => setActiveTab('staff-rekap')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
              activeTab === 'staff-rekap' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Rekap Bulanan
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* ================= TAB 1: ABSEN HARIAN ================= */}
        {activeTab === 'staff-absen' && (
          <div className="space-y-3">
            {/* Quick Status Bar */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block">Total Staff</span>
                <span className="text-base font-extrabold text-slate-800">4 Org</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-600 block">Hadir</span>
                <span className="text-base font-extrabold text-[#008952]">
                  {attendanceList.filter(a => a.status === 'Hadir').length} Org
                </span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-600 block">Terlambat</span>
                <span className="text-base font-extrabold text-amber-600">
                  {attendanceList.filter(a => a.status === 'Terlambat').length} Org
                </span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 block">Izin/Sakit</span>
                <span className="text-base font-extrabold text-blue-600">
                  {attendanceList.filter(a => a.status === 'Izin' || a.status === 'Sakit').length} Org
                </span>
              </div>
            </div>

            {/* List Presensi Hari Ini */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Daftar Presensi ({todayStr})</h3>
                    <p className="text-[10px] text-slate-400">Status kehadiran teknisi & kasir</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008952]">
                  Live Presensi
                </span>
              </div>

              <div className="space-y-2.5">
                {attendanceList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#008952] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {item.staffName.split(' ')[1]?.charAt(0) || item.staffName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{item.staffName}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            item.status === 'Hadir' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : item.status === 'Terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{item.role} • {item.shift}</p>
                        {item.notes && (
                          <p className="text-[10px] text-slate-400 italic mt-0.5">{item.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-slate-800">{item.timeIn}</div>
                      <div className="text-[10px] text-slate-400">{item.timeOut ? `Pulang: ${item.timeOut}` : 'Belum Pulang'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: JADWAL SHIFT ================= */}
        {activeTab === 'staff-jadwal' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Pembagian Shift & Pit Kerja</h3>
                    <p className="text-[10px] text-slate-400">Jadwal operasional Senin s.d Sabtu</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">6 Hari Kerja</span>
              </div>

              <div className="space-y-3">
                {schedules.map((sch) => (
                  <div key={sch.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{sch.staffName}</h4>
                        <p className="text-[10px] font-medium text-emerald-700">{sch.role}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#008952] border border-emerald-100">
                        {sch.shift}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Jam Kerja</span>
                        <span className="font-bold text-slate-700">{sch.hours}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Penempatan Posisi</span>
                        <span className="font-bold text-slate-700">{sch.assignedStation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 mr-1 font-medium">Hari Aktif:</span>
                      {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                        <span 
                          key={d} 
                          className={`text-[9px] font-bold w-6 h-6 rounded-md flex items-center justify-center ${
                            sch.days.includes(d) 
                              ? 'bg-[#008952] text-white' 
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: REKAP BULANAN ================= */}
        {activeTab === 'staff-rekap' && (
          <div className="space-y-3">
            {/* Header summary metrics */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Rekapitulasi Kehadiran Bulanan</h3>
                    <p className="text-[10px] text-slate-400">Periode: {selectedMonth}</p>
                  </div>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                >
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="Agustus 2026">Agustus 2026</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/60">
                  <span className="text-[10px] font-semibold text-[#008952] block">Tingkat Hadir</span>
                  <span className="text-base font-extrabold text-emerald-900">97.8%</span>
                </div>
                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/60">
                  <span className="text-[10px] font-semibold text-amber-700 block">Total Terlambat</span>
                  <span className="text-base font-extrabold text-amber-900">2 Kali</span>
                </div>
                <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/60">
                  <span className="text-[10px] font-semibold text-blue-700 block">Izin / Sakit</span>
                  <span className="text-base font-extrabold text-blue-900">1 Hari</span>
                </div>
              </div>
            </div>

            {/* Rekap per staff card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800">Rincian Per Karyawan</h4>

              {[
                { name: 'Mas Joko Santoso', role: 'Kepala Mekanik', hadir: 26, telat: 0, izin: 0, lembur: '8 Jam' },
                { name: 'Mas Budi Prasetyo', role: 'Teknisi CVT & Injeksi', hadir: 25, telat: 1, izin: 0, lembur: '6 Jam' },
                { name: 'Mas Agus Salim', role: 'Mekanik Servis Cepat', hadir: 26, telat: 1, izin: 0, lembur: '4 Jam' },
                { name: 'Mbak Siti Nurhaliza', role: 'Kasir & Front Desk', hadir: 25, telat: 0, izin: 1, lembur: '2 Jam' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.role}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {item.hadir} Hari Hadir
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-600">
                    <div>Terlambat: <strong className="text-amber-600">{item.telat}x</strong></div>
                    <div>Izin/Sakit: <strong className="text-blue-600">{item.izin} hari</strong></div>
                    <div>Lembur: <strong className="text-emerald-700">{item.lembur}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Input Absen Baru */}
      {isAbsenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-100 animate-scale-up space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Catat Presensi Karyawan</h3>
              <button
                onClick={() => setIsAbsenModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanAbsen} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Pilih Karyawan</label>
                <select
                  value={selectedStaffForAbsen}
                  onChange={(e) => setSelectedStaffForAbsen(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#008952]"
                >
                  <option value="Mas Joko Santoso">Mas Joko Santoso (Kepala Mekanik)</option>
                  <option value="Mas Budi Prasetyo">Mas Budi Prasetyo (Teknisi Injeksi)</option>
                  <option value="Mas Agus Salim">Mas Agus Salim (Mekanik Servis Cepat)</option>
                  <option value="Mbak Siti Nurhaliza">Mbak Siti Nurhaliza (Kasir Utama)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Status Kehadiran</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hadir', 'Terlambat', 'Izin', 'Sakit'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedStatus === st
                          ? 'bg-[#008952] text-white border-[#008952] shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={absenNotes}
                  onChange={(e) => setAbsenNotes(e.target.value)}
                  placeholder="Contoh: Terlambat 10 menit krn hujan..."
                  className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#008952]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAbsenModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#008952] text-white hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  Simpan Absen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

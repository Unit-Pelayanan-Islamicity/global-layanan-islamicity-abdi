import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Cpu,
  Cloud,
  Code2,
  Compass,
  Copy,
  Check,
  Download,
  Layers,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Server,
  Terminal,
  BookOpen,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Trash2,
  Database,
  Activity,
  DollarSign,
  Sliders,
  Play,
  FileCode2,
  AlertCircle,
  CheckCircle2,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  ForgedAppBlueprint,
  GCPServiceTopology,
  GCPTelemetryData,
  KaffahOrchestrationResult,
  PillarType,
  PlatformModuleItem
} from '../types';
import {
  GCP_ABDI_SERVICES,
  GCP_IAC_TEMPLATES,
  GCP_FINOPS_ESTIMATES,
  GCP_DEVELOPER_PROMPTS
} from '../data/gcpArchitectureData';
import { useTheme } from '../context/ThemeContext';

interface PlatformStudioProps {
  onNavigatePillar: (pillar: PillarType) => void;
  onOpenInfaqModal: (title?: string, amount?: number) => void;
}

const BUILTIN_MODULES: PlatformModuleItem[] = [
  { id: 'mod-1', name: 'Tracker Ibadah Harian', pillar: 'berdakwah', pillarLabel: '1. Berdakwah', description: 'Pemantau sholat fardhu, tilawah, dzikir, dan sedekah subuh jamaah.', aiPowered: false, status: 'Aktif' },
  { id: 'mod-2', name: 'Ayat Harian (Daily Ayat)', pillar: 'berdakwah', pillarLabel: '1. Berdakwah', description: 'Ayat Al-Qur\'an harian dengan murottal Syaikh Alafasy dan tadabbur.', aiPowered: false, status: 'Aktif' },
  { id: 'mod-3', name: 'Hadits Harian Pilihan', pillar: 'berdakwah', pillarLabel: '1. Berdakwah', description: 'Kumpulan hadits shahih harian beserta syarah ringkas.', aiPowered: false, status: 'Aktif' },
  { id: 'mod-4', name: 'Tanya AI Ustadz ABDICity', pillar: 'berdakwah', pillarLabel: '1. Berdakwah', description: 'Konsultasi fiqih, ibadah, dan adab dakwah berbasis Gemini 4 Hydrogen.', aiPowered: true, status: 'Terintegrasi AI' },
  { id: 'mod-5', name: 'AI Poster & Story Dakwah', pillar: 'berdakwah', pillarLabel: '1. Berdakwah', description: 'Generator konsep konten dakwah siap sebar untuk media sosial.', aiPowered: true, status: 'Terintegrasi AI' },
  { id: 'mod-6', name: 'AI Konsultasi Syariah', pillar: 'bersyariah', pillarLabel: '2. Bersyariah', description: 'Pendampingan hukum syariah dan fatwa muamalah kontemporer.', aiPowered: true, status: 'Terintegrasi AI' },
  { id: 'mod-7', name: 'Kalkulator Zakat & Infaq', pillar: 'bersyariah', pillarLabel: '2. Bersyariah', description: 'Perhitungan zakat maal, profesi, dan penghasilan sesuai nisab emas.', aiPowered: false, status: 'Layanan Publik' },
  { id: 'mod-8', name: 'Analisis Kepatuhan Akad AI', pillar: 'bersyariah', pillarLabel: '2. Bersyariah', description: 'Audit skema Mudharabah, Musyarakah, Murabahah bebas riba dan gharar.', aiPowered: true, status: 'Terintegrasi AI' },
  { id: 'mod-9', name: 'Peta Masjid Terdekat', pillar: 'berjamaah', pillarLabel: '3. Berjamaah', description: 'Navigasi masjid terdekat dengan Google Maps, jadwal khathib, dan fasilitas.', aiPowered: false, status: 'Layanan Publik' },
  { id: 'mod-10', name: 'Papan Masjid Digital & Wakaf', pillar: 'berjamaah', pillarLabel: '3. Berjamaah', description: 'Transparansi saldo kas masjid, agenda kajian, dan kampanye wakaf.', aiPowered: false, status: 'Layanan Publik' },
  { id: 'mod-11', name: 'Direktori UMKM Komunitas', pillar: 'bermuamalah', pillarLabel: '4. Bermuamalah', description: 'Etalase pelaku usaha Muslim terafiliasi masjid dan forum syirkah.', aiPowered: false, status: 'Layanan Publik' },
  { id: 'mod-12', name: 'Halal Vision Scanner AI', pillar: 'bermuamalah', pillarLabel: '4. Bermuamalah', description: 'Pemindai kamera kemasan dan komposisi bahan untuk status Halal vs Syubhat.', aiPowered: true, status: 'Terintegrasi AI' }
];

const INITIAL_FORGED_BLUEPRINTS: ForgedAppBlueprint[] = [
  {
    id: 'bp-baitul-maal',
    appName: 'Baitul Maal & Wakaf Produktif Masjid',
    pillar: 'Bersyariah',
    tagline: 'Pengelolaan dana zakat, infaq, dan wakaf tunai teraudit syariah secara real-time.',
    executiveSummary: 'Aplikasi terintegrasi untuk takmir dan amil masjid dalam mencatat penghimpunan ZISWAF, menyalurkan modal bergulir Qardhul Hasan kepada jamaah dhuafa, serta melaporkan arus kas dan imbal hasil wakaf produktif secara transparan.',
    targetUsers: 'Takmir Masjid, Amil Zakat, Muzakki, dan Mustahik UMKM',
    syariahGuardrails: [
      'Pemisahan rekening dan buku besar antara dana Zakat (8 Asnaf), Infaq Terikat, dan Wakaf Produktif.',
      'Validasi akad Qardhul Hasan 0% bunga/denda keterlambatan.',
      'Audit periodik rasio penyaluran hak amil maksimal 12.5% sesuai kaidah syariat.'
    ],
    dataModels: [
      { entityName: 'ziswaf_ledgers', storageEngine: 'Cloud SQL PostgreSQL', fields: ['id: UUID', 'fund_type: ENUM(ZAKAT, INFAQ, WAKAF)', 'amount_idr: BIGINT', 'asnaf_category: VARCHAR', 'verified_at: TIMESTAMP'] },
      { entityName: 'wakaf_assets', storageEngine: 'Cloud Firestore', fields: ['assetId: string', 'mosqueId: string', 'assetTitle: string', 'netYieldMonthly: number', 'beneficiaryCount: number'] }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/ziswaf/transactions', purpose: 'Mencatat penyaluran dana masuk dengan validasi akad dan penerbitan kuitansi' },
      { method: 'GET', path: '/api/ziswaf/transparency/:mosqueId', purpose: 'Mengambil rekap saldo dan laporan distribusi real-time untuk papan digital masjid' },
      { method: 'POST', path: '/api/ziswaf/ai-asnaf-verify', purpose: 'Asisten AI memverifikasi kelayakan pengajuan bantuan mustahik berdasarkan kategori asnaf' }
    ],
    aiCapabilities: [
      'Deteksi anomali pencatatan buku besar ZISWAF otomatis.',
      'Rekomendasi alokasi dana produktif berbasis profil kebutuhan mustahik sekitar masjid.',
      'Pembuatan ringkasan laporan pertanggungjawaban DKM bulanan secara otomatis.'
    ],
    cloudInfrastructure: {
      compute: 'Google Cloud Run (asia-southeast2 Jakarta, min-instances: 1)',
      database: 'Cloud SQL PostgreSQL 16 (ledger) + Cloud Firestore (real-time board)',
      security: 'Cloud KMS enkripsi data mustahik + Cloud Armor WAF',
      estimatedMonthlyCost: 'Rp 0 - Rp 180.000 / bulan (skala 10-100 masjid)'
    },
    reactComponentCode: `import React, { useState } from 'react';

interface LedgerEntry {
  id: string;
  fundType: 'Zakat' | 'Infaq' | 'Wakaf Produktif';
  donor: string;
  amount: number;
}

export const BaitulMaalWidget: React.FC = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { id: 'ZM-01', fundType: 'Zakat', donor: 'Hamba Allah', amount: 2500000 },
    { id: 'WK-02', fundType: 'Wakaf Produktif', donor: 'Keluarga H. Ahmad', amount: 5000000 }
  ]);

  const totalSaldo = entries.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Buku Besar Baitul Maal Masjid</h3>
          <p className="text-xs text-slate-500">Pemisahan akun Zakat, Infaq, dan Wakaf Produktif</p>
        </div>
        <div className="text-right font-mono tabular-nums">
          <div className="text-xs text-slate-500">Total Dana Amanah</div>
          <div className="text-xl font-bold text-emerald-800">Rp {totalSaldo.toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {entries.map((entry) => (
          <div key={entry.id} className="py-2.5 flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-slate-900">{entry.donor}</span>
              <span className="text-xs text-slate-500 ml-2">· {entry.fundType}</span>
            </div>
            <span className="font-mono tabular-nums font-semibold text-emerald-800">
              Rp {entry.amount.toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};`,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'bp-halal-trace',
    appName: 'Rantai Pasok Halal UMKM Masjid',
    pillar: 'Bermuamalah',
    tagline: 'Pelacakan bahan baku, titik kritis halal, dan distribusi produk UMKM jamaah.',
    executiveSummary: 'Modul cerdas untuk mendampingi pelaku usaha kuliner dan pangan halal di sekitar masjid agar seluruh bahan baku, pemasok, hingga kemasan terverifikasi halal BPJPH dan tercatat rapi dalam jejak digital.',
    targetUsers: 'Pelaku UMKM Halal, Penyelia Halal Masjid, Pembeli Jamaah',
    syariahGuardrails: [
      'Setiap bahan baku kritis (daging, gelatin, emulsifier) wajib melampirkan nomor sertifikat halal pemasok.',
      'Transaksi B2B antara pemasok dan UMKM menggunakan akad Salam atau Murabahah yang transparan harganya.',
      'Penolakan otomatis pemasok yang tidak memenuhi kriteria thayyib dan bebas najis.'
    ],
    dataModels: [
      { entityName: 'halal_ingredients_trace', storageEngine: 'Cloud Firestore', fields: ['lotCode: string', 'ingredientName: string', 'halalCertNo: string', 'supplierId: string', 'status: HALAL | SYUBHAT'] },
      { entityName: 'umkm_batches', storageEngine: 'Cloud Storage + Firestore', fields: ['batchId: string', 'umkmId: string', 'producedDate: string', 'qrAuditUrl: string'] }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/halal-trace/verify-batch', purpose: 'Memeriksa kelengkapan sertifikat bahan baku pada satu batch produksi UMKM' },
      { method: 'GET', path: '/api/halal-trace/qr/:batchId', purpose: 'Menampilkan riwayat kehalalan bahan baku kepada konsumen melalui kode QR' }
    ],
    aiCapabilities: [
      'Ekstraksi otomatis tanggal kedaluwarsa dan nomor sertifikat halal dari foto dokumen pemasok.',
      'Peringatan dini (early warning) jika sertifikat pemasok mendekati masa habis berlaku.'
    ],
    cloudInfrastructure: {
      compute: 'Google Cloud Run + Gemini 4 Hydrogen Vision Worker',
      database: 'Cloud Firestore + Cloud Storage (dokumen sertifikat)',
      security: 'Secret Manager + IAM Least Privilege per UMKM',
      estimatedMonthlyCost: 'Rp 0 - Rp 120.000 / bulan (GCP Free Tier eligible)'
    },
    reactComponentCode: `import React from 'react';

export const HalalTraceBatchCard: React.FC<{ batchId: string; status: 'HALAL' | 'SYUBHAT' }> = ({ batchId, status }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500 font-mono">BATCH #{batchId}</div>
        <h4 className="text-base font-bold text-slate-900 mt-0.5">Audit Bahan Baku Terlacak</h4>
      </div>
      <span className={status === 'HALAL' ? 'text-sm font-bold text-emerald-700' : 'text-sm font-bold text-amber-700'}>
        {status === 'HALAL' ? 'Terverifikasi Halal' : 'Butuh Verifikasi'}
      </span>
    </div>
  );
};`,
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

const FORGE_PRESETS = [
  {
    label: 'Sistem Faraidh & Konsultasi Waris Syariah',
    appName: 'Kalkulator & Konsultan Faraidh Kaffah',
    pillar: 'Bersyariah' as const,
    targetUsers: 'Keluarga Muslim, Takmir, Hakim & Konsultan Syariah',
    problemStatement: 'Membantu umat menghitung pembagian harta warisan sesuai Al-Qur\'an (QS. An-Nisa) dengan penjelasan ashabul furudh dan ashabah.',
    aiCapability: 'Penalaran hukum waris Islam terstruktur dengan Gemini 4 Hydrogen dan ekspor berita acara musyawarah keluarga.'
  },
  {
    label: 'Akademi Tahfidz & Setoran Hafalan Berjamaah',
    appName: 'Halaqah Tahfidz & Evaluasi Tajwid Cerdas',
    pillar: 'Berdakwah' as const,
    targetUsers: 'Santri TPA, Pemuda Masjid, Ustadz Pembimbing',
    problemStatement: 'Memudahkan pencatatan setoran hafalan Al-Qur\'an, jadwal murojaah, dan evaluasi makhraj santri secara daring maupun luring di masjid.',
    aiCapability: 'Pembuatan rencana murojaah adaptif harian dan ringkasan progres hafalan untuk orang tua.'
  },
  {
    label: 'Sistem Logistik Pangan & Sedekah Subuh Berjamaah',
    appName: 'Logistik Berkah Pangan Masjid',
    pillar: 'Berjamaah' as const,
    targetUsers: 'Relawan Masjid, Donatur Pangan, Dhuafa & Musafir',
    problemStatement: 'Mengorkestrasi pasokan nasi kotak Jum\'at Berkah dan sembako agar merata tanpa penumpukan di satu masjid saja.',
    aiCapability: 'Prediksi kebutuhan porsi jamaah dan optimasi rute distribusi antar masjid terdekat.'
  },
  {
    label: 'Platform Pembiayaan Syirkah UMKM Tanpa Riba',
    appName: 'Simulasi & Pengawasan Akad Syirkah UMKM',
    pillar: 'Bermuamalah' as const,
    targetUsers: 'Pemilik Usaha UMKM, Pemodal Jamaah, Pengawas Syariah',
    problemStatement: 'Menghubungkan pemodal Muslim dengan UMKM halal berkinerja baik memakai akad Mudharabah dan Musyarakah transparan.',
    aiCapability: 'Audit kelayakan laporan arus kas UMKM dan deteksi potensi klausul gharar pada draft perjanjian.'
  }
];

export const PlatformStudio: React.FC<PlatformStudioProps> = ({
  onNavigatePillar,
  onOpenInfaqModal
}) => {
  const { isDark } = useTheme();
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'forge' | 'orchestrator' | 'infra' | 'finops'>('forge');

  // === TAB 1: APP FORGE AI STATE ===
  const [forgeAppName, setForgeAppName] = useState('Portal Baitul Maal & Beasiswa Santri Masjid');
  const [forgePillar, setForgePillar] = useState<ForgedAppBlueprint['pillar']>('Lintas 4 Pilar');
  const [forgeTargetUsers, setForgeTargetUsers] = useState('Pengurus DKM, Donatur Jamaah, Santri & Pelaku UMKM');
  const [forgeProblem, setForgeProblem] = useState('Mengintegrasikan dana zakat dan infaq produktif masjid untuk membiayai beasiswa tahfidz serta modal kerja UMKM halal tanpa riba.');
  const [forgeAiCap, setForgeAiCap] = useState('Skoring kelayakan mustahik berbasis asnaf, rekomendasi akad bebas riba, dan laporan transparansi otomatis.');
  const [isForging, setIsForging] = useState(false);
  const [forgeError, setForgeError] = useState<string | null>(null);

  const [forgedApps, setForgedApps] = useState<ForgedAppBlueprint[]>(() => {
    try {
      const saved = localStorage.getItem('abdicity_forged_apps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed loading forged apps', e);
    }
    return INITIAL_FORGED_BLUEPRINTS;
  });

  const [selectedBlueprint, setSelectedBlueprint] = useState<ForgedAppBlueprint>(forgedApps[0]);
  const [blueprintViewTab, setBlueprintViewTab] = useState<'overview' | 'schema' | 'code' | 'cloud'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('abdicity_forged_apps', JSON.stringify(forgedApps));
    } catch (e) {
      console.error(e);
    }
  }, [forgedApps]);

  const handleForgeApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgeAppName.trim() || isForging) return;

    setIsForging(true);
    setForgeError(null);

    try {
      const res = await fetch('/api/platform/forge-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: forgeAppName,
          pillar: forgePillar,
          targetUsers: forgeTargetUsers,
          problemStatement: forgeProblem,
          aiCapability: forgeAiCap
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.blueprint) {
        throw new Error(data.error || 'Gagal merancang aplikasi cerdas 4B.');
      }

      const newBp: ForgedAppBlueprint = data.blueprint;
      setForgedApps((prev) => [newBp, ...prev]);
      setSelectedBlueprint(newBp);
      setBlueprintViewTab('overview');
    } catch (err: any) {
      setForgeError(err.message || 'Terjadi kesalahan saat memanggil AI App Forge.');
    } finally {
      setIsForging(false);
    }
  };

  // === TAB 2: KAFFAH 4B ORCHESTRATOR & REGISTRY ===
  const [orchestrateQuery, setOrchestrateQuery] = useState('');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrateError, setOrchestrateError] = useState<string | null>(null);
  const [orchestrationResult, setOrchestrationResult] = useState<KaffahOrchestrationResult>({
    query: 'Bagaimana mengembangkan ekosistem masjid mandiri yang menyatukan dakwah, kepatuhan syariah, dan pemberdayaan UMKM jamaah?',
    summary: 'Sinergi 4B Kaffah menjadikan masjid bukan hanya pusat ibadah ritual, melainkan pusat peradaban digital yang menghubungkan ilmu, ketaatan hukum syariah, solidaritas jamaah, dan ekonomi halal yang produktif.',
    dalilAnchor: 'QS. Al-Ma\'idah [5]: 2 — "Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa."',
    pillars: {
      berdakwah: { title: 'Kajian Ekonomi Syariah Mingguan', action: 'Publikasikan jadwal kajian rutin dan materi poster hikmah muamalah melalui modul AI Story & Ayat Harian.', metric: 'Target 300+ jamaah hadir/pekan' },
      bersyariah: { title: 'Audit Akad & Zakat Produktif', action: 'Verifikasi seluruh transaksi UMKM binaan menggunakan Analisis Akad AI agar bebas riba serta salurkan zakat maal via Kalkulator Zakat.', metric: '100% kepatuhan akad syariah' },
      berjamaah: { title: 'Aktivasi Papan Masjid & Relawan', action: 'Publikasikan daftar UMKM jamaah di Papan Masjid Digital dan koordinasikan tim relawan logistik masjid.', metric: 'Keterlibatan 40+ relawan aktif' },
      bermuamalah: { title: 'Etalase Halal & Kemitraan Syirkah', action: 'Daftarkan produk pelaku usaha ke Direktori UMKM, validasi bahan dengan Halal Vision Scanner, dan buka forum Syirkah.', metric: 'Pertumbuhan omzet halal +25%' }
    },
    recommendedModules: ['Tanya AI Ustadz ABDICity', 'Analisis Kepatuhan Akad AI', 'Papan Masjid Digital & Wakaf', 'Halal Vision Scanner AI'],
    nextExecutionStep: 'Mulai dengan membuka Pilar Bersyariah untuk menguji akad kerja sama UMKM masjid, lalu tayangkan di Direktori UMKM Bermuamalah.'
  });

  const [moduleFilter, setModuleFilter] = useState<'all' | PillarType>('all');
  const [moduleSearch, setModuleSearch] = useState('');

  const handleOrchestrate = async (customQuery?: string) => {
    const q = (customQuery || orchestrateQuery).trim();
    if (!q || isOrchestrating) return;

    setIsOrchestrating(true);
    setOrchestrateError(null);
    try {
      const res = await fetch('/api/platform/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.result) {
        throw new Error(data.error || 'Gagal menyusun orkestrasi 4B.');
      }
      setOrchestrationResult(data.result);
      if (!customQuery) setOrchestrateQuery('');
    } catch (err: any) {
      setOrchestrateError(err.message || 'Gagal memproses orkestrasi 4B.');
    } finally {
      setIsOrchestrating(false);
    }
  };

  // === TAB 3: INFRASTRUCTURE & CLOUD ARCHITECT STATE ===
  const [telemetry, setTelemetry] = useState<GCPTelemetryData | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [selectedTopologyCategory, setSelectedTopologyCategory] = useState('Semua');
  const [inspectService, setInspectService] = useState<GCPServiceTopology>(GCP_ABDI_SERVICES[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(GCP_IAC_TEMPLATES[0].id);
  const [architectTopic, setArchitectTopic] = useState('Arsitektur & Skalabilitas');
  const [architectPrompt, setArchitectPrompt] = useState('');
  const [architectAnswer, setArchitectAnswer] = useState<string | null>(null);
  const [loadingArchitect, setLoadingArchitect] = useState(false);

  const fetchTelemetry = async () => {
    setLoadingTelemetry(true);
    try {
      const res = await fetch('/api/gcp/status');
      const data = await res.json();
      if (data.success && data.environment) {
        setTelemetry(data.environment);
      }
    } catch (err) {
      console.error('Failed loading platform telemetry', err);
    } finally {
      setLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleAskArchitect = async (questionOverride?: string, topicOverride?: string) => {
    const q = (questionOverride || architectPrompt).trim();
    const t = topicOverride || architectTopic;
    if (!q || loadingArchitect) return;

    setLoadingArchitect(true);
    setArchitectAnswer(null);
    try {
      const res = await fetch('/api/gemini/gcp-facilitator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          topic: t,
          currentConfig: 'Stack: Google Cloud Run (asia-southeast2), Gemini 4 Hydrogen, Node Express, Vite React, Firestore, Cloud SQL PostgreSQL'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal berkonsultasi.');
      setArchitectAnswer(data.answer);
    } catch (err: any) {
      setArchitectAnswer(`Kendala koneksi Arsitek AI: ${err.message}`);
    } finally {
      setLoadingArchitect(false);
    }
  };

  // === TAB 4: FINOPS SYARIAH INTERACTIVE SIMULATOR ===
  const [mosqueCount, setMosqueCount] = useState(50);
  const [dailyAiRequests, setDailyAiRequests] = useState(1200);
  const [mediaStorageGb, setMediaStorageGb] = useState(40);

  const finOpsCalc = useMemo(() => {
    const estimatedMonthlyReq = mosqueCount * 15000 + dailyAiRequests * 30;
    const freeTierComputeCovered = estimatedMonthlyReq <= 2000000;
    const computeCostIdr = freeTierComputeCovered ? 0 : Math.round(((estimatedMonthlyReq - 2000000) / 1000000) * 65000);
    const aiCostIdr = dailyAiRequests <= 1500 ? 0 : Math.round(((dailyAiRequests - 1500) * 30) * 1.8);
    const storageCostIdr = mediaStorageGb <= 5 ? 0 : Math.round((mediaStorageGb - 5) * 3200);
    const totalCostIdr = computeCostIdr + aiCostIdr + storageCostIdr;

    const chartBreakdown = [
      { component: 'Cloud Run Compute', biaya: computeCostIdr },
      { component: 'Gemini 4 AI Mesh', biaya: aiCostIdr },
      { component: 'Cloud Storage Media', biaya: storageCostIdr }
    ];

    return {
      estimatedMonthlyReq,
      freeTierComputeCovered,
      computeCostIdr,
      aiCostIdr,
      storageCostIdr,
      totalCostIdr,
      chartBreakdown
    };
  }, [mosqueCount, dailyAiRequests, mediaStorageGb]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredModules = BUILTIN_MODULES.filter((m) => {
    const matchesPillar = moduleFilter === 'all' || m.pillar === moduleFilter;
    const q = moduleSearch.trim().toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    return matchesPillar && matchesSearch;
  });

  const currentTemplate = GCP_IAC_TEMPLATES.find((t) => t.id === selectedTemplateId) || GCP_IAC_TEMPLATES[0];
  const topologyCategories = ['Semua', 'Compute & Serverless', 'AI & Intelligence', 'Storage & Database', 'Events & Messaging', 'Security & IAM', 'DevOps & Monitoring'];
  const filteredTopology = selectedTopologyCategory === 'Semua'
    ? GCP_ABDI_SERVICES
    : GCP_ABDI_SERVICES.filter((s) => s.category === selectedTopologyCategory);

  return (
    <div className="space-y-8">
      {/* PLATFORM HERO OVERVIEW & SUMMARY STRIP */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-medium text-emerald-800">
              Infrastruktur Superaplikasi Cerdas · Ekosistem 4B Kaffah · Gemini 4 Hydrogen
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Platform Studio ABDICity.cloud
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pusat rekayasa, orkestrasi kecerdasan buatan, dan pembangun modul aplikasi cerdas 4B Kaffah (Berdakwah, Bersyariah, Berjamaah, Bermuamalah) untuk mengembangkan layanan umat berbasis masjid secara terukur dan sesuai syariah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveWorkspaceTab('forge')}
              className="px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bangun Modul 4B</span>
            </button>
            <button
              onClick={() => onOpenInfaqModal('Wakaf Pengembangan Infrastruktur Digital ABDICity.cloud', 100000)}
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Dukung Wakaf Infrastruktur
            </button>
          </div>
        </div>

        {/* 4-Column Tabular KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Modul Ekosistem Aktif</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {BUILTIN_MODULES.length + forgedApps.length}
            </div>
            <div className="text-xs text-emerald-700 font-medium">
              {BUILTIN_MODULES.length} Bawaan · {forgedApps.length} Dibangun
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Mesin Kecerdasan AI</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              Gemini 4
            </div>
            <div className="text-xs text-slate-600">
              {telemetry?.servicesStatus?.vertexAiGemini?.status === 'CONFIGURED' ? 'Koneksi API Siap' : 'Menunggu Konfigurasi Key'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Infrastruktur Cloud Run</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {telemetry ? `${telemetry.memoryUsage.rssMb} MB` : 'Aktif'}
            </div>
            <div className="text-xs text-slate-600">
              {telemetry?.region || 'asia-southeast2 (Jakarta)'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Pilar Syariah Terpadu</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              4B Kaffah
            </div>
            <div className="text-xs text-slate-600">
              Berdakwah · Bersyariah · Berjamaah · Bermuamalah
            </div>
          </div>
        </div>
      </section>

      {/* WORKSPACE MODE SEGMENTED NAVIGATION */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveWorkspaceTab('forge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeWorkspaceTab === 'forge'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-700" />
          <span>Pembangun Aplikasi 4B (App Forge)</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('orchestrator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeWorkspaceTab === 'orchestrator'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Orkestrator 4B & Registri Modul</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('infra')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeWorkspaceTab === 'infra'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-700" />
          <span>Infrastruktur Cloud & IaC</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('finops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeWorkspaceTab === 'finops'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-700" />
          <span>FinOps Syariah & Skala</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* WORKSPACE TAB 1: APP FORGE AI (BUILD 4B INTELLIGENT MODULES)        */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: BUILDER FORM & SAVED APPS */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleForgeApp} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rancang Aplikasi Cerdas Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hasilkan arsitektur lengkap, penjagaan syariah, skema data, API, dan kode komponen React untuk ABDICity.cloud.
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-slate-600">Templat Cepat Pengembangan Umat</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FORGE_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setForgeAppName(preset.appName);
                        setForgePillar(preset.pillar);
                        setForgeTargetUsers(preset.targetUsers);
                        setForgeProblem(preset.problemStatement);
                        setForgeAiCap(preset.aiCapability);
                      }}
                      className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-colors"
                    >
                      <div className="text-xs font-semibold text-slate-900 line-clamp-1">{preset.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{preset.pillar}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Nama Modul Aplikasi</label>
                  <input
                    type="text"
                    required
                    value={forgeAppName}
                    onChange={(e) => setForgeAppName(e.target.value)}
                    placeholder="Contoh: Sistem Wakaf Produktif Masjid"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Pilar 4B Kaffah</label>
                    <select
                      value={forgePillar}
                      onChange={(e) => setForgePillar(e.target.value as ForgedAppBlueprint['pillar'])}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:border-emerald-700"
                    >
                      <option value="Lintas 4 Pilar">Lintas 4 Pilar</option>
                      <option value="Berdakwah">1. Berdakwah</option>
                      <option value="Bersyariah">2. Bersyariah</option>
                      <option value="Berjamaah">3. Berjamaah</option>
                      <option value="Bermuamalah">4. Bermuamalah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Target Pengguna</label>
                    <input
                      type="text"
                      value={forgeTargetUsers}
                      onChange={(e) => setForgeTargetUsers(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Kebutuhan Umat / Masalah yang Diselesaikan</label>
                  <textarea
                    rows={3}
                    value={forgeProblem}
                    onChange={(e) => setForgeProblem(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Kecerdasan AI yang Dibutuhkan</label>
                  <input
                    type="text"
                    value={forgeAiCap}
                    onChange={(e) => setForgeAiCap(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {forgeError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{forgeError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isForging || !forgeAppName.trim()}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isForging ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Merancang Arsitektur & Kode...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Blueprint & Kode Aplikasi</span>
                  </>
                )}
              </button>
            </form>

            {/* Saved Forged Blueprints List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Registri Blueprint Terbangun ({forgedApps.length})</h4>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {forgedApps.map((bp) => {
                  const isActive = selectedBlueprint?.id === bp.id;
                  return (
                    <div
                      key={bp.id}
                      onClick={() => setSelectedBlueprint(bp)}
                      className={`py-3 px-2 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                        isActive ? 'bg-emerald-50/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{bp.appName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {bp.pillar} · {new Date(bp.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      {forgedApps.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const remaining = forgedApps.filter((item) => item.id !== bp.id);
                            setForgedApps(remaining);
                            if (selectedBlueprint?.id === bp.id && remaining[0]) {
                              setSelectedBlueprint(remaining[0]);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus Blueprint"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: BLUEPRINT INSPECTOR & CODE OUTPUT */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            {selectedBlueprint && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-emerald-800">
                      {selectedBlueprint.pillar} · {selectedBlueprint.targetUsers}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedBlueprint.appName}</h3>
                    <p className="text-xs sm:text-sm text-slate-600">{selectedBlueprint.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(`${selectedBlueprint.appName.toLowerCase().replace(/\s+/g, '-')}-blueprint.json`, JSON.stringify(selectedBlueprint, null, 2))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor JSON</span>
                    </button>
                  </div>
                </div>

                {/* Blueprint Sub-Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setBlueprintViewTab('overview')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      blueprintViewTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ringkasan & Syariah
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlueprintViewTab('schema')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      blueprintViewTab === 'schema' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Model Data & API ({selectedBlueprint.apiEndpoints.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlueprintViewTab('code')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      blueprintViewTab === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kode React TSX
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlueprintViewTab('cloud')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      blueprintViewTab === 'cloud' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Infrastruktur Cloud
                  </button>
                </div>

                {blueprintViewTab === 'overview' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arsitektur Fungsional</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedBlueprint.executiveSummary}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Penjagaan Kaidah Syariah (Guardrails)</h4>
                      <ul className="space-y-2">
                        {selectedBlueprint.syariahGuardrails.map((rule, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kapabilitas Kecerdasan AI</h4>
                      <ul className="space-y-1.5">
                        {selectedBlueprint.aiCapabilities.map((cap, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {blueprintViewTab === 'schema' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skema Entitas Data</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBlueprint.dataModels.map((dm, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-slate-900">{dm.entityName}</span>
                              <span className="text-[11px] text-slate-500">{dm.storageEngine}</span>
                            </div>
                            <ul className="space-y-1 font-mono text-[11px] text-slate-600">
                              {dm.fields.map((f, fIdx) => (
                                <li key={fIdx}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kontrak API Backend</h4>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {selectedBlueprint.apiEndpoints.map((ep, idx) => (
                          <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="font-mono font-semibold text-slate-900">
                              <span className="text-emerald-700 mr-2">{ep.method}</span>
                              <span>{ep.path}</span>
                            </div>
                            <span className="text-slate-600">{ep.purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {blueprintViewTab === 'code' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">Komponen Starter React + TypeScript</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedBlueprint.reactComponentCode, 'bp-code')}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                        >
                          {copiedId === 'bp-code' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === 'bp-code' ? 'Tersalin' : 'Salin Kode'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(`${selectedBlueprint.appName.replace(/\s+/g, '')}.tsx`, selectedBlueprint.reactComponentCode)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh .tsx</span>
                        </button>
                      </div>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-emerald-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[420px]">
                      <code>{selectedBlueprint.reactComponentCode}</code>
                    </pre>
                  </div>
                )}

                {blueprintViewTab === 'cloud' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-xs text-slate-500">Komputasi Serverless</div>
                      <div className="font-semibold text-slate-900">{selectedBlueprint.cloudInfrastructure.compute}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-xs text-slate-500">Penyimpanan & Database</div>
                      <div className="font-semibold text-slate-900">{selectedBlueprint.cloudInfrastructure.database}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-xs text-slate-500">Keamanan & Enkripsi</div>
                      <div className="font-semibold text-slate-900">{selectedBlueprint.cloudInfrastructure.security}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-xs text-slate-500">Estimasi FinOps Syariah</div>
                      <div className="font-semibold text-emerald-800 font-mono tabular-nums">
                        {selectedBlueprint.cloudInfrastructure.estimatedMonthlyCost}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* WORKSPACE TAB 2: KAFFAH 4B ORCHESTRATOR & MODULE REGISTRY           */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'orchestrator' && (
        <div className="space-y-8">
          {/* Cross-Pillar AI Orchestrator */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Orkestrator Kecerdasan 4B Kaffah</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Ubah satu gagasan atau kebutuhan jamaah menjadi rencana aksi terpadu di seluruh 4 pilar ABDICity.cloud sekaligus.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={orchestrateQuery}
                onChange={(e) => setOrchestrateQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOrchestrate()}
                placeholder="Tulis rencana inisiatif umat (misal: Membangun koperasi halal pemuda masjid berbasis wakaf produktif)..."
                className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
              />
              <button
                type="button"
                onClick={() => handleOrchestrate()}
                disabled={isOrchestrating || !orchestrateQuery.trim()}
                className="px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
              >
                {isOrchestrating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyusun...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Orkestrasi 4B</span>
                  </>
                )}
              </button>
            </div>

            {orchestrateError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {orchestrateError}
              </div>
            )}

            {/* Result Matrix */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <div className="text-xs font-medium text-emerald-800">{orchestrationResult.dalilAnchor}</div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">{orchestrationResult.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-800">1. Berdakwah</div>
                  <h4 className="text-sm font-bold text-slate-900">{orchestrationResult.pillars.berdakwah.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{orchestrationResult.pillars.berdakwah.action}</p>
                  <div className="text-[11px] font-mono text-slate-500 pt-1">{orchestrationResult.pillars.berdakwah.metric}</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-800">2. Bersyariah</div>
                  <h4 className="text-sm font-bold text-slate-900">{orchestrationResult.pillars.bersyariah.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{orchestrationResult.pillars.bersyariah.action}</p>
                  <div className="text-[11px] font-mono text-slate-500 pt-1">{orchestrationResult.pillars.bersyariah.metric}</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-800">3. Berjamaah</div>
                  <h4 className="text-sm font-bold text-slate-900">{orchestrationResult.pillars.berjamaah.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{orchestrationResult.pillars.berjamaah.action}</p>
                  <div className="text-[11px] font-mono text-slate-500 pt-1">{orchestrationResult.pillars.berjamaah.metric}</div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-800">4. Bermuamalah</div>
                  <h4 className="text-sm font-bold text-slate-900">{orchestrationResult.pillars.bermuamalah.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{orchestrationResult.pillars.bermuamalah.action}</p>
                  <div className="text-[11px] font-mono text-slate-500 pt-1">{orchestrationResult.pillars.bermuamalah.metric}</div>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <strong className="text-slate-900">Langkah Eksekusi Berikutnya:</strong> {orchestrationResult.nextExecutionStep}
                </span>
                <span className="font-mono text-[11px] text-emerald-800 shrink-0">
                  {orchestrationResult.recommendedModules.join(' · ')}
                </span>
              </div>
            </div>
          </section>

          {/* Module Registry Grid */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registri Modul Superaplikasi ABDICity.cloud</h3>
                <p className="text-xs text-slate-500">Pilih modul di bawah untuk langsung mengakses dan menjalankannya.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    placeholder="Cari modul..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {([
                    { id: 'all', label: 'Semua' },
                    { id: 'berdakwah', label: 'Berdakwah' },
                    { id: 'bersyariah', label: 'Bersyariah' },
                    { id: 'berjamaah', label: 'Berjamaah' },
                    { id: 'bermuamalah', label: 'Bermuamalah' }
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModuleFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                        moduleFilter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((mod) => (
                <button
                  type="button"
                  key={mod.id}
                  onClick={() => onNavigatePillar(mod.pillar)}
                  className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 transition-colors flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{mod.pillarLabel} · {mod.status}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{mod.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =================================================================== */}
      {/* WORKSPACE TAB 3: CLOUD INFRASTRUCTURE & IAC CONTROL PLANE           */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'infra' && (
        <div className="space-y-8">
          {/* Live Runtime Telemetry */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Diagnostik Runtime Server Langsung</h3>
                <p className="text-xs text-slate-500">Data langsung dari endpoint /api/gcp/status server Node.js & Cloud Run.</p>
              </div>
              <button
                type="button"
                onClick={fetchTelemetry}
                disabled={loadingTelemetry}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingTelemetry ? 'animate-spin' : ''}`} />
                <span>Segarkan</span>
              </button>
            </div>

            {telemetry ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-slate-500">Platform</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{telemetry.platform}</div>
                </div>
                <div>
                  <div className="text-slate-500">Node.js Runtime</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">{telemetry.nodeVersion}</div>
                </div>
                <div>
                  <div className="text-slate-500">Uptime</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">{telemetry.uptimeSeconds} detik</div>
                </div>
                <div>
                  <div className="text-slate-500">Memori RSS</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">{telemetry.memoryUsage.rssMb} MB</div>
                </div>
                <div>
                  <div className="text-slate-500">Heap Terpakai</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">{telemetry.memoryUsage.heapUsedMb} MB</div>
                </div>
                <div>
                  <div className="text-slate-500">Model AI Aktif</div>
                  <div className="font-mono font-semibold text-emerald-700 mt-0.5">gemini-4-hydrogen</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Memuat telemetri server...</div>
            )}
          </section>

          {/* Service Topology Explorer */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Topologi Layanan Infrastruktur ({GCP_ABDI_SERVICES.length})</h3>
                <p className="text-xs text-slate-500">Klik layanan untuk memeriksa spesifikasi teknis, region, dan efisiensi FinOps.</p>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none p-1 bg-slate-100 rounded-lg">
                {topologyCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedTopologyCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                      selectedTopologyCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTopology.map((svc) => {
                  const selected = inspectService.id === svc.id;
                  return (
                    <button
                      type="button"
                      key={svc.id}
                      onClick={() => setInspectService(svc)}
                      className={`text-left p-4 rounded-xl border transition-colors space-y-1.5 ${
                        selected ? 'border-emerald-700 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] text-slate-500">{svc.category} · {svc.status}</div>
                      <div className="text-sm font-bold text-slate-900">{svc.name}</div>
                      <div className="text-xs font-mono text-emerald-800 tabular-nums">{svc.latencyOrMetric}</div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-5 p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                <div>
                  <div className="text-slate-500">{inspectService.category}</div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{inspectService.name}</h4>
                  <div className="font-mono text-[11px] text-emerald-800 break-all mt-1">{inspectService.gcpResourceName}</div>
                </div>
                <p className="text-slate-700 leading-relaxed">{inspectService.islamicityFunction}</p>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800">Spesifikasi Teknis</div>
                  <div className="font-mono text-[11px] text-slate-600">{inspectService.specSummary}</div>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-800">Rekomendasi FinOps</div>
                  <div className="text-slate-600">{inspectService.finOpsSavingTip}</div>
                </div>
              </div>
            </div>
          </section>

          {/* IaC Generator + AI Cloud Architect Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Generator Kode IaC & CI/CD</h3>
                  <p className="text-xs text-slate-500">Templat deployment siap pakai untuk ABDICity.cloud di Google Cloud Platform.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(currentTemplate.code, currentTemplate.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    {copiedId === currentTemplate.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === currentTemplate.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(currentTemplate.filename, currentTemplate.code)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto scrollbar-none">
                {GCP_IAC_TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                      selectedTemplateId === tmpl.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tmpl.filename}
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-600">{currentTemplate.description}</p>

              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                <code>{currentTemplate.code}</code>
              </pre>
            </section>

            {/* AI Cloud Architect Advisor */}
            <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Konsultasi Arsitek Cloud AI</h3>
                <p className="text-xs text-slate-500">Diskusikan skalabilitas, Cloud Armor WAF, dan deployment zero-downtime.</p>
              </div>

              <div className="space-y-2">
                {GCP_DEVELOPER_PROMPTS.slice(0, 3).map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setArchitectTopic(item.topic);
                      setArchitectPrompt(item.question);
                      handleAskArchitect(item.question, item.topic);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.topic}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <select
                  value={architectTopic}
                  onChange={(e) => setArchitectTopic(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-emerald-700"
                >
                  <option value="Arsitektur & Skalabilitas">Arsitektur & Skalabilitas</option>
                  <option value="Keamanan & Kepatuhan Syariah">Keamanan & Kepatuhan Syariah</option>
                  <option value="DevOps & Terraform CI/CD">DevOps & Terraform CI/CD</option>
                  <option value="Optimasi Biaya (FinOps)">Optimasi Biaya (FinOps)</option>
                </select>

                <textarea
                  rows={3}
                  value={architectPrompt}
                  onChange={(e) => setArchitectPrompt(e.target.value)}
                  placeholder="Tulis pertanyaan arsitektur infrastruktur ABDICity..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700"
                />

                <button
                  type="button"
                  onClick={() => handleAskArchitect()}
                  disabled={loadingArchitect || !architectPrompt.trim()}
                  className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {loadingArchitect ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{loadingArchitect ? 'Menganalisis...' : 'Tanyakan ke Arsitek AI'}</span>
                </button>
              </div>

              {architectAnswer && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                  {architectAnswer}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* WORKSPACE TAB 4: FINOPS SYARIAH & SCALE SIMULATOR                   */}
      {/* =================================================================== */}
      {activeWorkspaceTab === 'finops' && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Simulator FinOps Syariah (Anti-Tabdzir)</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Hitung kebutuhan komputasi secara cermat agar dana infaq & wakaf teknologi bebas pemborosan (QS. Al-Isra': 26–27).
                </p>
              </div>
              <div className="text-right font-mono tabular-nums">
                <div className="text-xs text-slate-500">Estimasi Biaya Bulanan</div>
                <div className="text-2xl font-extrabold text-emerald-800">
                  {finOpsCalc.totalCostIdr === 0 ? 'Rp 0 (Free Tier)' : `Rp ${finOpsCalc.totalCostIdr.toLocaleString('id-ID')}`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Jumlah Masjid Terintegrasi</span>
                    <span className="font-mono tabular-nums text-emerald-800">{mosqueCount.toLocaleString('id-ID')} Masjid</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={1000}
                    step={10}
                    value={mosqueCount}
                    onChange={(e) => setMosqueCount(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Permintaan AI Harian (Konsultasi & Halal Vision)</span>
                    <span className="font-mono tabular-nums text-emerald-800">{dailyAiRequests.toLocaleString('id-ID')} req/hari</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={25000}
                    step={200}
                    value={dailyAiRequests}
                    onChange={(e) => setDailyAiRequests(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>Kapasitas Media Dakwah & Murottal (Cloud Storage)</span>
                    <span className="font-mono tabular-nums text-emerald-800">{mediaStorageGb} GB</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={mediaStorageGb}
                    onChange={(e) => setMediaStorageGb(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500">Estimasi Trafik Bulanan</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {finOpsCalc.estimatedMonthlyReq.toLocaleString('id-ID')} req
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500">Cakupan Cloud Run Free Tier</div>
                    <div className="font-semibold text-emerald-800 mt-0.5">
                      {finOpsCalc.freeTierComputeCovered ? '100% Tercakup Gratis' : 'Skala Berbayar Elastis'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={finOpsCalc.chartBreakdown} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="component" tick={{ fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        borderRadius: '0.75rem'
                      }}
                      formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Estimasi Biaya']}
                    />
                    <Bar dataKey="biaya" fill={isDark ? '#10b981' : '#065f46'} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Scale Reference Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GCP_FINOPS_ESTIMATES.map((tier, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2.5">
                <div className="text-xs text-slate-500">{tier.monthlyJamaah}</div>
                <h4 className="text-sm font-bold text-slate-900">{tier.scaleTier}</h4>
                <div className="text-base font-extrabold text-emerald-800 font-mono tabular-nums">{tier.estimatedCost}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{tier.description}</p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">{tier.carbonRating}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export type PillarType = 'platform' | 'berdakwah' | 'bersyariah' | 'berjamaah' | 'bermuamalah';

export interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
  passed?: boolean;
}

export interface QuranSurah {
  number: number;
  name: string;
  latinName: string;
  translatedName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  sampleAyahArabic: string;
  sampleAyahLatin: string;
  sampleAyahTranslation: string;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  image: string;
  capacity: number;
  facilities: string[];
  hasAmbulance: boolean;
  hasFreeJumatMeal: boolean;
  hasAirConditioning: boolean;
  qhatibJumatThisWeek: string;
  imajJumatThisWeek: string;
  cashBalance: number;
  activeCampaigns: number;
  contactPhone: string;
}

export interface UmkmBusiness {
  id: string;
  name: string;
  category: 'Kuliner Halal' | 'Fashion Muslim' | 'Jasa Syariah' | 'Produk Herbal' | 'Edukasi & Kitab' | 'Jasa Keuangan Syariah';
  ownerName: string;
  address: string;
  city?: string;
  mosqueAffiliation?: string;
  rating: number;
  reviewsCount: number;
  halalCertNumber?: string;
  isVerifiedSyariah: boolean;
  description: string;
  featuredProducts: {
    name: string;
    price: number;
    image: string;
  }[];
  contactWhatsapp: string;
  lookingForSyirkah: boolean;
  syirkahDetail?: string;
}

export interface CampaignWaqf {
  id: string;
  title: string;
  mosqueName: string;
  category: 'Renovasi Masjid' | 'Ambulans Gratis' | 'Beasiswa Santri' | 'Pengadaan Al-Qur\'an' | 'Makan Siang Berkah Jum\'at';
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  deadlineDays: number;
  imageUrl: string;
  description: string;
}

export interface KajianEvent {
  id: string;
  title: string;
  speaker: string;
  theme: string;
  mosqueName: string;
  date: string;
  time: string;
  isLiveStream: boolean;
  streamUrl?: string;
  attendeesCount: number;
}

export interface SyariahQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIConsultMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface DailyHadith {
  id: string;
  narrator: string;
  book: string;
  arabic: string;
  translation: string;
  explanation: string;
  category: string;
  grade?: string;
}

export interface DailyAyatVerse {
  id: string;
  surahNumber: number;
  surahName: string;
  surahLatinName: string;
  surahTranslation: string;
  ayahNumber: number;
  globalAyahNumber?: number;
  juzNumber?: number;
  revelationType: 'Makkiyyah' | 'Madaniyyah' | 'Meccan' | 'Medinan';
  arabic: string;
  latin: string;
  translationId: string;
  translationEn?: string;
  tafsirSummary: string;
  theme: string;
  audioUrl?: string;
}

export interface HalalCameraScanResult {
  id: string;
  productName: string;
  brand: string;
  category: string;
  halalStatus: 'HALAL' | 'SYUBHAT' | 'NON_HALAL' | 'TIDAK_TERDETEKSI';
  halalStatusLabel: string;
  confidenceScore: number;
  halalLogoDetected: boolean;
  halalLogoDetails: string;
  halalCertNumber?: string | null;
  detectedIngredients: string[];
  criticalHalalPoints: {
    ingredient: string;
    reason: string;
    status: 'aman' | 'kritis' | 'haram';
  }[];
  syariahVerdict: string;
  recommendation: string;
  fiqihReference: string;
  imageThumbnail: string;
  scannedAt: string;
}

export interface GCPServiceTopology {
  id: string;
  name: string;
  category: 'Compute & Serverless' | 'AI & Intelligence' | 'Storage & Database' | 'Events & Messaging' | 'Security & IAM' | 'DevOps & Monitoring';
  status: 'OPERATIONAL' | 'CONFIGURED' | 'ACTIVE' | 'CONNECTED' | 'OPTIMAL';
  description: string;
  gcpResourceName: string;
  islamicityFunction: string;
  specSummary: string;
  latencyOrMetric: string;
  recommendedRegion: string;
  finOpsSavingTip: string;
}

export interface GCPTelemetryData {
  platform: string;
  serviceName: string;
  revision: string;
  region: string;
  port: number;
  nodeVersion: string;
  uptimeSeconds: number;
  memoryUsage: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  servicesStatus: Record<string, { status: string; [key: string]: any }>;
}

export interface GCPIaCTemplate {
  id: string;
  title: string;
  category: 'terraform' | 'cloudbuild' | 'docker' | 'gcloud' | 'iam';
  filename: string;
  description: string;
  code: string;
}

export interface ForgedAppBlueprint {
  id: string;
  appName: string;
  pillar: 'Berdakwah' | 'Bersyariah' | 'Berjamaah' | 'Bermuamalah' | 'Lintas 4 Pilar';
  tagline: string;
  executiveSummary: string;
  targetUsers: string;
  syariahGuardrails: string[];
  dataModels: {
    entityName: string;
    storageEngine: string;
    fields: string[];
  }[];
  apiEndpoints: {
    method: string;
    path: string;
    purpose: string;
  }[];
  aiCapabilities: string[];
  cloudInfrastructure: {
    compute: string;
    database: string;
    security: string;
    estimatedMonthlyCost: string;
  };
  reactComponentCode: string;
  createdAt: string;
}

export interface KaffahOrchestrationResult {
  query: string;
  summary: string;
  dalilAnchor: string;
  pillars: {
    berdakwah: { title: string; action: string; metric: string };
    bersyariah: { title: string; action: string; metric: string };
    berjamaah: { title: string; action: string; metric: string };
    bermuamalah: { title: string; action: string; metric: string };
  };
  recommendedModules: string[];
  nextExecutionStep: string;
}

export interface PlatformModuleItem {
  id: string;
  name: string;
  pillar: PillarType;
  pillarLabel: string;
  description: string;
  aiPowered: boolean;
  status: 'Aktif' | 'Terintegrasi AI' | 'Layanan Publik';
}

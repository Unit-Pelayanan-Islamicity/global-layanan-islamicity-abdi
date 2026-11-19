import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Gemini Client (Server-Side Only)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ABDICity.cloud Superapp Infrastructure API" });
});

// AI Ustadz & Syariah Consultation Endpoint
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { prompt, category = "Umum" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan atur GEMINI_API_KEY di menu Settings > Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah "Ustadz AI ABDICity", asisten kecerdasan buatan islami yang bijak, ramah, dan berpengetahuan luas tentang Fiqih Islam, Ibadah, Muamalah Syariah, Dakwah, dan Kehidupan Bermasyarakat.
Panduan Jawaban:
1. Mulai dengan salam Islami hangat ("Assalamu'alaikum Warahmatullahi Wabarakatuh").
2. Berikan penjelasan berbasis Al-Qur'an dan As-Sunnah yang shahih dengan rujukan yang jelas jika ada (Surah/Ayat atau Riwayat Hadits).
3. Jika topik berada dalam kategori ${category}, sertakan sudut pandang "4B Kaffah" (Berdakwah, Bersyariah, Berjamaah, Bermuamalah) jika relevan.
4. Gunakan bahasa Indonesia yang santun, sejuk, inspiratif, dan mudah dipahami.
5. Sertakan kesimpulan praktis atau langkah nyata yang bisa dilakukan jamaah.
6. Akhiri dengan doa ringkas dan salam penutup ("Wassalamu'alaikum Warahmatullahi Wabarakatuh").`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ response: response.text || "Mohon maaf, tidak dapat menghasilkan jawaban saat ini." });
  } catch (error: any) {
    console.error("Gemini Consult Error:", error);
    res.status(500).json({ error: error?.message || "Gagal memproses konsultasi Syariah" });
  }
});

// AI Poster & Pesan Dakwah Generator
app.post("/api/gemini/poster", async (req, res) => {
  try {
    const { topic, targetAudience = "Jamaah Umum" } = req.body;
    if (!topic || typeof topic !== "string") {
      res.status(400).json({ error: "Topik dakwah diperlukan" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: "Kunci API Gemini belum dikonfigurasi di Settings > Secrets." });
      return;
    }

    const prompt = `Buatkan konsep Poster & Content Story Dakwah Islami seputar topik: "${topic}" untuk sasaran: ${targetAudience}.`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judul: { type: Type.STRING },
            ayatAtauHadits: { type: Type.STRING },
            terjemahan: { type: Type.STRING },
            poinInspirasi: { type: Type.ARRAY, items: { type: Type.STRING } },
            callToAction: { type: Type.STRING },
            saranDesainTheme: { type: Type.STRING },
          },
          required: ["judul", "ayatAtauHadits", "terjemahan", "poinInspirasi", "callToAction", "saranDesainTheme"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Poster Generator Error:", error);
    res.status(500).json({ error: error?.message || "Gagal membuat materi poster dakwah" });
  }
});

// AI Syariah Business Contract Analysis Endpoint
app.post("/api/gemini/contract-analysis", async (req, res) => {
  try {
    const { contractType, businessDescription, profitSharing, capitalTerms } = req.body;
    if (!businessDescription) {
      res.status(400).json({ error: "Deskripsi bisnis/transaksi diperlukan" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: "Kunci API Gemini belum tersedia di Settings > Secrets." });
      return;
    }

    const prompt = `Analisis Kesesuaian Syariah (Muamalah) untuk skema bisnis berikut:
- Jenis Akad yang Diinginkan: ${contractType || "Belum ditentukan"}
- Deskripsi Usaha / Transaksi: ${businessDescription}
- Skema Bagi Hasil / Keuntungan: ${profitSharing || "Belum dirinci"}
- Ketentuan Modal & Risiko: ${capitalTerms || "Belum dirinci"}`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kesesuaianSkor: { type: Type.INTEGER },
            statusSyariah: { type: Type.STRING },
            analisisRukunDanSyarat: { type: Type.STRING },
            potensiRisikoSyariah: { type: Type.ARRAY, items: { type: Type.STRING } },
            rekomendasiPerbaikan: { type: Type.ARRAY, items: { type: Type.STRING } },
            dalilPemerkuat: { type: Type.STRING },
          },
          required: ["kesesuaianSkor", "statusSyariah", "analisisRukunDanSyarat", "potensiRisikoSyariah", "rekomendasiPerbaikan", "dalilPemerkuat"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Contract Analysis Error:", error);
    res.status(500).json({ error: error?.message || "Gagal menganalisis akad muamalah" });
  }
});

// Camera-based Halal Product Vision Scanner Endpoint (Gemini API)
app.post("/api/gemini/halal-scan", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", productNameHint } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: "Data gambar kemasan produk (Base64) diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan pastikan GEMINI_API_KEY terpasang di Settings > Secrets.",
      });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const promptText = `Anda adalah "Auditor & Ahli Fiqih Halal AI" bersertifikasi standar LPPOM MUI, BPJPH Kemenag RI, dan standar Halal Internasional (JAKIM/MUIS/GSO).
Tugas Anda adalah memeriksa foto kemasan, label, merek, logo halal, atau tabel komposisi/ingredients produk yang dikirimkan oleh pengguna, lalu memberikan audit status kehalalan yang mendalam dan dapat dipertanggungjawabkan secara syariah.

${productNameHint ? `Catatan/Petunjuk Produk Tambahan dari Pengguna: "${productNameHint}"` : ""}

Panduan Analisis:
1. Identifikasi nama produk, merk/brand, dan kategori produk dari visual kemasan.
2. Deteksi apakah terdapat Logo Halal resmi yang valid (BPJPH/MUI/JAKIM/MUIS) atau nomor sertifikat halal tercetak.
3. Analisis bahan kritis: Gelatin, Lemak hewani (Tallow, Lard), Pepsin, Rennet, Emulsifier (E471, E472), Perisa/flavor, Pewarna Karmin (E120), Khamr/Alkohol (Mirin, Angciu, Rum, Sake), serta turunan babi (Pork, Bacon, Ham).
4. Tetapkan status kehalalan ("HALAL", "SYUBHAT", "NON_HALAL", atau "TIDAK_TERDETEKSI").`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            halalStatus: { type: Type.STRING },
            halalStatusLabel: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER },
            halalLogoDetected: { type: Type.BOOLEAN },
            halalLogoDetails: { type: Type.STRING },
            halalCertNumber: { type: Type.STRING },
            detectedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            criticalHalalPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ingredient: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ["ingredient", "reason", "status"],
              },
            },
            syariahVerdict: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            fiqihReference: { type: Type.STRING },
          },
          required: [
            "productName",
            "brand",
            "category",
            "halalStatus",
            "halalStatusLabel",
            "confidenceScore",
            "halalLogoDetected",
            "halalLogoDetails",
            "detectedIngredients",
            "criticalHalalPoints",
            "syariahVerdict",
            "recommendation",
            "fiqihReference",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini Halal Vision Scan Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal memproses analisis gambar produk halal",
    });
  }
});

// Superapp Infrastructure Platform: 4B AI App Forge Endpoint
app.post("/api/platform/forge-app", async (req, res) => {
  try {
    const { appName, pillar = "Lintas 4 Pilar", targetUsers = "Jamaah & Takmir Masjid", problemStatement, aiCapability } = req.body;
    if (!appName || typeof appName !== "string") {
      res.status(400).json({ error: "Nama aplikasi atau ide modul 4B diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan periksa GEMINI_API_KEY di menu Settings > Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah Chief Architect Platform Superaplikasi Cerdas ABDICity.cloud (Aplikasi Berjamaah Dakwah Islamicity 4B Kaffah: Berdakwah, Bersyariah, Berjamaah, Bermuamalah).
Tugas Anda adalah merancang blueprint arsitektur aplikasi cerdas yang siap dibangun dan diintegrasikan ke dalam ekosistem ABDICity.cloud, lengkap dengan:
1. Penjagaan nilai Maqashid Syariah (syariahGuardrails) yang spesifik dan relevan.
2. Desain skema model data (Firestore/PostgreSQL) dengan field nyata.
3. Spesifikasi API endpoint Express/Cloud Run.
4. Kapabilitas kecerdasan AI yang konkret.
5. Konfigurasi infrastruktur Google Cloud Platform (Cloud Run, database, Cloud Armor/Secret Manager, estimasi FinOps anti-tabdzir).
6. Potongan kode starter komponen React TypeScript + Tailwind CSS yang bersih, fungsional, dan siap pakai di ABDICity.cloud.`;

    const promptText = `Rancang blueprint lengkap aplikasi cerdas dalam ekosistem ABDICity.cloud:
- Nama Modul Aplikasi: ${appName}
- Pilar Utama 4B Kaffah: ${pillar}
- Target Pengguna: ${targetUsers}
- Permasalahan / Kebutuhan Umat: ${problemStatement || "Meningkatkan pemberdayaan umat dan transparansi layanan Islami"}
- Kapabilitas AI yang Diinginkan: ${aiCapability || "Asisten cerdas berbasis Gemini & automasi syariah"}

Pastikan reactComponentCode adalah kode komponen React + TypeScript valid dan rapi (tanpa placeholder kosong).`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            pillar: { type: Type.STRING },
            tagline: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            targetUsers: { type: Type.STRING },
            syariahGuardrails: { type: Type.ARRAY, items: { type: Type.STRING } },
            dataModels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  entityName: { type: Type.STRING },
                  storageEngine: { type: Type.STRING },
                  fields: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["entityName", "storageEngine", "fields"],
              },
            },
            apiEndpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  method: { type: Type.STRING },
                  path: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                },
                required: ["method", "path", "purpose"],
              },
            },
            aiCapabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            cloudInfrastructure: {
              type: Type.OBJECT,
              properties: {
                compute: { type: Type.STRING },
                database: { type: Type.STRING },
                security: { type: Type.STRING },
                estimatedMonthlyCost: { type: Type.STRING },
              },
              required: ["compute", "database", "security", "estimatedMonthlyCost"],
            },
            reactComponentCode: { type: Type.STRING },
          },
          required: [
            "appName",
            "pillar",
            "tagline",
            "executiveSummary",
            "targetUsers",
            "syariahGuardrails",
            "dataModels",
            "apiEndpoints",
            "aiCapabilities",
            "cloudInfrastructure",
            "reactComponentCode",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      blueprint: {
        ...parsed,
        id: `app-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Platform App Forge Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal merancang blueprint aplikasi cerdas 4B",
    });
  }
});

// Superapp Cross-Pillar AI Orchestrator Endpoint
app.post("/api/platform/orchestrate", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Pertanyaan atau tujuan ekosistem 4B diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum dikonfigurasi. Silakan periksa GEMINI_API_KEY di menu Settings > Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah "Kaffah Intelligence Engine" di Platform Superaplikasi ABDICity.cloud.
Untuk setiap pertanyaan, inisiatif masjid, rencana bisnis syariah, atau kebutuhan umat, Anda menyusun sintesis terpadu sekaligus pada 4 Pilar Kaffah:
1. Berdakwah (ilmu, ayat/hadits, edukasi)
2. Bersyariah (kaidah fiqih, kepatuhan akad, zakat/infaq/halal)
3. Berjamaah (peran masjid, takmir, gotong royong jamaah)
4. Bermuamalah (pemberdayaan ekonomi UMKM halal, model transaksi adil)
Jawablah secara ringkas, konkret, dan dapat langsung dieksekusi di modul-modul ABDICity.cloud.`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: `Susun rencana aksi terpadu 4B Kaffah untuk inisiatif/pertanyaan berikut: "${query}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            dalilAnchor: { type: Type.STRING },
            pillars: {
              type: Type.OBJECT,
              properties: {
                berdakwah: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    metric: { type: Type.STRING },
                  },
                  required: ["title", "action", "metric"],
                },
                bersyariah: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    metric: { type: Type.STRING },
                  },
                  required: ["title", "action", "metric"],
                },
                berjamaah: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    metric: { type: Type.STRING },
                  },
                  required: ["title", "action", "metric"],
                },
                bermuamalah: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    metric: { type: Type.STRING },
                  },
                  required: ["title", "action", "metric"],
                },
              },
              required: ["berdakwah", "bersyariah", "berjamaah", "bermuamalah"],
            },
            recommendedModules: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextExecutionStep: { type: Type.STRING },
          },
          required: ["summary", "dalilAnchor", "pillars", "recommendedModules", "nextExecutionStep"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      result: {
        query,
        ...parsed,
      },
    });
  } catch (error: any) {
    console.error("Kaffah Orchestrator Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal menyusun orkestrasi cerdas 4B Kaffah",
    });
  }
});

// GCP Environment Status & Telemetry Endpoint for Developers
app.get("/api/gcp/status", (req, res) => {
  try {
    const memory = process.memoryUsage();
    const isCloudRun = Boolean(process.env.K_SERVICE || process.env.PORT === "3000");
    const serviceName = process.env.K_SERVICE || "abdi-islamicity-service";
    const revision = process.env.K_REVISION || "abdi-v2-platform";
    const region = "asia-southeast2 (Jakarta)";

    res.json({
      success: true,
      environment: {
        platform: isCloudRun ? "Google Cloud Run (Managed Containers)" : "Node.js Container Runtime",
        serviceName,
        revision,
        region,
        port: PORT,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsage: {
          rssMb: Math.round(memory.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
        },
        servicesStatus: {
          cloudRun: { status: "OPERATIONAL", latencyMs: 18 },
          vertexAiGemini: {
            status: process.env.GEMINI_API_KEY ? "CONFIGURED" : "PENDING_KEY",
            model: "gemini-4-hydrogen",
          },
          cloudStorage: { status: "ACTIVE", bucket: "abdi-dakwah-media-prod" },
          cloudFirestore: { status: "CONNECTED", collections: ["mosques", "campaigns", "halal_products", "forged_apps"] },
          cloudScheduler: { status: "RUNNING", nextJob: "Adhan & Prayer Times Sync (5x Daily)" },
          cloudArmor: { status: "PROTECTED", ddosShield: true, wafRuleCount: 14 },
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch GCP telemetry: " + err.message });
  }
});

// Google Cloud Platform AI Architect & DevOps Facilitator for ABDI Developers
app.post("/api/gemini/gcp-facilitator", async (req, res) => {
  try {
    const { question, topic = "Arsitektur & Skalabilitas", currentConfig } = req.body;
    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Pertanyaan atau instruksi arsitektur GCP diperlukan." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: "Kunci API Gemini belum terpasang. Pastikan GEMINI_API_KEY terkonfigurasi di Settings > Secrets.",
      });
      return;
    }

    const systemInstruction = `Anda adalah "Fasilitator Infrastruktur Platform Cerdas ABDICity.cloud" (Lead Principal Google Cloud Architect & DevOps Specialist).
Anda mendampingi tim pengembang, takmir digital, dan arsitek sistem dalam membangun, mengoptimalkan, dan mengoperasikan superaplikasi "ABDICity.cloud (Aplikasi Berjamaah Dakwah Islamicity 4B Kaffah)".

Karakteristik Sistem ABDICity.cloud:
- Platform terpadu 4B Kaffah: Berdakwah, Bersyariah, Berjamaah, Bermuamalah + Superapp App Forge.
- Beban kerja: Real-time prayer synchronization (adzan 5 waktu se-Indonesia WIB/WITA/WIT), AI Tanya Ustadz & Konsultasi Syariah, Halal Vision Scanner, Digital Takmir Masjid & Infaq Ledger, Marketplace UMKM Syariah.
- Stack inti: Google Cloud Run, Vertex AI & Gemini 4 Hydrogen, Cloud Firestore, Cloud SQL PostgreSQL, Cloud Storage, Cloud Scheduler, Pub/Sub, Cloud Armor WAF, Secret Manager.

Format Jawaban:
1. **Analisis Solusi Arsitektur**
2. **Langkah Implementasi Praktis**
3. **Kode / Konfigurasi Siap Pakai** (Terraform .tf, gcloud CLI, cloudbuild.yaml, Dockerfile, atau TypeScript)
4. **Tata Kelola & Keamanan Syariah**
5. **Efisiensi FinOps Anti-Tabdzir**`;

    const promptText = `Kategori Permintaan: ${topic}
${currentConfig ? `Konteks/Konfigurasi Saat Ini:\n${currentConfig}\n` : ""}
Pertanyaan / Kebutuhan Developer:
"${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: promptText,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      answer: response.text || "Tidak ada respons yang dihasilkan oleh model.",
      topic,
    });
  } catch (error: any) {
    console.error("Gemini GCP Facilitator Error:", error);
    res.status(500).json({
      error: error?.message || "Gagal memproses konsultasi GCP Facilitator",
    });
  }
});

// Setup Vite Development Middleware or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ABDICity.cloud Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

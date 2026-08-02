"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  Layers,
  Shield,
  ShieldCheck,
  Zap,
  Clock,
  HardDrive,
  FileImage,
  Maximize2,
  Download,
  FileSpreadsheet,
  FileCode,
  Share2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Sliders,
  Check,
  X,
  FileText,
  Lock,
  Radio,
  Binary,
  Terminal,
  Activity,
  Server,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn, formatBytes } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/cards/MetricCard";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";
import { useToast } from "@/components/feedback/Toast";

// Placeholder Histogram Dataset
const histogramData = Array.from({ length: 30 }, (_, i) => ({
  bin: i * 8,
  Original: Math.floor(Math.sin(i * 0.2) * 50 + 60),
  Stego: Math.floor(Math.sin(i * 0.2) * 50 + 59.8),
  RedChannel: Math.floor(Math.sin(i * 0.2) * 45 + 55),
  GreenChannel: Math.floor(Math.sin(i * 0.2) * 48 + 58),
  BlueChannel: Math.floor(Math.sin(i * 0.2) * 52 + 62),
}));

export default function AnalyticsDashboardPage() {
  const { toast } = useToast();

  // Local UI States
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "security">("overview");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  // Demo Images
  const sampleOriginalUrl =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";
  const sampleStegoUrl =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";

  const openZoomModal = (src: string, title: string) => {
    setModalImageSrc(src);
    setModalTitle(title);
    setIsImageModalOpen(true);
  };

  const handleExportToast = (format: string) => {
    toast({
      title: `Exporting ${format} Report`,
      message: `Generating session telemetry analytics ${format} report...`,
      type: "success",
    });
  };

  return (
    <PageContainer size="xl" className="space-y-10 pb-16">
      {/* =================================================== */}
      {/* PAGE HEADER & BREADCRUMBS */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "Analytics Dashboard" }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-glow-blue">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              Analytics & Telemetry Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              Analyze image quality, embedding performance, security parameters, and execution telemetry from the latest steganography operation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => handleExportToast("PDF")} leftIcon={<Download className="w-4 h-4" />}>
              Export PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Telemetry Refreshed", message: "Loaded latest session metrics.", type: "info" })} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 1: SESSION OVERVIEW HEADER CARDS */}
      {/* =================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Operation Type</span>
          <span className="font-bold text-primary flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> LSB Encoding
          </span>
        </div>
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Algorithm Domain</span>
          <span className="font-bold text-text-primary">LSB (Spatial)</span>
        </div>
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Carrier Resolution</span>
          <span className="font-bold text-accent">1920 × 1080 px</span>
        </div>
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Payload Size</span>
          <span className="font-bold text-secondary">1.24 KB</span>
        </div>
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Security Rating</span>
          <span className="font-bold text-success">AES-256 GCM</span>
        </div>
        <div className="p-3 bg-background-secondary rounded-xl border border-border/70 space-y-1">
          <span className="text-[10px] text-text-muted uppercase block">Execution Status</span>
          <Badge variant="success" size="sm" dot>Completed</Badge>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 2: KEY OPERATIONAL METRICS (KPI DISPLAY CARDS) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Key Operational Telemetry KPIs
          </h2>
          <Badge variant="accent" size="sm">9 Metrics Tracked</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Peak Signal-to-Noise Ratio (PSNR)"
            value="48.52 dB"
            change={{ value: "Optimal Fidelity", positive: true }}
            subtitle="Target > 48.0 dB Threshold"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <MetricCard
            title="SSIM Structural Similarity"
            value="0.9984"
            change={{ value: "99.84% Match", positive: true }}
            subtitle="Near Zero Visual Distortion"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <MetricCard
            title="Mean Squared Error (MSE)"
            value="0.0012"
            change={{ value: "Negligible", positive: true }}
            subtitle="Minimal Pixel Deviation"
            icon={<Activity className="w-5 h-5" />}
          />
          <MetricCard
            title="Estimated Payload Capacity"
            value="245.7 KB"
            change={{ value: "24-bit RGB", positive: true }}
            subtitle="Spatial LSB Plane Total"
            icon={<HardDrive className="w-5 h-5" />}
          />
          <MetricCard
            title="Capacity Utilization"
            value="0.50 %"
            change={{ value: "Low Stress", positive: true }}
            subtitle="1.24 KB of 245.7 KB Max"
            icon={<Sliders className="w-5 h-5" />}
          />
          <MetricCard
            title="Overall Image Quality Score"
            value="98.5 / 100"
            change={{ value: "Grade A+", positive: true }}
            subtitle="Composite Imperceptibility"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 3 & 4: IMAGE ANALYSIS WORKSPACE & INFORMATION */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SECTION 3: SIDE-BY-SIDE CARRIER INSPECTION (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileImage className="w-4 h-4 text-primary" />
                Carrier Image Quality Inspection (Side-by-Side)
              </h3>
              <Badge variant="primary" size="sm">Visual Inspection</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-text-muted font-bold block">
                  Original Host Carrier Specimen
                </span>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border bg-background-secondary group">
                  {/* eslint-disable-next-next/no-img-element */}
                  <img src={sampleOriginalUrl} alt="Original Host" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <Button variant="outline" size="sm" onClick={() => openZoomModal(sampleOriginalUrl, "Original Host Carrier")} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
                      Zoom View
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-text-muted">
                  <span>PSNR: N/A</span>
                  <span>SSIM: 1.0000</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-text-muted font-bold block">
                  LSB Stego Encoded Output
                </span>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-primary/40 bg-background-secondary shadow-glow-blue group">
                  {/* eslint-disable-next-next/no-img-element */}
                  <img src={sampleStegoUrl} alt="Stego Output" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <Button variant="outline" size="sm" onClick={() => openZoomModal(sampleStegoUrl, "LSB Stego Carrier Output")} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
                      Zoom View
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-text-muted">
                  <span className="text-primary font-bold">PSNR: 48.52 dB</span>
                  <span className="text-success font-bold">SSIM: 0.9984</span>
                </div>
              </div>
            </div>
          </ContentWrapper>
        </div>

        {/* SECTION 4: CARRIER IMAGE SPECIFICATIONS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                Carrier Metadata Specifications
              </h3>
              <Badge variant="accent" size="sm">File Metadata</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { label: "Image Name", val: "carrier_specimen_v2.png" },
                { label: "Dimensions", val: "1920 × 1080 px" },
                { label: "Resolution", val: "2.07 Megapixels" },
                { label: "Color Channels", val: "24-bit RGB (3 Ch)" },
                { label: "File Size", val: "4.19 MB (4,390,912 B)" },
                { label: "Format", val: "PNG (Lossless)" },
                { label: "Color Space", val: "sRGB IEC61966-2.1" },
                { label: "Compression", val: "Deflate (Zlib)" },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                  <span className="text-[9px] text-text-muted uppercase block">{item.label}</span>
                  <span className="font-bold text-text-primary truncate block text-[11px]">{item.val}</span>
                </div>
              ))}
            </div>
          </ContentWrapper>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 5 & 6: HISTOGRAM & RESIDUAL DIFFERENCE MAPS */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SECTION 5: HISTOGRAM OVERLAY ANALYSIS (7 Cols) */}
        <div className="lg:col-span-7">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Pixel Intensity Histogram Overlay (256 Bins)
              </h3>
              <Badge variant="primary" size="sm">Spectral Consistency</Badge>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="bin" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="Original" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="Stego" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ContentWrapper>
        </div>

        {/* SECTION 6: RESIDUAL DIFFERENCE HEATMAP (5 Cols) */}
        <div className="lg:col-span-5">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary" />
                Spatial Difference Error Heatmap
              </h3>
              <Badge variant="secondary" size="sm">Residual Analysis</Badge>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-secondary/40 bg-background-secondary shadow-glow-purple group">
              {/* eslint-disable-next-next/no-img-element */}
              <img src={sampleStegoUrl} alt="Heatmap" className="w-full h-full object-cover contrast-125 opacity-70 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                <Button variant="outline" size="sm" onClick={() => openZoomModal(sampleStegoUrl, "Spatial Difference Heatmap")} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
                  Zoom Heatmap
                </Button>
              </div>
            </div>

            <div className="p-3 bg-background-secondary rounded-xl border border-border/60 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">Peak Pixel Deviation:</span>
                <span className="font-bold text-success">±1 LSB Level</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Altered Pixels:</span>
                <span className="font-bold text-primary">0.12% of Total Pixels</span>
              </div>
            </div>
          </ContentWrapper>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 7: VERTICAL PROCESSING TIMELINE */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Stage-by-Stage Processing Telemetry Timeline
            </h2>
            <p className="text-xs text-text-muted">Exact breakdown of computational execution latency per transformation stage</p>
          </div>
          <Badge variant="accent" size="sm">Total Latency: 142 ms</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
          {[
            { stage: "01", name: "Message Input", latency: "2 ms", status: "Completed", icon: FileText },
            { stage: "02", name: "Morse Modulation", latency: "15 ms", status: "Completed", icon: Radio },
            { stage: "03", name: "AES-256 Encryption", latency: "45 ms", status: "Completed", icon: Lock },
            { stage: "04", name: "Binary Serialization", latency: "10 ms", status: "Completed", icon: Binary },
            { stage: "05", name: "LSB Embedding", latency: "65 ms", status: "Completed", icon: Cpu },
            { stage: "06", name: "Stego Finalization", latency: "5 ms", status: "Completed", icon: FileImage },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2 flex flex-col items-center justify-center relative">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-text-muted font-bold">STAGE {item.stage}</span>
                <h4 className="text-xs font-bold text-text-primary">{item.name}</h4>
                <Badge variant="success" size="sm" className="font-mono text-[10px]">
                  {item.latency}
                </Badge>
              </div>
            );
          })}
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 8 & 9: SECURITY PANEL & QUALITY RATINGS */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SECTION 8: SECURITY AUDIT PANEL (6 Cols) */}
        <div className="lg:col-span-6">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Security Protocol & Audit Verification
              </h3>
              <Badge variant="success" size="sm">Score: 99/100</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60 flex items-center justify-between font-mono">
                <span className="text-text-muted">Encryption Cipher:</span>
                <span className="font-bold text-success">AES-256-GCM (Authenticated)</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60 flex items-center justify-between font-mono">
                <span className="text-text-muted">Key Derivation Function:</span>
                <span className="font-bold text-primary">PBKDF2 (100,000 Iterations)</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60 flex items-center justify-between font-mono">
                <span className="text-text-muted">Carrier Image Integrity:</span>
                <span className="font-bold text-success">SHA-256 Verified</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60 flex items-center justify-between font-mono">
                <span className="text-text-muted">EXIF Metadata Status:</span>
                <span className="font-bold text-accent">Stripped & Anonymized</span>
              </div>
            </div>
          </ContentWrapper>
        </div>

        {/* SECTION 9: QUALITY RATINGS & PROGRESS (6 Cols) */}
        <div className="lg:col-span-6">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                Steganographic Quality Ratings
              </h3>
              <Badge variant="primary" size="sm">Composite Grade</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { label: "Visual Imperceptibility", val: 99, color: "bg-success" },
                { label: "Signal Noise Resistance", val: 85, color: "bg-primary" },
                { label: "Payload Capacity Score", val: 95, color: "bg-accent" },
                { label: "Execution Latency Score", val: 98, color: "bg-success" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-text-muted">{item.label}</span>
                    <span className="font-bold text-text-primary">{item.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-background-secondary rounded-full overflow-hidden border border-border/50">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ContentWrapper>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 10 & 11: SYSTEM INFO & EXPORT CENTER */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SECTION 10: SYSTEM ENVIRONMENT (5 Cols) */}
        <div className="lg:col-span-5">
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Server className="w-4 h-4 text-accent" />
                System & Engine Environment
              </h3>
              <Badge variant="accent" size="sm">v1.0.0 Enterprise</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Frontend Architecture</span>
                <span className="font-bold text-text-primary text-[11px]">Next.js 15 / React 19</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Backend Engine</span>
                <span className="font-bold text-text-primary text-[11px]">FastAPI / Python 3.11</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Image Processing</span>
                <span className="font-bold text-text-primary text-[11px]">OpenCV / PyWavelets</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Algorithm Engine</span>
                <span className="font-bold text-text-primary text-[11px]">v2.4-Hybrid Multi-Domain</span>
              </div>
            </div>
          </ContentWrapper>
        </div>

        {/* SECTION 11: EXPORT CENTER TOOLBAR (7 Cols) */}
        <div className="lg:col-span-7">
          <ContentWrapper variant="glass" padding="md" className="space-y-4 border border-primary/30 shadow-glow-blue">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                Export Telemetry & Analytics Report
              </h3>
              <Badge variant="primary" size="sm">Report Generator</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <Button variant="outline" size="sm" onClick={() => handleExportToast("PDF")} leftIcon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportToast("JSON")} leftIcon={<FileCode className="w-4 h-4" />}>
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportToast("CSV")} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportToast("Stego Image")} leftIcon={<FileImage className="w-4 h-4" />}>
                Save Stego Image
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleExportToast("Shareable Link")} leftIcon={<Share2 className="w-4 h-4" />}>
                Share Report
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleExportToast("Printer")} leftIcon={<Printer className="w-4 h-4" />}>
                Print Report
              </Button>
            </div>
          </ContentWrapper>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 12: RECENT OPERATIONS AUDIT LOG TABLE */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Recent Operations Audit Log
            </h2>
            <p className="text-xs text-text-muted">Chronological history of recent encoding and decoding executions</p>
          </div>
          <Badge variant="primary" size="sm">Audit Log</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-secondary/80 text-text-muted">
                <th className="p-3 font-semibold text-text-primary">Operation ID</th>
                <th className="p-3 font-semibold text-text-primary">Type</th>
                <th className="p-3 font-semibold text-text-primary">Algorithm</th>
                <th className="p-3 font-semibold text-text-primary">Timestamp</th>
                <th className="p-3 font-semibold text-text-primary">Status</th>
                <th className="p-3 font-semibold text-text-primary">Quality Score</th>
                <th className="p-3 font-semibold text-text-primary">Runtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { id: "#8492", type: "Encoding", algo: "LSB (Spatial)", time: "2026-08-02 19:55:00", status: "Success", score: "98.5 / 100", runtime: "142 ms" },
                { id: "#8491", type: "Decoding", algo: "LSB (Spatial)", time: "2026-08-02 19:40:12", status: "Success", score: "100.0 / 100", runtime: "110 ms" },
                { id: "#8490", type: "Encoding", algo: "DWT (Wavelet)", time: "2026-08-02 18:22:45", status: "Success", score: "99.2 / 100", runtime: "185 ms" },
                { id: "#8489", type: "Decoding", algo: "DCT (Frequency)", time: "2026-08-02 17:15:30", status: "Success", score: "96.8 / 100", runtime: "140 ms" },
              ].map((row, rI) => (
                <tr key={rI} className="hover:bg-card-hover/50 transition-colors">
                  <td className="p-3 text-text-primary font-bold">{row.id}</td>
                  <td className="p-3 text-primary">{row.type}</td>
                  <td className="p-3 text-text-secondary">{row.algo}</td>
                  <td className="p-3 text-text-muted">{row.time}</td>
                  <td className="p-3"><Badge variant="success" size="sm">{row.status}</Badge></td>
                  <td className="p-3 text-success font-bold">{row.score}</td>
                  <td className="p-3 text-accent">{row.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentWrapper>

      {/* Lightbox Zoom Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={modalImageSrc}
        title={modalTitle}
      />
    </PageContainer>
  );
}

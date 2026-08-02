"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart2,
  Cpu,
  Layers,
  Shield,
  Zap,
  Sliders,
  Download,
  FileSpreadsheet,
  FileCode,
  Share2,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  TrendingUp,
  HardDrive,
  Eye,
  RotateCcw,
  Check,
  X,
  FileImage,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { MetricCard } from "@/components/cards/MetricCard";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";
import { useToast } from "@/components/feedback/Toast";

// Placeholder Datasets for Recharts Visualizations
const psnrSsimData = [
  { name: "LSB Spatial", psnr: 48.52, ssim: 0.9984, fill: "#3B82F6" },
  { name: "DCT Frequency", psnr: 44.18, ssim: 0.9892, fill: "#8B5CF6" },
  { name: "DWT Wavelet", psnr: 52.1, ssim: 0.9995, fill: "#10B981" },
];

const radarComparisonData = [
  { metric: "Payload Capacity", LSB: 95, DCT: 45, DWT: 35 },
  { metric: "Visual Quality (PSNR)", LSB: 85, DCT: 75, DWT: 98 },
  { metric: "Noise Robustness", LSB: 20, DCT: 80, DWT: 95 },
  { metric: "Compression Survival", LSB: 15, DCT: 90, DWT: 85 },
  { metric: "Execution Speed", LSB: 98, DCT: 65, DWT: 50 },
  { metric: "Steg-Analysis Security", LSB: 40, DCT: 75, DWT: 95 },
];

const psnrVsPayloadData = [
  { payloadKB: "10 KB", LSB: 58.2, DCT: 52.1, DWT: 61.4 },
  { payloadKB: "50 KB", LSB: 52.4, DCT: 46.8, DWT: 55.8 },
  { payloadKB: "100 KB", LSB: 48.5, DCT: 42.1, DWT: 51.2 },
  { payloadKB: "150 KB", LSB: 44.1, DCT: 38.5, DWT: 47.9 },
  { payloadKB: "200 KB", LSB: 41.2, DCT: 34.0, DWT: 43.5 },
];

const executionSpeedData = [
  { name: "LSB Spatial", encodeTime: 18, decodeTime: 12 },
  { name: "DCT Frequency", encodeTime: 142, decodeTime: 110 },
  { name: "DWT Wavelet", encodeTime: 185, decodeTime: 140 },
];

const histogramData = Array.from({ length: 30 }, (_, i) => ({
  bin: i * 8,
  Original: Math.floor(Math.sin(i * 0.2) * 50 + 60),
  LSB: Math.floor(Math.sin(i * 0.2) * 50 + 59.8),
  DCT: Math.floor(Math.sin(i * 0.2) * 48 + 58),
  DWT: Math.floor(Math.sin(i * 0.2) * 50 + 60.1),
}));

export default function ComparePage() {
  const { toast } = useToast();

  // Local UI States
  const [selectedAlgoFilter, setSelectedAlgoFilter] = useState<"all" | "lsb" | "dct" | "dwt">("all");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // Decision Matrix Priorities (UI State)
  const [priorities, setPriorities] = useState({
    capacity: false,
    quality: true,
    robustness: true,
    speed: false,
    compression: false,
  });

  // Calculate Decision Matrix Recommended Result
  const getDecisionRecommendation = () => {
    if (priorities.capacity && !priorities.robustness) {
      return {
        algo: "LSB (Least Significant Bit)",
        domain: "Spatial Domain",
        reason: "Chosen for maximum payload capacity (>25%) and zero computational overhead.",
        color: "text-primary border-primary bg-primary/10",
      };
    }
    if (priorities.compression) {
      return {
        algo: "DCT (Discrete Cosine Transform)",
        domain: "Frequency Domain",
        reason: "Chosen for high resistance against lossy JPEG compression and web sharing.",
        color: "text-secondary border-secondary bg-secondary/10",
      };
    }
    return {
      algo: "DWT (Discrete Wavelet Transform)",
      domain: "Wavelet Domain",
      reason: "Chosen for supreme visual quality (PSNR > 50dB), signal noise robustness, and high security.",
      color: "text-success border-success bg-success/10",
    };
  };

  const decisionResult = getDecisionRecommendation();

  // Demo Sample Images for Visual Quality
  const demoImages = {
    original: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
    lsb: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
    dct: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
    dwt: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
  };

  const openZoomModal = (src: string, title: string) => {
    setPreviewImageSrc(src);
    setPreviewTitle(title);
    setIsImageModalOpen(true);
  };

  const handleExportToast = (format: string) => {
    toast({
      title: `Exporting ${format} Report`,
      message: `Generating algorithm benchmark comparative ${format} dataset...`,
      type: "success",
    });
  };

  return (
    <PageContainer size="xl" className="space-y-10 pb-16">
      {/* =================================================== */}
      {/* PAGE HEADER & BREADCRUMBS */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "Compare Algorithms" }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent shadow-glow-accent">
                <BarChart2 className="w-6 h-6" />
              </div>
              Compare Algorithms & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              Analyze and compare the mathematical performance, PSNR image quality, noise robustness, and capacity of LSB, DCT, and DWT steganographic techniques.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => handleExportToast("PDF")} leftIcon={<Download className="w-4 h-4" />}>
              Export PDF
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleExportToast("CSV")} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 1: ALGORITHM OVERVIEW (3 CARDS) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Steganographic Domain Overview
          </h2>
          <Badge variant="primary" size="sm">3 Core Embedding Domains</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: "lsb",
              name: "LSB (Least Significant Bit)",
              domain: "Spatial Domain",
              badge: "Max Capacity",
              badgeVariant: "primary" as const,
              description: "Direct spatial substitution of RGB 8th-bit planes in carrier pixels.",
              primaryUse: "Uncompressed PNG/BMP files requiring maximum payload size.",
              advantages: ["Highest capacity (>25%)", "Zero delay (<20ms)", "100% spatial fidelity"],
              limitations: ["Sensitive to JPEG lossy compression", "Vulnerable to spatial steg-analysis"],
              icon: Layers,
            },
            {
              id: "dct",
              name: "DCT (Discrete Cosine Transform)",
              domain: "Frequency Domain",
              badge: "JPEG Robust",
              badgeVariant: "secondary" as const,
              description: "Modifies mid-frequency cosine coefficients in 8x8 spatial pixel blocks.",
              primaryUse: "JPEG images intended for public web and social sharing.",
              advantages: ["Resists JPEG compression", "Mid-frequency stability", "Cropping resilience"],
              limitations: ["Medium payload capacity (~10%)", "Requires block transformation"],
              icon: Cpu,
            },
            {
              id: "dwt",
              name: "DWT (Discrete Wavelet Transform)",
              domain: "Wavelet Domain",
              badge: "Max Security",
              badgeVariant: "success" as const,
              description: "Multi-resolution sub-band decomposition into LL, LH, HL, HH wavelets.",
              primaryUse: "High-security military, legal, and medical imagery.",
              advantages: ["Superior PSNR ratio (>50dB)", "High noise resistance", "Multi-resolution stealth"],
              limitations: ["Higher mathematical complexity", "Lower capacity than LSB"],
              icon: Shield,
            },
          ].map((algo) => {
            const Icon = algo.icon;
            return (
              <motion.div
                key={algo.id}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-2xl border border-border space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-background-secondary border border-border text-text-primary">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={algo.badgeVariant} size="sm">{algo.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text-primary">{algo.name}</h3>
                    <span className="text-[11px] font-mono text-text-muted uppercase">{algo.domain}</span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed">{algo.description}</p>

                  <div className="p-3 bg-background-secondary/80 rounded-xl border border-border/60 text-xs">
                    <span className="text-text-muted block text-[10px] uppercase font-mono">Primary Use Case</span>
                    <strong className="text-text-primary block text-[11px] font-medium">{algo.primaryUse}</strong>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-success uppercase block">Key Advantages:</span>
                    <ul className="space-y-0.5 text-text-secondary text-[11px]">
                      {algo.advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-success shrink-0" /> {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-danger uppercase block">Key Limitations:</span>
                    <ul className="space-y-0.5 text-text-muted text-[11px]">
                      {algo.limitations.map((lim, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <X className="w-3 h-3 text-danger shrink-0" /> {lim}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 3: METRICS DASHBOARD (KPI CARDS) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Benchmark Operational Performance KPIs
          </h2>
          <Badge variant="accent" size="sm">Baseline Metrics</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Target Peak SNR (PSNR)"
            value="52.10 dB"
            change={{ value: "+3.58 dB vs LSB", positive: true }}
            subtitle="DWT Wavelet Highest"
            icon={<Sparkles className="w-5 h-5" />}
          />
          <MetricCard
            title="SSIM Index Fidelity"
            value="0.9995"
            change={{ value: "Near 1.00", positive: true }}
            subtitle="Structural Match"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <MetricCard
            title="Max Payload Capacity"
            value="25.0 %"
            change={{ value: "LSB Peak", positive: true }}
            subtitle="Spatial Pixel Ratio"
            icon={<HardDrive className="w-5 h-5" />}
          />
          <MetricCard
            title="Encoding Latency"
            value="18 ms"
            change={{ value: "-124ms vs DCT", positive: true }}
            subtitle="Spatial LSB Instant"
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 4: INTERACTIVE CHARTS (RECHARTS ANALYTICS) */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: BAR CHART (PSNR vs SSIM) */}
        <ContentWrapper variant="glass" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Peak Signal-to-Noise Ratio (PSNR dB)
            </h3>
            <Badge variant="primary" size="sm">Higher is Better</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={psnrSsimData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[30, 60]} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }}
                />
                <Bar dataKey="psnr" fill="#3B82F6" radius={[6, 6, 0, 0]} name="PSNR (dB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ContentWrapper>

        {/* CHART 2: RADAR CHART (MULTI-DIMENSIONAL COMPARISON) */}
        <ContentWrapper variant="glass" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <PieChart className="w-4 h-4 text-accent" />
              Multi-Dimensional Stego Tradeoffs Radar
            </h3>
            <Badge variant="accent" size="sm">6 Parameters</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarComparisonData}>
                <PolarGrid stroke="#334155" opacity={0.5} />
                <PolarAngleAxis dataKey="metric" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="LSB" dataKey="LSB" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                <Radar name="DCT" dataKey="DCT" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                <Radar name="DWT" dataKey="DWT" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ContentWrapper>

        {/* CHART 3: LINE CHART (PSNR VS PAYLOAD CURVE) */}
        <ContentWrapper variant="glass" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              PSNR Degradation vs Payload Size
            </h3>
            <Badge variant="secondary" size="sm">Tradeoff Curve</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={psnrVsPayloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="payloadKB" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[30, 65]} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="LSB" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="DCT" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="DWT" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ContentWrapper>

        {/* CHART 4: HORIZONTAL BAR CHART (EXECUTION SPEED MS) */}
        <ContentWrapper variant="glass" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-success" />
              Computational Latency Comparison (ms)
            </h3>
            <Badge variant="success" size="sm">Lower is Better</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={executionSpeedData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={90} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="encodeTime" name="Encoding Time (ms)" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="decodeTime" name="Decoding Time (ms)" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ContentWrapper>
      </div>

      {/* =================================================== */}
      {/* SECTION 2: COMPREHENSIVE COMPARISON TABLE */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Detailed Algorithm Specification Matrix
            </h2>
            <p className="text-xs text-text-muted">Direct side-by-side comparison across 11 key operational metrics</p>
          </div>
          <Badge variant="primary" size="sm">11 Parameters</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-secondary/80 text-text-muted">
                <th className="p-3 font-semibold text-text-primary">Operational Property</th>
                <th className="p-3 font-bold text-primary">LSB (Spatial)</th>
                <th className="p-3 font-bold text-secondary">DCT (Frequency)</th>
                <th className="p-3 font-bold text-success">DWT (Wavelet)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { prop: "Embedding Domain", lsb: "Spatial RGB Pixels", dct: "8x8 DCT Frequency Blocks", dwt: "Multi-Resolution Sub-bands" },
                { prop: "Peak SNR (PSNR)", lsb: "48.52 dB (High)", dct: "44.18 dB (Moderate)", dwt: "52.10 dB (Supreme)" },
                { prop: "SSIM Index", lsb: "0.9984", dct: "0.9892", dwt: "0.9995" },
                { prop: "Payload Capacity", lsb: "High (>25% Payload)", dct: "Medium (~10% Payload)", dwt: "Moderate (~8% Payload)" },
                { prop: "JPEG Compression Resistance", lsb: "Low (Corrupted on JPEG)", dct: "High (Survives Lossy)", dwt: "High (Survives Lossy)" },
                { prop: "Signal Noise Resistance", lsb: "Low", dct: "Moderate", dwt: "Maximum" },
                { prop: "Encoding Speed", lsb: "Ultra Fast (18 ms)", dct: "Moderate (142 ms)", dwt: "Moderate (185 ms)" },
                { prop: "Decoding Speed", lsb: "Ultra Fast (12 ms)", dct: "Moderate (110 ms)", dwt: "Moderate (140 ms)" },
                { prop: "Algorithm Complexity", lsb: "O(N) Linear Spatial", dct: "O(N log N) Matrix Block", dwt: "O(N) Wavelet Decomposition" },
                { prop: "Steg-Analysis Security", lsb: "Low (Detectable)", dct: "Moderate", dwt: "High Stealth" },
                { prop: "Optimal Carrier Format", lsb: "PNG / BMP (Lossless)", dct: "JPEG / Web Images", dwt: "Medical / Military Images" },
              ].map((row, rI) => (
                <tr key={rI} className="hover:bg-card-hover/50 transition-colors">
                  <td className="p-3 font-sans font-bold text-text-primary">{row.prop}</td>
                  <td className="p-3 text-text-secondary">{row.lsb}</td>
                  <td className="p-3 text-text-secondary">{row.dct}</td>
                  <td className="p-3 text-text-secondary">{row.dwt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 5 & 7: VISUAL IMAGE QUALITY & DIFFERENCE MAPS */}
      {/* =================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <FileImage className="w-5 h-5 text-secondary" />
              Visual Output & Residual Difference Maps
            </h2>
            <p className="text-xs text-text-muted">Compare encoded carrier outputs and spatial residual error signals</p>
          </div>
          <Badge variant="secondary" size="sm">Image Inspection</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Original Carrier", psnr: "N/A (Reference)", ssim: "1.0000", tag: "Baseline Specimen", src: demoImages.original },
            { title: "LSB Encoded", psnr: "48.52 dB", ssim: "0.9984", tag: "Spatial LSB Plane", src: demoImages.lsb },
            { title: "DCT Encoded", psnr: "44.18 dB", ssim: "0.9892", tag: "Frequency Blocks", src: demoImages.dct },
            { title: "DWT Encoded", psnr: "52.10 dB", ssim: "0.9995", tag: "Wavelet Sub-bands", src: demoImages.dwt },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl border border-border space-y-3 shadow-md">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-background-secondary group">
                {/* eslint-disable-next-next/no-img-element */}
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <Button variant="outline" size="sm" onClick={() => openZoomModal(item.src, item.title)} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
                    Zoom
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                <span className="text-[10px] font-mono text-text-muted">{item.tag}</span>
              </div>

              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">PSNR:</span>
                  <span className="font-bold text-primary">{item.psnr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">SSIM:</span>
                  <span className="font-bold text-success">{item.ssim}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 6: HISTOGRAM COMPARISON */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="md" className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-accent" />
            Pixel Intensity Histogram Distribution (256 Bins)
          </h3>
          <Badge variant="accent" size="sm">Spectral Consistency</Badge>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="bin" stroke="#94A3B8" fontSize={11} label={{ value: "Pixel Value (0-255)", position: "insideBottom", offset: -2, fontSize: 10 }} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <RechartsTooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="Original" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.15} />
              <Area type="monotone" dataKey="LSB" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
              <Area type="monotone" dataKey="DCT" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
              <Area type="monotone" dataKey="DWT" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 9: INTERACTIVE DECISION MATRIX */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6 border border-primary/30 shadow-glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Interactive Algorithm Decision Matrix
            </h2>
            <p className="text-xs text-text-muted">Select project priorities to compute the optimal steganographic technique</p>
          </div>
          <Badge variant="primary" size="sm">Decision Tool</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
              Step 1: Select Requirements & Constraints
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Checkbox
                checked={priorities.capacity}
                onChange={(e) => setPriorities((prev) => ({ ...prev, capacity: e.target.checked }))}
                label="Maximum Capacity (>200 KB)"
              />
              <Checkbox
                checked={priorities.quality}
                onChange={(e) => setPriorities((prev) => ({ ...prev, quality: e.target.checked }))}
                label="Supreme Image Quality (PSNR > 50dB)"
              />
              <Checkbox
                checked={priorities.robustness}
                onChange={(e) => setPriorities((prev) => ({ ...prev, robustness: e.target.checked }))}
                label="Signal Noise Robustness"
              />
              <Checkbox
                checked={priorities.compression}
                onChange={(e) => setPriorities((prev) => ({ ...prev, compression: e.target.checked }))}
                label="Survive JPEG Lossy Compression"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className={cn("p-5 rounded-xl border space-y-2 relative overflow-hidden", decisionResult.color)}>
              <span className="text-[10px] font-mono uppercase font-bold text-text-muted">Computed Recommendation</span>
              <h3 className="text-base font-bold text-text-primary">{decisionResult.algo}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{decisionResult.reason}</p>
            </div>
          </div>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 8 & 10: HOW TO CHOOSE AN ALGORITHM */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              Algorithm Selection Decision Flow
            </h2>
            <p className="text-xs text-text-muted">Guidelines for selecting the proper steganography domain for your use case</p>
          </div>
          <Badge variant="accent" size="sm">Selection Rules</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <Badge variant="primary" size="sm">Choose LSB When:</Badge>
            <ul className="space-y-1.5 text-text-muted text-[11px]">
              <li>• You are using uncompressed PNG or BMP carrier images.</li>
              <li>• Secret message payload requires large capacity (&gt;100 KB).</li>
              <li>• Execution speed must be instantaneous (&lt;20 ms).</li>
            </ul>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <Badge variant="secondary" size="sm">Choose DCT When:</Badge>
            <ul className="space-y-1.5 text-text-muted text-[11px]">
              <li>• Carrier image will be shared over social or web channels.</li>
              <li>• Image may undergo lossy JPEG compression.</li>
              <li>• Cropping or frequency filtering is anticipated.</li>
            </ul>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <Badge variant="success" size="sm">Choose DWT When:</Badge>
            <ul className="space-y-1.5 text-text-muted text-[11px]">
              <li>• Medical, legal, or military secret transmission.</li>
              <li>• Requiring supreme visual fidelity (PSNR &gt; 50 dB).</li>
              <li>• Maximum resistance against spatial and frequency steg-analysis.</li>
            </ul>
          </div>
        </div>
      </ContentWrapper>

      {/* SECTION 11: EXPORT PANEL TOOLBAR */}
      <div className="p-6 glass-card rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Benchmark Analytics Data Export</h3>
          <p className="text-xs text-text-muted">Export comparison tables and chart datasets for academic research</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportToast("PDF")} leftIcon={<Download className="w-4 h-4" />}>
            PDF Report
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportToast("CSV")} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
            CSV Dataset
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportToast("JSON")} leftIcon={<FileCode className="w-4 h-4" />}>
            JSON Spec
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleExportToast("Share Link")} leftIcon={<Share2 className="w-4 h-4" />}>
            Share Results
          </Button>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={previewImageSrc}
        title={previewTitle}
      />
    </PageContainer>
  );
}

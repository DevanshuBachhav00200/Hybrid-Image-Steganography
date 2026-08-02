"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Cpu,
  Lock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Activity,
  Zap,
  Code2,
  FileCode,
  Sparkles,
  Binary,
  Radio,
  FileImage,
  Server,
  Terminal,
  FileText,
  Database,
  Sliders,
  ChevronRight,
  Eye,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { GridContainer } from "@/components/layout/GridContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/cards/MetricCard";
import { AlgorithmCard } from "@/components/cards/AlgorithmCard";
import { ALGORITHM_METADATA } from "@/constants/design-system";

export default function HomePage() {
  const [selectedAlgo, setSelectedAlgo] = useState<"lsb" | "dct" | "dwt">("lsb");

  // 1. Feature Highlights (6 Features)
  const features = [
    {
      icon: <Radio className="w-6 h-6 text-primary" />,
      title: "Morse Code Encoding",
      description: "Pre-modulates input messages into international Morse dot-dash symbols, creating an initial abstraction layer.",
      tag: "Modulation",
    },
    {
      icon: <Lock className="w-6 h-6 text-secondary" />,
      title: "AES-256 Encryption",
      description: "Encrypted ciphertext generation using Galois/Counter Mode (GCM) for authenticated payload confidentiality.",
      tag: "Security",
    },
    {
      icon: <Binary className="w-6 h-6 text-accent" />,
      title: "Binary Bitstream Conversion",
      description: "Serialization of encrypted Morse payload into high-density 8-bit binary bitstreams for precise embedding.",
      tag: "Bitstream",
    },
    {
      icon: <Layers className="w-6 h-6 text-success" />,
      title: "LSB Spatial Embedding",
      description: "Direct Least Significant Bit substitution across spatial RGB pixel planes for maximum payload capacity.",
      tag: "Spatial Domain",
    },
    {
      icon: <Cpu className="w-6 h-6 text-warning" />,
      title: "DCT Frequency Embedding",
      description: "Mid-frequency coefficient modification in 8x8 block Discrete Cosine Transform matrices for compression resistance.",
      tag: "Frequency Domain",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "DWT Wavelet Embedding",
      description: "Multi-resolution Discrete Wavelet Transform sub-band decomposition (LL, LH, HL, HH) for structural stealth.",
      tag: "Wavelet Domain",
    },
  ];

  // 2. Steganography Workflow Steps
  const workflowSteps = [
    { step: "01", title: "Plaintext Message", desc: "User inputs secret text data", icon: FileText, color: "text-primary border-primary/30 bg-primary/10" },
    { step: "02", title: "Morse Modulation", desc: "Converted to dot-dash stream", icon: Radio, color: "text-secondary border-secondary/30 bg-secondary/10" },
    { step: "03", title: "AES-256 Encryption", desc: "Authenticated GCM cipher", icon: Lock, color: "text-accent border-accent/30 bg-accent/10" },
    { step: "04", title: "Binary Serialization", desc: "Formatted into 8-bit array", icon: Binary, color: "text-success border-success/30 bg-success/10" },
    { step: "05", title: "Multi-Domain Embedding", desc: "LSB, DCT, or DWT insertion", icon: Cpu, color: "text-warning border-warning/30 bg-warning/10" },
    { step: "06", title: "Stego Carrier Image", desc: "Visually identical host media", icon: FileImage, color: "text-primary border-primary/30 bg-primary/10" },
  ];

  // 3. Algorithm Detailed Comparison Cards
  const algorithmOverviews = [
    {
      id: "lsb",
      name: "LSB (Least Significant Bit)",
      domain: "Spatial Domain",
      description: "Modifies the least significant bits of raw pixel bytes in spatial memory.",
      strengths: ["High Payload Capacity (>25%)", "Zero Computational Overhead", "Preserves Visual Fidelity"],
      bestUseCase: "Uncompressed RAW or PNG carrier images requiring maximum payload transmission.",
      capacity: 95,
      robustness: 40,
      badge: "Highest Capacity",
    },
    {
      id: "dct",
      name: "DCT (Discrete Cosine Transform)",
      domain: "Frequency Domain",
      description: "Transforms 8x8 pixel blocks into spatial frequency coefficients before bit insertion.",
      strengths: ["Lossy Compression Resistance", "Mid-Frequency Coefficient Stability", "Resistant to Cropping"],
      bestUseCase: "JPEG image distribution across public web channels prone to compression.",
      capacity: 70,
      robustness: 85,
      badge: "JPEG Robust",
    },
    {
      id: "dwt",
      name: "DWT (Discrete Wavelet Transform)",
      domain: "Wavelet Domain",
      description: "Decomposes image into frequency sub-bands (LL, LH, HL, HH) across spatial resolutions.",
      strengths: ["High Noise Resistance", "Superior Structural PSNR (>50dB)", "Multi-Resolution Security"],
      bestUseCase: "High-security military and medical imaging requiring extreme integrity.",
      capacity: 65,
      robustness: 95,
      badge: "Maximum Security",
    },
  ];

  // 4. Technology Stack Items
  const techStack = [
    { name: "Next.js 15", category: "Frontend Framework", icon: Code2 },
    { name: "React 19", category: "UI Engine", icon: Sparkles },
    { name: "TypeScript", category: "Type Safety", icon: FileCode },
    { name: "Tailwind CSS", category: "Design System", icon: Layers },
    { name: "FastAPI", category: "Backend Engine", icon: Server },
    { name: "Python 3.11", category: "Core Computation", icon: Terminal },
    { name: "OpenCV", category: "Image Processing", icon: Eye },
    { name: "NumPy", category: "Matrix Math", icon: Database },
    { name: "PyWavelets", category: "Wavelet DWT", icon: Activity },
  ];

  // 5. Why Hybrid Steganography Benefits
  const benefits = [
    {
      num: "01",
      title: "Triple-Layer Defense In Depth",
      description: "Combining Morse Code abstraction, AES-256 encryption, and steganographic embedding eliminates single points of failure. Even if an image is intercepted and analyzed, ciphertexts remain undecipherable without secret keys.",
    },
    {
      num: "02",
      title: "Domain-Adaptive Flexibility",
      description: "Choose spatial LSB for massive data payloads, frequency DCT for web compression survival, or wavelet DWT for maximum signal noise resistance.",
    },
    {
      num: "03",
      title: "Mathematically Verified PSNR",
      description: "Optimized bit substitution algorithms guarantee Peak Signal-to-Noise Ratios exceeding 48 dB, ensuring carrier images remain visually indistinguishable from original hosts.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* =================================================== */}
      {/* 1. HERO SECTION */}
      {/* =================================================== */}
      <section className="relative pt-8 pb-12 overflow-hidden select-none">
        {/* Animated Cyber Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulseGlow" />

        <PageContainer size="xl" className="space-y-8">
          <div className="glass-card border border-primary/30 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-glow-blue">
            {/* Corner Decorative Grids */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none font-mono text-xs text-primary">
              [SYSTEM_STATE: ONLINE]<br />
              [CYBER_DOMAINS: LSB|DCT|DWT]
            </div>

            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="lg" glow>
                  Enterprise Cyber Security & Research Architecture
                </Badge>
                <Badge variant="success" size="lg" dot>
                  Phase 2B Shell Complete
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                Hybrid Image Steganography System Using{" "}
                <span className="gradient-text-primary">Morse Code Encoding</span> & Multi-Domain Data Embedding
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
                An advanced multi-layer security platform integrating Morse Code modulation, AES-256 GCM encryption, and multi-domain carrier embedding (Spatial LSB, Frequency DCT, and Wavelet DWT).
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/encode">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Encoding
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline" size="lg" leftIcon={<BookOpen className="w-5 h-5" />}>
                  Explore Documentation
                </Button>
              </Link>
              <Link href="/design-system">
                <Button variant="ghost" size="lg" leftIcon={<Code2 className="w-5 h-5" />}>
                  Design System Catalog
                </Button>
              </Link>
            </div>

            {/* Quick Stats Pill Bar */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-text-muted text-[10px] uppercase block">Encryption Standard</span>
                <span className="text-text-primary font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-accent" /> AES-256-GCM
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-text-muted text-[10px] uppercase block">Embedding Domains</span>
                <span className="text-text-primary font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" /> LSB • DCT • DWT
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-text-muted text-[10px] uppercase block">Target PSNR</span>
                <span className="text-success font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> &gt; 48.5 dB
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-text-muted text-[10px] uppercase block">Pre-Modulation</span>
                <span className="text-secondary font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" /> Morse Code
                </span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =================================================== */}
      {/* 2. FEATURE HIGHLIGHTS (6 CARDS) */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <span className="w-2 h-6 bg-primary rounded-full shrink-0" />
              Core Architecture & Features
            </h2>
            <p className="text-xs text-text-muted">Six modular transformation layers building the hybrid security pipeline</p>
          </div>
          <Badge variant="muted" size="md">6 Core Modules</Badge>
        </div>

        <GridContainer cols={3} gap="md">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card border border-border hover:border-primary/50 rounded-2xl p-6 space-y-3.5 transition-all duration-300 group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-background-secondary rounded-xl border border-border/80 group-hover:scale-105 transition-transform duration-200">
                  {feat.icon}
                </div>
                <Badge variant="outline" size="sm">{feat.tag}</Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </GridContainer>
      </PageContainer>

      {/* =================================================== */}
      {/* 3. WORKFLOW PIPELINE SECTION */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <ContentWrapper variant="glass" padding="lg" className="space-y-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                End-to-End Steganography Pipeline
              </h2>
              <p className="text-xs text-text-muted">
                Visual transformation flow from plaintext message to stego carrier media
              </p>
            </div>
            <Badge variant="accent" size="sm">6-Stage Pipeline</Badge>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((ws, i) => {
              const Icon = ws.icon;
              return (
                <div key={i} className="relative flex flex-col justify-between p-4 rounded-xl bg-background-secondary/80 border border-border space-y-3 hover:border-primary/40 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-text-muted group-hover:text-primary">
                      STAGE {ws.step}
                    </span>
                    <div className={cn("p-1.5 rounded-lg border", ws.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-text-primary">{ws.title}</h4>
                    <p className="text-[10px] text-text-muted leading-tight">{ws.desc}</p>
                  </div>

                  {i < workflowSteps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-border hover:text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </ContentWrapper>
      </PageContainer>

      {/* =================================================== */}
      {/* 4. ALGORITHM OVERVIEW & COMPARISON */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <span className="w-2 h-6 bg-secondary rounded-full shrink-0" />
              Steganographic Embedding Algorithms
            </h2>
            <p className="text-xs text-text-muted">Comparing Spatial, Frequency, and Wavelet domain techniques</p>
          </div>
          <Badge variant="secondary" size="md">Domain Analysis</Badge>
        </div>

        <GridContainer cols={3} gap="md">
          {algorithmOverviews.map((algo) => (
            <div
              key={algo.id}
              className={cn(
                "glass-card border rounded-2xl p-6 space-y-5 flex flex-col justify-between transition-all duration-300",
                selectedAlgo === algo.id ? "border-primary shadow-glow-blue bg-primary/5" : "border-border hover:border-border-hover"
              )}
              onClick={() => setSelectedAlgo(algo.id as "lsb" | "dct" | "dwt")}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={selectedAlgo === algo.id ? "primary" : "outline"} size="sm">
                    {algo.badge}
                  </Badge>
                  <span className="text-[10px] font-mono text-text-muted uppercase">{algo.domain}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-primary">{algo.name}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{algo.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">Key Strengths:</span>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {algo.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-1.5">
                <span className="text-[10px] text-text-muted font-mono uppercase block">Recommended Best Use Case:</span>
                <p className="text-xs text-text-primary font-medium leading-relaxed bg-background-secondary/80 p-2.5 rounded-lg border border-border/60">
                  {algo.bestUseCase}
                </p>
              </div>
            </div>
          ))}
        </GridContainer>
      </PageContainer>

      {/* =================================================== */}
      {/* 5. METRICS PREVIEW SECTION */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <span className="w-2 h-6 bg-accent rounded-full shrink-0" />
              Benchmark Performance Metrics
            </h2>
            <p className="text-xs text-text-muted">Target operational thresholds for imperceptibility and speed</p>
          </div>
          <Badge variant="accent" size="md">Placeholder Target Metrics</Badge>
        </div>

        <GridContainer cols={5} gap="sm">
          <MetricCard title="PSNR Ratio" value="48.52" unit="dB" change={{ value: "+2.4 dB", positive: true }} icon={<Activity className="w-4 h-4" />} subtitle="Signal Quality" />
          <MetricCard title="SSIM Fidelity" value="0.9984" unit="Index" change={{ value: "+0.001", positive: true }} icon={<CheckCircle2 className="w-4 h-4 text-success" />} subtitle="Structural Similarity" />
          <MetricCard title="MSE Error" value="0.0012" unit="Deviation" change={{ value: "-0.0004", positive: true }} icon={<Activity className="w-4 h-4 text-accent" />} subtitle="Pixel Mean Error" />
          <MetricCard title="Embedding Capacity" value="25.0" unit="%" change={{ value: "High Payload", positive: true }} icon={<Layers className="w-4 h-4 text-primary" />} subtitle="Max Pixel Ratio" />
          <MetricCard title="Execution Time" value="142" unit="ms" change={{ value: "Optimal", positive: true }} icon={<Zap className="w-4 h-4 text-warning" />} subtitle="Average Latency" />
        </GridContainer>
      </PageContainer>

      {/* =================================================== */}
      {/* 6. TECHNOLOGY STACK SHOWCASE */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <ContentWrapper variant="glass" padding="lg" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Technology Stack Architecture
              </h2>
              <p className="text-xs text-text-muted">Full-stack technologies driving the frontend UI and scientific computation engine</p>
            </div>
            <Badge variant="outline" size="sm">9 Core Libraries</Badge>
          </div>

          <GridContainer cols={3} gap="md">
            {techStack.map((tech, tIdx) => {
              const Icon = tech.icon;
              return (
                <div key={tIdx} className="flex items-center gap-3.5 p-4 rounded-xl bg-background-secondary/80 border border-border hover:border-primary/40 transition-colors">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{tech.name}</h4>
                    <span className="text-xs text-text-muted font-mono">{tech.category}</span>
                  </div>
                </div>
              );
            })}
          </GridContainer>
        </ContentWrapper>
      </PageContainer>

      {/* =================================================== */}
      {/* 7. WHY HYBRID STEGANOGRAPHY? (BENEFITS) */}
      {/* =================================================== */}
      <PageContainer size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <span className="w-2 h-6 bg-success rounded-full shrink-0" />
              Why Hybrid Image Steganography?
            </h2>
            <p className="text-xs text-text-muted">Key security advantages over single-algorithm steganography methods</p>
          </div>
          <Badge variant="success" size="md">Security Rationale</Badge>
        </div>

        <GridContainer cols={3} gap="md">
          {benefits.map((b, bIdx) => (
            <div key={bIdx} className="glass-card border border-border rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <span className="text-4xl font-extrabold font-mono text-primary/15 absolute right-4 top-4 select-none">
                {b.num}
              </span>
              <div className="space-y-2 relative z-10">
                <h3 className="text-base font-bold text-text-primary">{b.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </GridContainer>
      </PageContainer>

      {/* =================================================== */}
      {/* 8. FINAL CALL TO ACTION (CTA) */}
      {/* =================================================== */}
      <PageContainer size="xl">
        <div className="glass-card border border-primary/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-glow-blue relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <Badge variant="accent" size="lg" glow>
              Ready to Explore Steganographic Workflows?
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Test the Carrier Encoding & Decoding Layout
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Navigate to the Encode module to inspect parameter selection cards, drag-and-drop dropzones, and carrier specifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/encode">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Encoding Session
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="outline" size="lg" leftIcon={<BookOpen className="w-5 h-5" />}>
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

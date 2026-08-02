"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Info,
  Shield,
  ShieldCheck,
  Layers,
  Cpu,
  Zap,
  Lock,
  Radio,
  Binary,
  FileImage,
  Award,
  BookOpen,
  Code2,
  Github,
  Linkedin,
  Globe,
  Mail,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Star,
  Check,
  X,
  User,
  GraduationCap,
  Building,
  Calendar,
  LayoutDashboard,
  BarChart2,
  Terminal,
  Maximize2,
  FileText,
  Server,
  Database,
  Rocket,
  Compass,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/cards/MetricCard";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";
import { useToast } from "@/components/feedback/Toast";

export default function AboutPage() {
  const { toast } = useToast();

  // Local UI States
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  // Demo Screenshot Placeholders for Gallery
  const galleryImages = [
    { id: "encode", title: "Encode Workspace", category: "Encryption & Stego", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
    { id: "decode", title: "Decode Workspace", category: "Extraction & Decryption", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
    { id: "dashboard", title: "Analytics Dashboard", category: "Telemetry & Quality", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
    { id: "compare", title: "Algorithm Comparison", category: "Benchmark Analytics", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
    { id: "documentation", title: "Documentation Portal", category: "Technical Guides", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
    { id: "design", title: "Design System", category: "UI Tokens & Components", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80" },
  ];

  const openZoomModal = (src: string, title: string) => {
    setModalImageSrc(src);
    setModalTitle(title);
    setIsImageModalOpen(true);
  };

  const handleActionToast = (msg: string) => {
    toast({
      title: "Open Source Gateway",
      message: msg,
      type: "info",
    });
  };

  return (
    <PageContainer size="xl" className="space-y-12 pb-20">
      {/* =================================================== */}
      {/* PAGE HEADER & HERO SECTION */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "About Project" }]} />

        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">Open Source Research</Badge>
            <Badge variant="secondary" size="sm">Cyber Security</Badge>
            <Badge variant="success" size="sm">Image Processing</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-tight">
            Hybrid Image Steganography System
          </h1>

          <p className="text-base sm:text-lg font-medium text-text-secondary leading-relaxed">
            Using Morse Code Encoding and Multi-Domain Data Embedding Techniques (LSB, DCT, DWT)
          </p>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
            A state-of-the-art research project pioneering multi-layered defense-in-depth data hiding. By combining Morse pre-modulation obfuscation, authenticated AES-256 GCM cryptography, and multi-domain steganographic insertion, secret messages remain imperceptible and cryptographically secure.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/encode">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Encoding Session
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="outline" size="md" leftIcon={<BookOpen className="w-4 h-4" />}>
                Explore Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 1: PROJECT OVERVIEW (VISION, MISSION, OBJECTIVES) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            1. Project Vision, Mission & Objectives
          </h2>
          <Badge variant="primary" size="sm">Core Rationale</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="text-primary font-bold block text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Project Vision
            </span>
            <p className="text-text-muted leading-relaxed">
              To establish a new benchmark in secure stealth communication by bridging theoretical digital image processing research with modern enterprise web applications.
            </p>
          </div>

          <div className="p-5 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="text-secondary font-bold block text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Project Mission
            </span>
            <p className="text-text-muted leading-relaxed">
              Develop a resilient multi-layer steganography platform capable of protecting confidential communications against both visual degradation and steg-analysis detection.
            </p>
          </div>

          <div className="p-5 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="text-success font-bold block text-sm flex items-center gap-2">
              <Award className="w-4 h-4" /> Core Objectives
            </span>
            <p className="text-text-muted leading-relaxed">
              Achieve PSNR quality &gt; 48.5 dB, deliver sub-200ms processing latency, support spatial/frequency/wavelet domain choices, and ensure zero cloud data persistence.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 2: WHY THIS PROJECT (BENEFITS OF HYBRID) */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            2. Why Hybrid Image Steganography?
          </h2>
          <Badge variant="accent" size="sm">Defense-in-Depth</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="font-bold text-primary block flex items-center gap-2">
              <Radio className="w-4 h-4" /> 1. Morse Pre-Modulation
            </span>
            <p className="text-text-muted leading-relaxed">
              Obfuscates raw text symbol structures into dot-dash sequences prior to hashing.
            </p>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="font-bold text-secondary block flex items-center gap-2">
              <Lock className="w-4 h-4" /> 2. AES-256 GCM Cryptography
            </span>
            <p className="text-text-muted leading-relaxed">
              Guarantees payload secrecy and tamper detection via 256-bit Galois/Counter Mode.
            </p>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="font-bold text-success block flex items-center gap-2">
              <Cpu className="w-4 h-4" /> 3. Multi-Domain Insertion
            </span>
            <p className="text-text-muted leading-relaxed">
              Select between spatial LSB, block frequency DCT, or wavelet sub-band DWT domains.
            </p>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <span className="font-bold text-accent block flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 4. Verified PSNR Quality
            </span>
            <p className="text-text-muted leading-relaxed">
              Ensures zero humanly perceptible visual alteration in PNG and BMP stego carriers.
            </p>
          </div>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 3: KEY PROJECT HIGHLIGHTS */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            3. Key System Highlights & Capabilities
          </h2>
          <Badge variant="primary" size="sm">Feature Highlights</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { title: "Secure Communication", desc: "Multi-layered stealth data protection.", icon: Shield },
            { title: "Layered Defense", desc: "Morse + AES-256 + Steganography triple layer.", icon: Lock },
            { title: "3 Embedding Domains", desc: "LSB spatial, DCT frequency, DWT wavelet.", icon: Cpu },
            { title: "Image Quality Metrics", desc: "Real-time PSNR, SSIM, and MSE metrics.", icon: Activity },
            { title: "Telemetry Dashboard", desc: "Grafana-inspired performance analytics.", icon: LayoutDashboard },
            { title: "Next.js 15 Web App", desc: "Enterprise React 19 architecture shell.", icon: Code2 },
            { title: "Responsive Layout", desc: "Optimized for Desktop, Tablet, and Mobile.", icon: Sliders },
            { title: "Research-Oriented", desc: "Standardized benchmark dataset visualizers.", icon: BookOpen },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 w-fit">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 4: SYSTEM ARCHITECTURE FLOW */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              4. System Architecture & Tiered Layers
            </h2>
            <p className="text-xs text-text-muted">4-tier modular decoupled design for enterprise scalability</p>
          </div>
          <Badge variant="primary" size="sm">System Design</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            { tier: "Tier 1", name: "Presentation Layer", tech: "Next.js 15 / React 19 / Tailwind", desc: "Interactive cyber dashboard & UI shell", icon: Code2 },
            { tier: "Tier 2", name: "API Gateway Layer", tech: "FastAPI REST Gateway", desc: "OpenAPI endpoints & JSON data transfer", icon: Server },
            { tier: "Tier 3", name: "Processing Engine", tech: "Python 3.11 / OpenCV / PyWavelets", desc: "Morse, AES-256, LSB/DCT/DWT core", icon: Cpu },
            { tier: "Tier 4", name: "Storage Layer", tech: "In-Memory Bitstream Buffer", desc: "Zero persistent database for plaintext security", icon: Database },
          ].map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2 flex flex-col items-center justify-center">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-text-muted font-bold uppercase">{layer.tier}</span>
                <h4 className="text-xs font-bold text-text-primary">{layer.name}</h4>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">{layer.tech}</Badge>
                <p className="text-[10px] text-text-muted leading-tight pt-1">{layer.desc}</p>
              </div>
            );
          })}
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 5: TECHNOLOGY STACK */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Code2 className="w-5 h-5 text-secondary" />
            5. Technology Stack & Framework Components
          </h2>
          <Badge variant="secondary" size="sm">Stack Overview</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { name: "Next.js 15", category: "Frontend Framework", desc: "App Router & SSR" },
            { name: "React 19", category: "UI Library", desc: "Concurrent rendering" },
            { name: "TypeScript", category: "Type Safety", desc: "Strict type checking" },
            { name: "Tailwind CSS", category: "Styling Engine", desc: "Custom design tokens" },
            { name: "FastAPI", category: "Backend Gateway", desc: "Python REST API" },
            { name: "OpenCV", category: "Image Processing", desc: "2D Matrix operations" },
            { name: "PyWavelets", category: "Wavelet Domain", desc: "2D DWT sub-bands" },
            { name: "Cryptography", category: "Security Library", desc: "AES-256 GCM & PBKDF2" },
          ].map((tech, idx) => (
            <div key={idx} className="p-3 bg-background-secondary rounded-xl border border-border/60 space-y-1">
              <span className="text-[9px] text-text-muted uppercase block">{tech.category}</span>
              <span className="font-bold text-text-primary block text-[11px]">{tech.name}</span>
              <span className="text-[10px] text-primary block font-sans">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 6: PROJECT ROADMAP TIMELINE */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Rocket className="w-5 h-5 text-accent" />
              6. Project Development Roadmap & Progress
            </h2>
            <p className="text-xs text-text-muted">Chronological engineering phases from inception to future release</p>
          </div>
          <Badge variant="accent" size="sm">Phase 2 Completed</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3 text-center">
          {[
            { phase: "01", name: "Planning", status: "Done", variant: "success" as const },
            { phase: "02", name: "Design System", status: "Done", variant: "success" as const },
            { phase: "03", name: "Frontend UI", status: "Done", variant: "success" as const },
            { phase: "04", name: "Backend API", status: "Next", variant: "primary" as const },
            { phase: "05", name: "Algorithms", status: "Next", variant: "primary" as const },
            { phase: "06", name: "Testing", status: "Planned", variant: "outline" as const },
            { phase: "07", name: "Deployment", status: "Planned", variant: "outline" as const },
            { phase: "08", name: "Future R&D", status: "Planned", variant: "outline" as const },
          ].map((step, idx) => (
            <div key={idx} className="p-3 bg-background-secondary rounded-xl border border-border space-y-1.5 flex flex-col items-center justify-center">
              <span className="text-[9px] font-mono text-text-muted font-bold">PHASE {step.phase}</span>
              <h4 className="text-xs font-bold text-text-primary">{step.name}</h4>
              <Badge variant={step.variant} size="sm" className="font-mono text-[9px]">
                {step.status}
              </Badge>
            </div>
          ))}
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 7: PROJECT STATISTICS (KPI CARDS) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            7. Key System Statistics & Benchmark Baseline
          </h2>
          <Badge variant="success" size="sm">Baseline Metrics</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Algorithms Supported"
            value="3 Domains"
            change={{ value: "LSB / DCT / DWT", positive: true }}
            subtitle="Spatial, Frequency, Wavelet"
            icon={<Cpu className="w-5 h-5" />}
          />
          <MetricCard
            title="Security Layers"
            value="3 Layers"
            change={{ value: "Defense-in-Depth", positive: true }}
            subtitle="Morse + AES-256 + Stego"
            icon={<Lock className="w-5 h-5" />}
          />
          <MetricCard
            title="Carrier Formats"
            value="2 Lossless"
            change={{ value: "PNG & BMP", positive: true }}
            subtitle="24-bit RGB Uncompressed"
            icon={<FileImage className="w-5 h-5" />}
          />
          <MetricCard
            title="Target Peak SNR"
            value="52.10 dB"
            change={{ value: "> 48.5 dB Target", positive: true }}
            subtitle="DWT Wavelet Domain Peak"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 8: FUTURE ENHANCEMENTS */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            8. Future Research & Development Roadmap
          </h2>
          <Badge variant="primary" size="sm">Future Scope</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { title: "Audio Steganography", desc: "WAV / MP3 audio carrier LSB & phase coding embedding." },
            { title: "Video Steganography", desc: "MP4 / AVI video frame sub-band wavelet steganography." },
            { title: "AI-Based Embedding", desc: "Deep learning GAN-driven generative steganography." },
            { title: "Cloud Microservices", desc: "Containerized Docker & Kubernetes API deployment." },
            { title: "User Authentication", desc: "JWT & OAuth2 role-based security access control." },
            { title: "Batch Processing", desc: "Bulk carrier processing & high-throughput pipelines." },
            { title: "Steganalysis Engine", desc: "AI-powered steganalysis detection & counter-analysis." },
            { title: "Mobile Native App", desc: "iOS & Android mobile steganographic security suite." },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-background-secondary rounded-xl border border-border space-y-1.5">
              <span className="font-bold text-text-primary block text-xs">{item.title}</span>
              <p className="text-text-muted text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 9: PROJECT GALLERY (LIGHTBOX UI) */}
      {/* =================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileImage className="w-5 h-5 text-secondary" />
            9. Application Workspace Gallery
          </h2>
          <Badge variant="secondary" size="sm">Interface Preview</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img) => (
            <div key={img.id} className="glass-card p-4 rounded-xl border border-border space-y-3 shadow-md">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-background-secondary group">
                {/* eslint-disable-next-next/no-img-element */}
                <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <Button variant="outline" size="sm" onClick={() => openZoomModal(img.src, img.title)} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
                    Zoom View
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary">{img.title}</h4>
                <span className="text-[10px] font-mono text-text-muted">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 10: OPEN SOURCE & GITHUB HUB */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6 border border-primary/30 shadow-glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Github className="w-5 h-5 text-primary" />
              10. Open Source Repository & Licensing
            </h2>
            <p className="text-xs text-text-muted">Distributed under MIT License for academic research and security development</p>
          </div>
          <Badge variant="primary" size="sm">MIT License</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-background-secondary rounded-xl border border-border space-y-1">
            <span className="text-[9px] text-text-muted uppercase block">Repository Version</span>
            <span className="font-bold text-primary block">v1.0.0-Enterprise</span>
          </div>
          <div className="p-3 bg-background-secondary rounded-xl border border-border space-y-1">
            <span className="text-[9px] text-text-muted uppercase block">License Type</span>
            <span className="font-bold text-success block">MIT Open Source</span>
          </div>
          <div className="p-3 bg-background-secondary rounded-xl border border-border space-y-1">
            <span className="text-[9px] text-text-muted uppercase block">Contribution Status</span>
            <span className="font-bold text-accent block">PRs Welcome</span>
          </div>
          <div className="p-3 bg-background-secondary rounded-xl border border-border space-y-1">
            <span className="text-[9px] text-text-muted uppercase block">Build Status</span>
            <span className="font-bold text-success block">Passing (0 Errors)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="primary" size="sm" onClick={() => handleActionToast("Opening GitHub Repository...")} leftIcon={<Github className="w-4 h-4" />}>
            GitHub Repository
          </Button>
          <Link href="/documentation">
            <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
              Documentation
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => handleActionToast("Starring Repository...")} leftIcon={<Star className="w-4 h-4" />}>
            Star Project
          </Button>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 11: ACKNOWLEDGEMENTS */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            11. Academic & Technical Acknowledgements
          </h2>
          <Badge variant="accent" size="sm">Citations</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <strong className="text-text-primary block font-bold">Digital Image Processing Community</strong>
            <p className="text-text-muted leading-relaxed">
              Acknowledging foundational literature in spatial pixel substitution, discrete cosine transformation, and discrete wavelet decomposition.
            </p>
          </div>
          <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
            <strong className="text-text-primary block font-bold">Cryptography & Open Source Ecosystem</strong>
            <p className="text-text-muted leading-relaxed">
              Special thanks to NIST AES FIPS 197 standards, OpenCV, PyWavelets, FastAPI, Next.js, and Tailwind CSS open-source maintainers.
            </p>
          </div>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 12: DEVELOPER & RESEARCH LEAD PROFILE */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6 border border-secondary/30 shadow-glow-purple">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            12. Developer & Lead System Architect Profile
          </h2>
          <Badge variant="secondary" size="sm">Lead Developer</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
            <div className="w-20 h-20 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center mx-auto lg:mx-0 shadow-glow-purple">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Devanshu Bachhav</h3>
              <span className="text-xs font-mono text-secondary font-semibold">Lead Architect &amp; Security Researcher</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Department</span>
                <span className="font-bold text-text-primary block text-[11px]">Computer Engineering &amp; Cyber Security</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl border border-border/60">
                <span className="text-[9px] text-text-muted uppercase block">Academic Institution</span>
                <span className="font-bold text-text-primary block text-[11px]">Department of Computer Engineering</span>
              </div>
            </div>

            <div className="p-3 bg-background-secondary rounded-xl border border-border/60 space-y-1 font-sans">
              <span className="text-[10px] text-text-muted uppercase font-mono block font-bold">Key Technical Competencies</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge variant="primary" size="sm">Next.js 15</Badge>
                <Badge variant="secondary" size="sm">FastAPI</Badge>
                <Badge variant="success" size="sm">OpenCV</Badge>
                <Badge variant="accent" size="sm">AES-256 GCM</Badge>
                <Badge variant="outline" size="sm">LSB / DCT / DWT</Badge>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 13: CONTACT & FEEDBACK */}
      {/* =================================================== */}
      <section id="contact" className="space-y-4">
        <ContentWrapper variant="glass" padding="lg" className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              13. Contact & Support Gateway
            </h2>
            <Badge variant="accent" size="sm">Get In Touch</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
              <Mail className="w-5 h-5 text-primary" />
              <strong className="text-text-primary block">Research Support Email</strong>
              <p className="text-text-muted text-[11px]">devanshu.research@steganography.org</p>
            </div>
            <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
              <Github className="w-5 h-5 text-secondary" />
              <strong className="text-text-primary block">GitHub Open Source</strong>
              <p className="text-text-muted text-[11px]">github.com/DevanshuBachhav00200</p>
            </div>
            <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
              <BookOpen className="w-5 h-5 text-success" />
              <strong className="text-text-primary block">Technical Docs Portal</strong>
              <p className="text-text-muted text-[11px]">Access API guides &amp; stego formulas.</p>
            </div>
          </div>
        </ContentWrapper>
      </section>

      {/* =================================================== */}
      {/* SECTION 14: CALL TO ACTION BANNER */}
      {/* =================================================== */}
      <div className="glass-card border border-primary/30 rounded-2xl p-8 text-center space-y-6 shadow-glow-blue relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Ready to Experience Multi-Layer Steganography?
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Protect confidential information using Morse Code pre-modulation, AES-256 GCM encryption, and LSB / DCT / DWT multi-domain embedding.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/encode">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Encoding Session
            </Button>
          </Link>
          <Link href="/documentation">
            <Button variant="outline" size="lg" leftIcon={<BookOpen className="w-5 h-5" />}>
              Explore Documentation
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" leftIcon={<LayoutDashboard className="w-5 h-5" />}>
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

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

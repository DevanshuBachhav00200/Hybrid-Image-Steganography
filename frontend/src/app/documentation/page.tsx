"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Layers,
  Cpu,
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  Key,
  Eye,
  Radio,
  Binary,
  FileImage,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  FileSpreadsheet,
  FileCode,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Code2,
  Github,
  Mail,
  Search,
  Check,
  X,
  Server,
  Database,
  Terminal,
  Activity,
  Award,
  BookMarked,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/feedback/Toast";

// Sidebar Navigation Items
const navSections = [
  { id: "intro", label: "1. Introduction" },
  { id: "overview", label: "2. Project Overview" },
  { id: "architecture", label: "3. System Architecture" },
  { id: "encoding", label: "4. Encoding Workflow" },
  { id: "decoding", label: "5. Decoding Workflow" },
  { id: "algorithms", label: "6. Algorithms (LSB/DCT/DWT)" },
  { id: "metrics", label: "7. Performance Metrics" },
  { id: "techstack", label: "8. Technology Stack" },
  { id: "security", label: "9. Security Features" },
  { id: "faq", label: "10. Frequently Asked Questions" },
  { id: "glossary", label: "11. Technical Glossary" },
  { id: "references", label: "12. References & Citations" },
  { id: "downloads", label: "13. Download Center" },
  { id: "support", label: "14. Contact & Support" },
];

// Technical Glossary Data
const glossaryTerms = [
  { term: "AES-256-GCM", category: "Cryptography", definition: "Advanced Encryption Standard in Galois/Counter Mode delivering 256-bit confidentiality & payload integrity authentication." },
  { term: "Morse Code", category: "Modulation", definition: "Character modulation encoding plaintext characters into variable-length dot (.) and dash (-) signal sequences." },
  { term: "Steganography", category: "Data Hiding", definition: "The science of hiding confidential messages within ordinary cover media (e.g. digital images) without leaving perceptual trace." },
  { term: "Cryptography", category: "Data Hiding", definition: "The science of encrypting plaintext into unreadable ciphertext, protecting message content but not its transmission existence." },
  { term: "LSB (Least Significant Bit)", category: "Spatial Domain", definition: "Steganography technique substituting the rightmost (8th) bit of RGB pixel bytes with secret payload bitstreams." },
  { term: "DCT (Discrete Cosine Transform)", category: "Frequency Domain", definition: "Frequency transformation mapping 8x8 spatial pixel blocks into cosine frequency coefficients resistant to lossy JPEG compression." },
  { term: "DWT (Discrete Wavelet Transform)", category: "Wavelet Domain", definition: "Multi-resolution spatial-frequency decomposition splitting images into LL, LH, HL, and HH sub-bands for maximum stealth." },
  { term: "PSNR (Peak Signal-to-Noise Ratio)", category: "Metrics", definition: "Logarithmic ratio (in dB) quantifying stego carrier quality relative to host reference. Values >48 dB indicate imperceptible distortion." },
  { term: "SSIM (Structural Similarity)", category: "Metrics", definition: "Perceptual structural similarity index measuring luminance, contrast, and structure match between host and stego carrier (1.0 = identical)." },
  { term: "MSE (Mean Squared Error)", category: "Metrics", definition: "Cumulative squared error calculation between host carrier pixel bytes and stego output pixels." },
  { term: "Payload Capacity", category: "Capacity", definition: "Maximum volume of secret binary data (in KB or % ratio) that can be embedded into a carrier image without visual degradation." },
  { term: "Imperceptibility", category: "Quality", definition: "Degree to which a stego carrier image remains visually indistinguishable from its original un-encoded host counterpart." },
];

export default function DocumentationPage() {
  const { toast } = useToast();

  // Local UI States
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [glossarySearch, setGlossarySearch] = useState("");

  // Filtered Glossary Terms
  const filteredGlossary = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const handleDownloadToast = (title: string) => {
    toast({
      title: `Downloading ${title}`,
      message: `Preparing technical documentation asset for download...`,
      type: "success",
    });
  };

  // Active section scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of navSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageContainer size="xl" className="space-y-10 pb-20">
      {/* =================================================== */}
      {/* PAGE HEADER & BREADCRUMBS */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "Documentation & How It Works" }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-glow-blue">
                <BookOpen className="w-6 h-6" />
              </div>
              Documentation & Technical Guide
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              Learn how the Hybrid Image Steganography System securely hides and extracts confidential information using Digital Image Processing, Cryptography, and Multi-Domain Embedding.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => handleDownloadToast("User Guide PDF")} leftIcon={<Download className="w-4 h-4" />}>
              Download Guide PDF
            </Button>
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="sm" leftIcon={<Github className="w-4 h-4" />}>
                GitHub Repository
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* MAIN DOCUMENTATION LAYOUT (STICKY SIDEBAR + CONTENT) */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =================================================== */}
        {/* LEFT STICKY NAVIGATION SIDEBAR (3 Columns) */}
        {/* =================================================== */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4 z-10">
          <div className="glass-card p-4 rounded-xl border border-border space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-border/70 pb-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-primary" />
                Documentation Index
              </span>
              <Badge variant="primary" size="sm">14 Topics</Badge>
            </div>

            <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {navSections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between",
                    activeSection === item.id
                      ? "bg-primary text-white shadow-glow-blue font-bold"
                      : "text-text-muted hover:text-text-primary hover:bg-card-hover"
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {activeSection === item.id && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* =================================================== */}
        {/* RIGHT SCROLLABLE DOCUMENTATION CONTENT (9 Columns) */}
        {/* =================================================== */}
        <div className="lg:col-span-9 space-y-12">
          {/* =================================================== */}
          {/* SECTION 1: INTRODUCTION TO STEGANOGRAPHY */}
          {/* =================================================== */}
          <section id="intro" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  1. Introduction to Steganography & Cryptography
                </h2>
                <Badge variant="primary" size="sm">Foundational Concepts</Badge>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
                <p>
                  <strong className="text-text-primary">Steganography</strong> (derived from the Greek words <em>steganos</em> meaning "covered" and <em>graphein</em> meaning "writing") is the art and science of hiding secret data inside ordinary, non-secret cover media (such as digital PNG or BMP images) to prevent detection.
                </p>

                {/* Comparison Matrix Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Lock className="w-4 h-4 text-secondary" />
                      Cryptography
                    </h3>
                    <p className="text-xs text-text-muted">
                      Converts readable plaintext into unreadable ciphertext. Protects <strong>content secrecy</strong>, but alerts adversaries that secret communication is occurring.
                    </p>
                  </div>

                  <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Eye className="w-4 h-4 text-success" />
                      Steganography
                    </h3>
                    <p className="text-xs text-text-muted">
                      Embeds data invisibly within cover images. Protects <strong>transmission existence</strong>, ensuring adversaries are unaware that a secret message exists.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Why Combine Cryptography and Steganography? (Defense-in-Depth)
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Combining both techniques creates a multi-layered security mechanism. Even if a sophisticated steganalysis system detects hidden data inside an image, the attacker cannot decipher the message without obtaining the AES-256 decryption key.
                  </p>
                </div>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 2: PROJECT OVERVIEW */}
          {/* =================================================== */}
          <section id="overview" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  2. System Purpose & Core Features
                </h2>
                <Badge variant="accent" size="sm">System Scope</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="text-primary font-bold block text-sm">Primary Objective</span>
                  <p className="text-text-muted leading-relaxed">
                    Provide a robust, multi-domain digital image steganography environment combining Morse Code modulation, AES-256 GCM encryption, and LSB / DCT / DWT embedding techniques.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="text-secondary font-bold block text-sm">Target Audience</span>
                  <p className="text-text-muted leading-relaxed">
                    Cybersecurity researchers, intelligence analysts, journalists, digital forensics specialists, and privacy advocates seeking resilient stealth communication.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="text-success font-bold block text-sm">Supported Carrier Formats</span>
                  <p className="text-text-muted leading-relaxed">
                    24-bit RGB uncompressed PNG (Portable Network Graphics) and BMP (Bitmap) digital image files.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="text-accent font-bold block text-sm">Supported Algorithms</span>
                  <p className="text-text-muted leading-relaxed">
                    LSB (Spatial Domain), DCT (Frequency Domain), and DWT (Wavelet Domain).
                  </p>
                </div>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 3: SYSTEM ARCHITECTURE */}
          {/* =================================================== */}
          <section id="architecture" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  3. Multi-Layer System Architecture
                </h2>
                <Badge variant="primary" size="sm">4-Tier System Design</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {[
                  { tier: "Tier 1", name: "Presentation Layer", tech: "Next.js 15 / React 19 / Tailwind", desc: "Interactive cyber dashboard & preview visualizers", icon: Code2 },
                  { tier: "Tier 2", name: "API Gateway Layer", tech: "FastAPI REST Endpoints", desc: "OpenAPI protocol & JSON data transfer", icon: Server },
                  { tier: "Tier 3", name: "Processing Engine", tech: "Python 3.11 / OpenCV / PyWavelets", desc: "Morse modulation, AES-256, LSB/DCT/DWT core", icon: Cpu },
                  { tier: "Tier 4", name: "Storage Layer", tech: "In-Memory Bitstream Buffer", desc: "Zero persistent storage for plaintext privacy", icon: Database },
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
          </section>

          {/* =================================================== */}
          {/* SECTION 4: ENCODING WORKFLOW */}
          {/* =================================================== */}
          <section id="encoding" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  4. Steganographic Encoding Transformation Pipeline
                </h2>
                <Badge variant="accent" size="sm">6-Stage Flow</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
                {[
                  { step: "01", title: "Plaintext Input", desc: "User types secret text payload", icon: FileText },
                  { step: "02", title: "Morse Modulation", desc: "Converted to dot-dash symbols", icon: Radio },
                  { step: "03", title: "AES Encryption", desc: "Encrypted with AES-256 GCM", icon: Lock },
                  { step: "04", title: "Binary Conversion", desc: "Serialized to 8-bit bitstream", icon: Binary },
                  { step: "05", title: "Carrier Embedding", desc: "Inserted into LSB / DCT / DWT", icon: Cpu },
                  { step: "06", title: "Stego Output", desc: "Generated stego carrier image", icon: FileImage },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-background-secondary border border-border space-y-1.5 flex flex-col items-center justify-center">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono text-text-muted font-bold">STEP {item.step}</span>
                      <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                      <p className="text-[10px] text-text-muted leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 5: DECODING WORKFLOW */}
          {/* =================================================== */}
          <section id="decoding" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Key className="w-5 h-5 text-secondary" />
                  5. Steganographic Extraction Pipeline
                </h2>
                <Badge variant="secondary" size="sm">5-Stage Reverse Flow</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                {[
                  { step: "01", title: "Stego Carrier Input", desc: "Upload encoded PNG/BMP file", icon: FileImage },
                  { step: "02", title: "Bitstream Extraction", desc: "Extract payload bits from domain", icon: Binary },
                  { step: "03", title: "AES Decryption", desc: "Decrypt ciphertext with password", icon: Lock },
                  { step: "04", title: "Morse De-Modulation", desc: "Convert dot-dash to characters", icon: Radio },
                  { step: "05", title: "Recovered Message", desc: "Display original confidential text", icon: FileText },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2 flex flex-col items-center justify-center">
                      <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-text-muted font-bold">STAGE {item.step}</span>
                      <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                      <p className="text-[10px] text-text-muted leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 6: ALGORITHMS (LSB / DCT / DWT) */}
          {/* =================================================== */}
          <section id="algorithms" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  6. Steganographic Embedding Algorithm Specs
                </h2>
                <Badge variant="primary" size="sm">LSB / DCT / DWT</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-3">
                  <Badge variant="primary" size="sm">LSB (Spatial Domain)</Badge>
                  <p className="text-text-muted leading-relaxed">
                    Substitutes the 8th bit of RGB pixel bytes. Offers maximum payload capacity (&gt;25%) and instant execution delay (&lt;20ms).
                  </p>
                  <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
                    <div className="flex justify-between"><span>Capacity:</span> <strong className="text-primary font-mono">Highest (&gt;25%)</strong></div>
                    <div className="flex justify-between"><span>JPEG Survival:</span> <strong className="text-danger font-mono">Low</strong></div>
                    <div className="flex justify-between"><span>PSNR Target:</span> <strong className="text-success font-mono">48.52 dB</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-3">
                  <Badge variant="secondary" size="sm">DCT (Frequency Domain)</Badge>
                  <p className="text-text-muted leading-relaxed">
                    Modifies mid-frequency cosine transform coefficients in 8x8 blocks. Provides strong resistance against lossy JPEG compression.
                  </p>
                  <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
                    <div className="flex justify-between"><span>Capacity:</span> <strong className="text-secondary font-mono">Medium (~10%)</strong></div>
                    <div className="flex justify-between"><span>JPEG Survival:</span> <strong className="text-success font-mono">High</strong></div>
                    <div className="flex justify-between"><span>PSNR Target:</span> <strong className="text-primary font-mono">44.18 dB</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-3">
                  <Badge variant="success" size="sm">DWT (Wavelet Domain)</Badge>
                  <p className="text-text-muted leading-relaxed">
                    Decomposes images into multi-resolution wavelet sub-bands. Delivers supreme visual quality (PSNR &gt; 50 dB) and stealth.
                  </p>
                  <div className="space-y-1 pt-1 border-t border-border/50 text-[11px]">
                    <div className="flex justify-between"><span>Capacity:</span> <strong className="text-text-muted font-mono">Moderate (~8%)</strong></div>
                    <div className="flex justify-between"><span>JPEG Survival:</span> <strong className="text-success font-mono">High</strong></div>
                    <div className="flex justify-between"><span>PSNR Target:</span> <strong className="text-success font-mono">52.10 dB</strong></div>
                  </div>
                </div>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 7: PERFORMANCE METRICS */}
          {/* =================================================== */}
          <section id="metrics" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  7. Quality & Benchmark Performance Metrics Guide
                </h2>
                <Badge variant="accent" size="sm">Mathematical Formulas</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary block text-sm">PSNR (Peak Signal-to-Noise Ratio)</span>
                  <p className="text-text-muted leading-relaxed">
                    Measures visual distortion in decibels (dB). PSNR &gt; 48 dB indicates that changes are imperceptible to human vision.
                  </p>
                  <div className="p-2 bg-card rounded border border-border font-mono text-[10px] text-primary">
                    PSNR = 10 · log10( MAX_I² / MSE )
                  </div>
                </div>

                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary block text-sm">SSIM (Structural Similarity Index)</span>
                  <p className="text-text-muted leading-relaxed">
                    Evaluates structural, luminance, and contrast similarity. Values near 1.0000 indicate identical image structure.
                  </p>
                  <div className="p-2 bg-card rounded border border-border font-mono text-[10px] text-success">
                    SSIM(x,y) = (2μxμy + c1)(2σxy + c2) / (...)
                  </div>
                </div>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 8: TECHNOLOGY STACK */}
          {/* =================================================== */}
          <section id="techstack" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  8. Complete Technology Architecture Reference
                </h2>
                <Badge variant="primary" size="sm">Tech Stack</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
                {[
                  { name: "Next.js 15", cat: "Frontend Framework", version: "v15.5.22" },
                  { name: "React 19", cat: "UI Library", version: "v19.0.0" },
                  { name: "TypeScript", cat: "Type System", version: "v5.7.0" },
                  { name: "Tailwind CSS", cat: "Styling Engine", version: "v3.4.1" },
                  { name: "Framer Motion", cat: "Animation Engine", version: "v12.0.0" },
                  { name: "FastAPI", cat: "Backend Gateway", version: "v0.110.0" },
                  { name: "OpenCV", cat: "Image Processing", version: "v4.9.0" },
                  { name: "PyWavelets", cat: "Wavelet Domain", version: "v1.5.0" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-background-secondary rounded-xl border border-border/60 space-y-1">
                    <span className="text-[9px] text-text-muted uppercase block">{item.cat}</span>
                    <span className="font-bold text-text-primary block text-[11px]">{item.name}</span>
                    <span className="text-[10px] text-primary block">{item.version}</span>
                  </div>
                ))}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 9: SECURITY FEATURES */}
          {/* =================================================== */}
          <section id="security" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  9. Security Features & Defense-in-Depth
                </h2>
                <Badge variant="success" size="sm">Security Audit</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" /> Morse Code Pre-Modulation
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    First layer of obfuscation mapping plaintext to symbol stream prior to cryptographic hashing.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary flex items-center gap-2">
                    <Lock className="w-4 h-4 text-secondary" /> AES-256 GCM Authenticated Encryption
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    Industry standard symmetric encryption ensuring payload confidentiality and tamper detection.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" /> Zero Plaintext Persistence
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    Messages are processed purely in-memory with automatic cache wiping post-session.
                  </p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <span className="font-bold text-text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" /> SHA-256 Carrier Verification
                  </span>
                  <p className="text-text-muted leading-relaxed">
                    Validates original carrier image hash integrity prior to steganographic bit insertion.
                  </p>
                </div>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 10: FREQUENTLY ASKED QUESTIONS (FAQ) */}
          {/* =================================================== */}
          <section id="faq" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-accent" />
                  10. Frequently Asked Questions (FAQ)
                </h2>
                <Badge variant="accent" size="sm">Q&amp;A Knowledgebase</Badge>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Why use PNG/BMP format instead of JPEG for LSB encoding?",
                    a: "PNG and BMP use lossless compression algorithms (Deflate/LZ77) which preserve exact RGB pixel bit values. JPEG uses lossy discrete cosine compression which alters pixel LSB planes and corrupts embedded payload bits.",
                  },
                  {
                    q: "What happens if an incorrect passphrase is entered during decoding?",
                    a: "AES-256 GCM authentication tag verification will fail, preventing key derivation and blocking extraction to ensure zero payload leakage.",
                  },
                  {
                    q: "Why apply Morse Code pre-modulation before AES encryption?",
                    a: "Morse code adds an initial layer of structural symbol transformation, creating an extra hurdle against spatial steg-analysis prior to cryptographic hashing.",
                  },
                  {
                    q: "Which embedding domain (LSB, DCT, DWT) should I select?",
                    a: "Use LSB for maximum payload capacity in PNG files; use DCT for web-shared images surviving JPEG compression; use DWT for high-security medical/legal images requiring PSNR > 50 dB.",
                  },
                  {
                    q: "Is any message data saved to third-party cloud servers?",
                    a: "No. The system operates strictly with zero plaintext persistence. Bitstream transformations are held in transient memory buffers.",
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full text-left font-bold text-xs sm:text-sm text-text-primary flex items-center justify-between"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 shrink-0", expandedFaq === idx && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === idx && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-text-muted pt-2 border-t border-border/50 leading-relaxed"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 11: TECHNICAL GLOSSARY */}
          {/* =================================================== */}
          <section id="glossary" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    11. Technical Glossary & Definitions
                  </h2>
                  <p className="text-xs text-text-muted">Standardized definitions of steganographic & cryptographic terms</p>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    placeholder="Filter terms..."
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-background-secondary rounded-xl border border-border/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-text-primary font-bold">{item.term}</strong>
                      <Badge variant="outline" size="sm" className="text-[9px]">{item.category}</Badge>
                    </div>
                    <p className="text-text-muted font-sans text-[11px] leading-relaxed pt-1">{item.definition}</p>
                  </div>
                ))}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 12: REFERENCES & CITATIONS */}
          {/* =================================================== */}
          <section id="references" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-secondary" />
                  12. Academic References & Specifications
                </h2>
                <Badge variant="secondary" size="sm">External Standards</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { title: "NIST FIPS PUB 197: Advanced Encryption Standard (AES)", desc: "National Institute of Standards and Technology official AES specification." },
                  { title: "IEEE Transactions on Information Forensics & Security", desc: "Academic literature on multi-domain image steganography and steganalysis." },
                  { title: "OpenCV Core Module & Discrete Fourier/Cosine Specs", desc: "Open Source Computer Vision Library 2D frequency matrix transform docs." },
                  { title: "PyWavelets (PyWt): 2D Discrete Wavelet Transform", desc: "Wavelet sub-band decomposition documentation for Python." },
                ].map((ref, idx) => (
                  <div key={idx} className="p-3.5 bg-background-secondary rounded-xl border border-border flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <strong className="text-text-primary block text-xs">{ref.title}</strong>
                      <p className="text-[11px] text-text-muted">{ref.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 13: DOWNLOAD CENTER */}
          {/* =================================================== */}
          <section id="downloads" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6 border border-primary/30 shadow-glow-blue">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  13. Documentation Asset Download Center
                </h2>
                <Badge variant="primary" size="sm">Downloads</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Button variant="outline" size="sm" onClick={() => handleDownloadToast("User Guide PDF")} leftIcon={<Download className="w-4 h-4" />}>
                  User Guide PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadToast("API Spec JSON")} leftIcon={<FileCode className="w-4 h-4" />}>
                  OpenAPI Spec
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadToast("Technical Report")} leftIcon={<FileText className="w-4 h-4" />}>
                  Technical Report
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadToast("Research Preprint")} leftIcon={<BookOpen className="w-4 h-4" />}>
                  Research Paper
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadToast("Architecture Specs")} leftIcon={<Server className="w-4 h-4" />}>
                  System Diagram
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDownloadToast("Full Documentation Suite")} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                  Full Pack (.zip)
                </Button>
              </div>
            </ContentWrapper>
          </section>

          {/* =================================================== */}
          {/* SECTION 14: CONTACT & SUPPORT */}
          {/* =================================================== */}
          <section id="support" className="space-y-4 scroll-mt-24">
            <ContentWrapper variant="glass" padding="lg" className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  14. Contact, Support & Contributions
                </h2>
                <Badge variant="accent" size="sm">Open Source</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <Github className="w-5 h-5 text-primary" />
                  <strong className="text-text-primary block">GitHub Repository</strong>
                  <p className="text-text-muted text-[11px]">View project source code, report bugs, and submit pull requests.</p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <HelpCircle className="w-5 h-5 text-secondary" />
                  <strong className="text-text-primary block">Issue Tracker</strong>
                  <p className="text-text-muted text-[11px]">Submit feature suggestions and operational bug reports.</p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border space-y-2">
                  <Mail className="w-5 h-5 text-success" />
                  <strong className="text-text-primary block">Research Support</strong>
                  <p className="text-text-muted text-[11px]">Contact core security research contributors for academic collaboration.</p>
                </div>
              </div>
            </ContentWrapper>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

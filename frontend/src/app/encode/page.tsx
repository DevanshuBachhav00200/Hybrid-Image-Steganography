"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Lock,
  UploadCloud,
  FileImage,
  Key,
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  FileText,
  Radio,
  Binary,
  Cpu,
  Check,
  X,
  Maximize2,
  HardDrive,
  Grid,
  Hash,
  Sliders,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, PasswordInput, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Slider } from "@/components/ui/Slider";
import { Tooltip } from "@/components/ui/Tooltip";
import { useToast } from "@/components/feedback/Toast";
import { FormField } from "@/components/forms/FormField";
import { DragDropZone } from "@/components/upload/DragDropZone";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";

export default function EncodePage() {
  const { toast } = useToast();

  // Local UI States (Strictly Frontend Local State)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState({
    name: "carrier_specimen_v2.png",
    size: 4194304, // 4 MB
    dimensions: "1920 × 1080 px",
    resolution: "2.07 Megapixels",
    colorChannels: "24-bit RGB",
    maxCapacityKB: 245.7,
  });

  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState<"lsb" | "dct" | "dwt">("lsb");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [isEncodingLoading, setIsEncodingLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Advanced Settings UI States
  const [compressionMode, setCompressionMode] = useState("zlib");
  const [cipherMode, setCipherMode] = useState("gcm");
  const [qualityValue, setQualityValue] = useState(95);
  const [stripExif, setStripExif] = useState(true);
  const [outputFilename, setOutputFilename] = useState("stego_carrier_encoded.png");

  // Sample carrier image url for demonstration
  const sampleCarrierUrl =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";

  // Calculations for Message Counters
  const maxChars = 5000;
  const charCount = message.length;
  const estimatedMessageBytes = Math.round(charCount * 1.25); // Approximate Morse + AES overhead
  const capacityUsedPercent = Math.min(
    100,
    parseFloat(((estimatedMessageBytes / (fileDetails.maxCapacityKB * 1024)) * 100).toFixed(2))
  );

  // Password Strength Calculation (UI State)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-border text-text-muted" };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score: 25, label: "Weak", color: "bg-danger text-danger" };
    if (score <= 50) return { score: 50, label: "Medium", color: "bg-warning text-warning" };
    if (score <= 75) return { score: 75, label: "Strong", color: "bg-primary text-primary" };
    return { score: 100, label: "Enterprise Cyber", color: "bg-success text-success" };
  };

  const passStrength = getPasswordStrength(password);

  // Reset Handler
  const handleReset = () => {
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setSelectedAlgo("lsb");
    setUploadedImage(null);
    toast({ title: "Parameters Reset", message: "Form input fields cleared.", type: "info" });
  };

  // Sample Carrier Load Handler
  const handleLoadSample = () => {
    setUploadedImage(sampleCarrierUrl);
    toast({
      title: "Sample Carrier Loaded",
      message: "High resolution 1920×1080 specimen image loaded.",
      type: "success",
    });
  };

  // Encode Trigger Handler (UI Simulation)
  const handleSimulateEncode = () => {
    if (!uploadedImage) {
      toast({ title: "Carrier Image Required", message: "Please upload or select a carrier image first.", type: "danger" });
      return;
    }
    if (!message) {
      toast({ title: "Secret Message Required", message: "Please enter secret text to encode.", type: "danger" });
      return;
    }
    if (!password || password !== confirmPassword) {
      toast({ title: "Password Mismatch", message: "Passwords must match and meet minimum requirements.", type: "danger" });
      return;
    }

    setIsEncodingLoading(true);
    setTimeout(() => {
      setIsEncodingLoading(false);
      toast({
        title: "Encoding Simulation Complete",
        message: `Secret message embedded using ${selectedAlgo.toUpperCase()} algorithm.`,
        type: "success",
      });
    }, 1200);
  };

  // Algorithm metadata details
  const algorithms = [
    {
      id: "lsb",
      name: "LSB (Least Significant Bit)",
      domain: "Spatial Domain",
      description: "Embeds secret bitstream directly into spatial RGB pixel LSB planes.",
      advantages: ["Maximum payload capacity (>25%)", "Zero computational latency", "High visual fidelity"],
      disadvantages: ["Sensitive to lossy JPEG compression", "Susceptible to spatial steganalysis"],
      recommendedBadge: "Recommended for PNG / BMP",
      icon: Layers,
    },
    {
      id: "dct",
      name: "DCT (Discrete Cosine Transform)",
      domain: "Frequency Domain",
      description: "Modifies mid-frequency cosine transform coefficients in 8x8 blocks.",
      advantages: ["Resistant to JPEG lossy compression", "High spatial stability", "Cropping resistance"],
      disadvantages: ["Medium payload capacity (~10%)", "Requires block transformation"],
      recommendedBadge: "Recommended for Web Sharing",
      icon: Cpu,
    },
    {
      id: "dwt",
      name: "DWT (Discrete Wavelet Transform)",
      domain: "Wavelet Domain",
      description: "Decomposes image into frequency sub-bands (LL, LH, HL, HH).",
      advantages: ["Superior signal noise resistance", "Highest PSNR ratio (>50dB)", "Multi-resolution stealth"],
      disadvantages: ["Higher mathematical complexity", "Lower capacity than LSB"],
      recommendedBadge: "Recommended for Max Security",
      icon: Shield,
    },
  ];

  return (
    <PageContainer size="xl" className="space-y-8 pb-16">
      {/* =================================================== */}
      {/* SECTION 1: PAGE HEADER & BREADCRUMBS */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "Encode Secret Message" }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-glow-blue">
                <Layers className="w-6 h-6" />
              </div>
              Encode Secret Message
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              Securely hide confidential information inside digital images using Morse Code pre-modulation, AES-256 GCM encryption, and multi-domain steganography.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Reset Form
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLoadSample} leftIcon={<Download className="w-4 h-4" />}>
              Load Sample Carrier
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* MAIN DESKTOP SPLIT PANEL LAYOUT (40% / 60%) */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =================================================== */}
        {/* LEFT PANEL (40% - 5 Columns) */}
        {/* =================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION 2: IMAGE UPLOAD & PREVIEW CARD */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileImage className="w-4 h-4 text-primary" />
                Carrier Image Selection
              </h3>
              <Badge variant="primary" size="sm">Step 1</Badge>
            </div>

            {!uploadedImage ? (
              <DragDropZone
                onFileSelect={(file) => {
                  const url = URL.createObjectURL(file);
                  setUploadedImage(url);
                  setFileDetails((prev) => ({
                    ...prev,
                    name: file.name,
                    size: file.size,
                  }));
                  toast({ title: "Carrier Image Selected", message: file.name, type: "success" });
                }}
                accept="image/png, image/bmp"
                maxSizeMB={10}
              />
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-primary/40 bg-background-secondary shadow-glow-blue group">
                  {/* eslint-disable-next-next/no-img-element */}
                  <img
                    src={uploadedImage}
                    alt="Carrier Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Maximize2 className="w-4 h-4" />}
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      Zoom View
                    </Button>
                  </div>
                  <Badge variant="accent" size="sm" className="absolute top-2 left-2">
                    Active Carrier
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleLoadSample}
                    leftIcon={<FileImage className="w-4 h-4" />}
                  >
                    Replace Image
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setUploadedImage(null);
                      toast({ title: "Carrier Removed", message: "Image cleared from session.", type: "warning" });
                    }}
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <div className="p-3 bg-background-secondary/80 border border-border/60 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Supported Formats:</span>
                <span className="font-mono text-text-primary font-bold">PNG, BMP (Lossless)</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Maximum File Size:</span>
                <span className="font-mono text-text-primary font-bold">10 MB</span>
              </div>
            </div>
          </ContentWrapper>

          {/* SECTION 3: IMAGE INFORMATION & CAPACITY CARD */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                Carrier Specifications & Capacity
              </h3>
              <Badge variant="accent" size="sm">Specifications</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block font-mono">Image Name</span>
                <span className="font-mono text-text-primary font-bold truncate block">{fileDetails.name}</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block font-mono">Dimensions</span>
                <span className="font-mono text-text-primary font-bold block">{fileDetails.dimensions}</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block font-mono">File Size</span>
                <span className="font-mono text-text-primary font-bold block">{formatBytes(fileDetails.size)}</span>
              </div>
              <div className="p-3 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block font-mono">Color Channels</span>
                <span className="font-mono text-text-primary font-bold block">{fileDetails.colorChannels}</span>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Estimated Stego Payload Capacity</span>
                <span className="font-mono font-bold text-primary">{fileDetails.maxCapacityKB} KB</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Calculated assuming 1 bit substitution per RGB pixel byte at PSNR &gt; 48 dB threshold.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                Algorithm Compatibility
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="px-2.5 py-1 rounded bg-success/15 border border-success/30 text-success font-bold">
                  LSB (100% Compatible)
                </span>
                <span className="px-2.5 py-1 rounded bg-primary/15 border border-primary/30 text-primary font-bold">
                  DWT (95% Compatible)
                </span>
                <span className="px-2.5 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary font-bold">
                  DCT (85% Compatible)
                </span>
              </div>
            </div>
          </ContentWrapper>
        </div>

        {/* =================================================== */}
        {/* RIGHT PANEL (60% - 7 Columns) */}
        {/* =================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 4: SECRET MESSAGE INPUT */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Secret Message Payload Input
              </h3>
              <Badge variant="primary" size="sm">Step 2</Badge>
            </div>

            <FormField
              label="Confidential Plaintext Payload"
              helperText={`Character Count: ${charCount} / ${maxChars} | Est. Size: ${estimatedMessageBytes} Bytes`}
              required
            >
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                placeholder="Type or paste your secret message here..."
                rows={4}
                className="font-mono text-xs"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3 p-3 bg-background-secondary rounded-xl border border-border/60 text-xs font-mono">
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Capacity Used</span>
                <span className={cn("font-bold", capacityUsedPercent > 90 ? "text-danger" : "text-primary")}>
                  {capacityUsedPercent}%
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Payload Status</span>
                <span className="font-bold text-success">
                  {charCount === 0 ? "Empty" : capacityUsedPercent < 100 ? "Within Bounds" : "Exceeds Limit"}
                </span>
              </div>
            </div>
          </ContentWrapper>

          {/* SECTION 5: PASSWORD & SECURITY CONFIGURATION */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-secondary" />
                AES-256 Key Derivation & Passphrase
              </h3>
              <Badge variant="secondary" size="sm">Step 3</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Encryption Passphrase" required>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure passphrase..."
                />
              </FormField>

              <FormField label="Confirm Passphrase" required>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter passphrase..."
                />
              </FormField>
            </div>

            {/* Password Strength Meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">Password Strength Rating:</span>
                <span className={cn("font-mono font-bold px-2 py-0.5 rounded text-[10px]", passStrength.color)}>
                  {passStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-background-secondary rounded-full overflow-hidden border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passStrength.score}%` }}
                  transition={{ duration: 0.3 }}
                  className={cn("h-full", passStrength.score <= 25 ? "bg-danger" : passStrength.score <= 50 ? "bg-warning" : passStrength.score <= 75 ? "bg-primary" : "bg-success")}
                />
              </div>
            </div>

            {/* Security Rules Checklist */}
            <div className="p-3 bg-background-secondary/80 border border-border/60 rounded-xl space-y-1.5 text-xs text-text-muted">
              <span className="font-semibold text-text-primary text-[11px] block">Passphrase Criteria:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className={cn("flex items-center gap-1.5", password.length >= 8 ? "text-success" : "text-text-muted")}>
                  <Check className="w-3.5 h-3.5" /> At least 8 characters
                </span>
                <span className={cn("flex items-center gap-1.5", /[0-9]/.test(password) ? "text-success" : "text-text-muted")}>
                  <Check className="w-3.5 h-3.5" /> Includes numbers
                </span>
                <span className={cn("flex items-center gap-1.5", /[^A-Za-z0-9]/.test(password) ? "text-success" : "text-text-muted")}>
                  <Check className="w-3.5 h-3.5" /> Includes symbols
                </span>
                <span className={cn("flex items-center gap-1.5", password && password === confirmPassword ? "text-success" : "text-text-muted")}>
                  <Check className="w-3.5 h-3.5" /> Passwords match
                </span>
              </div>
            </div>
          </ContentWrapper>

          {/* SECTION 6: ALGORITHM SELECTION CARDS */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Steganographic Algorithm Selection
              </h3>
              <Badge variant="accent" size="sm">Step 4</Badge>
            </div>

            <div className="space-y-3">
              {algorithms.map((algo) => {
                const Icon = algo.icon;
                const isSelected = selectedAlgo === algo.id;
                return (
                  <motion.div
                    key={algo.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAlgo(algo.id as "lsb" | "dct" | "dwt")}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-3 relative select-none",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow-blue"
                        : "border-border hover:border-border-hover bg-background-secondary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-lg border", isSelected ? "bg-primary text-white border-primary-light" : "bg-card text-text-muted border-border")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                            {algo.name}
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </h4>
                          <span className="text-[10px] font-mono text-text-muted uppercase">{algo.domain}</span>
                        </div>
                      </div>
                      <Badge variant={isSelected ? "primary" : "outline"} size="sm">
                        {algo.recommendedBadge}
                      </Badge>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">{algo.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="space-y-1">
                        <span className="font-semibold text-success block">Advantages:</span>
                        <ul className="space-y-0.5 text-text-secondary">
                          {algo.advantages.map((adv, aI) => (
                            <li key={aI} className="flex items-center gap-1">
                              <span className="text-success font-bold">+</span> {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-danger block">Disadvantages:</span>
                        <ul className="space-y-0.5 text-text-muted">
                          {algo.disadvantages.map((dis, dI) => (
                            <li key={dI} className="flex items-center gap-1">
                              <span className="text-danger font-bold">-</span> {dis}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ContentWrapper>

          {/* SECTION 7: ADVANCED SETTINGS ACCORDION */}
          <ContentWrapper variant="glass" padding="none" className="overflow-hidden border border-border">
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full p-4 flex items-center justify-between text-sm font-bold text-text-primary hover:bg-card-hover/80 transition-colors select-none"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-text-muted" />
                Advanced Parameter Settings & Placeholders
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", accordionOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {accordionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 border-t border-border/70 space-y-4 bg-background-secondary/40"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Payload Pre-Compression">
                      <Select
                        value={compressionMode}
                        onChange={(e) => setCompressionMode(e.target.value)}
                        options={[
                          { value: "zlib", label: "Zlib Compression (Default)" },
                          { value: "bzip2", label: "Bzip2 High Compression" },
                          { value: "none", label: "No Compression" },
                        ]}
                      />
                    </FormField>

                    <FormField label="AES Cipher Block Mode">
                      <Select
                        value={cipherMode}
                        onChange={(e) => setCipherMode(e.target.value)}
                        options={[
                          { value: "gcm", label: "Galois/Counter Mode (GCM)" },
                          { value: "cbc", label: "Cipher Block Chaining (CBC)" },
                        ]}
                      />
                    </FormField>
                  </div>

                  <Slider
                    label="Target Image Quality Threshold"
                    value={qualityValue}
                    onChange={(e) => setQualityValue(Number(e.target.value))}
                    valueDisplay={`${qualityValue}% Quality`}
                  />

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                    <Checkbox
                      checked={stripExif}
                      onChange={(e) => setStripExif(e.target.checked)}
                      label="Strip EXIF & Camera Metadata"
                      description="Removes location & camera signatures for privacy"
                    />

                    <FormField label="Output Image Name" className="sm:max-w-xs">
                      <Input
                        value={outputFilename}
                        onChange={(e) => setOutputFilename(e.target.value)}
                        className="font-mono text-xs"
                      />
                    </FormField>
                  </div>

                  <div className="p-3 bg-card rounded-xl border border-border/70 text-[11px] font-mono space-y-1">
                    <span className="text-primary font-bold block">Payload Hex Preview (Simulated Bitstream):</span>
                    <p className="text-text-muted truncate">
                      4d 4f 52 53 45 5f 41 45 53 5f 32 35 36 5f 47 43 4d 5f 53 54 45 47 4f
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ContentWrapper>

          {/* SECTION 8: ENCODING LIVE SUMMARY CARD */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4 border border-primary/30 shadow-glow-blue">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Live Encoding Parameter Summary
              </h3>
              <Badge variant="success" dot size="sm">Configuration Ready</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Message Length</span>
                <span className="font-bold text-text-primary">{charCount} Chars</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Est. Payload</span>
                <span className="font-bold text-accent">{estimatedMessageBytes} Bytes</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Algorithm</span>
                <span className="font-bold text-primary">{selectedAlgo.toUpperCase()}</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Est. Runtime</span>
                <span className="font-bold text-warning">~140 ms</span>
              </div>
            </div>

            <div className="p-3 bg-background-secondary/90 rounded-xl border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <span>Security Rating: <strong className="text-text-primary">AES-256 GCM + Morse Double Layer</strong></span>
              </div>
              <span className="font-mono text-text-muted text-[11px]">Format: PNG (24-bit RGB)</span>
            </div>
          </ContentWrapper>

          {/* SECTION 9: ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={handleLoadSample} leftIcon={<Download className="w-4 h-4" />}>
              Download Sample Carrier
            </Button>
            <Button variant="outline" size="md" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Reset Parameters
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSimulateEncode}
              isLoading={isEncodingLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Encode Image
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 10: HOW ENCODING WORKS (VISUAL PIPELINE) */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              How Steganographic Encoding Works
            </h2>
            <p className="text-xs text-text-muted">
              Step-by-step mathematical transformation pipeline from raw text to carrier image
            </p>
          </div>
          <Badge variant="accent" size="sm">Animated Process Flow</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-center">
          {[
            { step: "1", title: "Secret Text", desc: "User inputs plaintext message", icon: FileText },
            { step: "2", title: "Morse Code", desc: "Converted to dot-dash symbols", icon: Radio },
            { step: "3", title: "AES Encryption", desc: "Encrypted with 256-bit key", icon: Lock },
            { step: "4", title: "Binary Conversion", desc: "Serialized to 8-bit array", icon: Binary },
            { step: "5", title: "Carrier Insertion", desc: "Embedded in LSB / DCT / DWT", icon: Cpu },
            { step: "6", title: "Stego Image", desc: "Final encoded output image", icon: FileImage },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2 flex flex-col items-center justify-center relative">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-text-muted font-bold">STEP {item.step}</span>
                <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                <p className="text-[10px] text-text-muted leading-tight">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </ContentWrapper>

      {/* =================================================== */}
      {/* SECTION 11: SECURITY TIPS & BEST PRACTICES */}
      {/* =================================================== */}
      <ContentWrapper variant="solid" padding="lg" className="space-y-4 border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/15 text-warning border border-warning/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Steganography Security Best Practices</h3>
            <p className="text-xs text-text-muted">Adhere to strict operational security rules when sharing encoded stego images</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">1. Strong Passphrases</span>
            <p className="text-text-muted text-[11px]">Use at least 12 characters combining numbers and symbols for AES derivation.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">2. Lossless Carriers</span>
            <p className="text-text-muted text-[11px]">Always use uncompressed PNG or BMP images to prevent bit corruption.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">3. Avoid Social Compression</span>
            <p className="text-text-muted text-[11px]">Social platforms re-compress images and strip spatial LSB payload bits.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">4. Out-of-Band Keys</span>
            <p className="text-text-muted text-[11px]">Never send passphrases in the same channel as the encoded stego carrier image.</p>
          </div>
        </div>
      </ContentWrapper>

      {/* Image Lightbox Preview Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={uploadedImage || sampleCarrierUrl}
        title="Uploaded Carrier Image Specimen"
        dimensions={fileDetails.dimensions}
      />
    </PageContainer>
  );
}

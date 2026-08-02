"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Key,
  Unlock,
  UploadCloud,
  FileImage,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
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
  Check,
  X,
  Maximize2,
  HardDrive,
  Copy,
  Terminal,
  FileCheck,
  Lock,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, PasswordInput } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";
import { DragDropZone } from "@/components/upload/DragDropZone";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";
import { useToast } from "@/components/feedback/Toast";

export default function DecodePage() {
  const { toast } = useToast();

  // Local UI States (Strictly Frontend Local State)
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState<"lsb" | "dct" | "dwt">("lsb");
  const [isExtractingLoading, setIsExtractingLoading] = useState(false);
  const [recoveredMessage, setRecoveredMessage] = useState<string | null>(null);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Stego Image File Details (Placeholder UI State)
  const [fileDetails, setFileDetails] = useState({
    name: "stego_specimen_encoded.png",
    size: 4404019, // 4.2 MB
    dimensions: "1920 × 1080 px",
    resolution: "2.07 Megapixels",
    colorChannels: "24-bit RGB",
    format: "PNG (Lossless)",
    maxCapacityKB: 245.7,
  });

  // Sample Stego Carrier URL for demonstration
  const sampleStegoUrl =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";

  // Reset Handler
  const handleReset = () => {
    setStegoImage(null);
    setPassword("");
    setSelectedAlgo("lsb");
    setRecoveredMessage(null);
    toast({ title: "Session Reset", message: "Decode workspace parameters cleared.", type: "info" });
  };

  // Sample Carrier Load Handler
  const handleLoadSampleStego = () => {
    setStegoImage(sampleStegoUrl);
    toast({
      title: "Sample Stego Loaded",
      message: "Encrypted stego specimen image loaded into decoder.",
      type: "success",
    });
  };

  // Extract Trigger Handler (UI Simulation)
  const handleSimulateExtract = () => {
    if (!stegoImage) {
      toast({ title: "Stego Image Required", message: "Please upload or select a stego carrier image first.", type: "danger" });
      return;
    }
    if (!password) {
      toast({ title: "Passphrase Required", message: "Please enter the AES decryption passphrase.", type: "danger" });
      return;
    }

    setIsExtractingLoading(true);
    setTimeout(() => {
      setIsExtractingLoading(false);
      const simulatedDecryptedPayload =
        "CONFIDENTIAL TRANSMISSION [RESTRICTED]: The multi-layer steganographic payload was extracted successfully. Morse pre-modulation decoded and AES-256 GCM authentication verified.";
      setRecoveredMessage(simulatedDecryptedPayload);
      toast({
        title: "Message Extracted Successfully",
        message: `Extracted via ${selectedAlgo.toUpperCase()} algorithm & AES-256-GCM.`,
        type: "success",
      });
    }, 1300);
  };

  // Copy to Clipboard Handler
  const handleCopyMessage = () => {
    if (!recoveredMessage) return;
    navigator.clipboard.writeText(recoveredMessage);
    toast({ title: "Copied to Clipboard", message: "Recovered message payload copied.", type: "info" });
  };

  // Download Message Text File Handler
  const handleDownloadMessage = () => {
    if (!recoveredMessage) return;
    const blob = new Blob([recoveredMessage], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_secret_message.txt";
    a.click();
    toast({ title: "File Downloaded", message: "extracted_secret_message.txt saved.", type: "success" });
  };

  // Algorithm metadata details
  const algorithms = [
    {
      id: "lsb",
      name: "LSB (Least Significant Bit)",
      domain: "Spatial Domain",
      description: "Extracts bitstream from spatial RGB pixel LSB planes.",
      recommendedUse: "RAW or PNG carrier images.",
      badge: "Spatial Extraction",
      icon: Layers,
    },
    {
      id: "dct",
      name: "DCT (Discrete Cosine Transform)",
      domain: "Frequency Domain",
      description: "Reconstructs hidden bits from 8x8 block frequency coefficients.",
      recommendedUse: "Web-shared or JPEG carrier images.",
      badge: "Frequency Extraction",
      icon: Cpu,
    },
    {
      id: "dwt",
      name: "DWT (Discrete Wavelet Transform)",
      domain: "Wavelet Domain",
      description: "Extracts payload from multi-resolution wavelet sub-bands.",
      recommendedUse: "High-security or noise-resilient images.",
      badge: "Wavelet Extraction",
      icon: Shield,
    },
  ];

  return (
    <PageContainer size="xl" className="space-y-8 pb-16">
      {/* =================================================== */}
      {/* PAGE HEADER & BREADCRUMBS */}
      {/* =================================================== */}
      <div className="glass-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <Breadcrumb items={[{ label: "Decode Hidden Message" }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary shadow-glow-purple">
                <Key className="w-6 h-6" />
              </div>
              Decode Hidden Message
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              Recover confidential messages securely from steganographic images using the correct decryption password and extraction algorithm.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Reset Session
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLoadSampleStego} leftIcon={<Download className="w-4 h-4" />}>
              Load Sample Stego
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
          {/* SECTION 1: STEGO IMAGE UPLOAD & EMPTY STATE */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileImage className="w-4 h-4 text-secondary" />
                Stego Image Input
              </h3>
              <Badge variant="secondary" size="sm">Step 1</Badge>
            </div>

            {!stegoImage ? (
              <div className="space-y-4">
                <DragDropZone
                  onFileSelect={(file) => {
                    const url = URL.createObjectURL(file);
                    setStegoImage(url);
                    setFileDetails((prev) => ({
                      ...prev,
                      name: file.name,
                      size: file.size,
                    }));
                    toast({ title: "Stego Image Selected", message: file.name, type: "success" });
                  }}
                  accept="image/png, image/bmp"
                  maxSizeMB={10}
                />

                {/* SECTION 10: EMPTY STATE GUIDANCE */}
                <div className="p-4 rounded-xl bg-background-secondary/60 border border-border/60 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-text-primary">No Stego Image Selected</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Upload an encoded PNG or BMP stego carrier image to initiate extraction.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleLoadSampleStego} className="mt-1">
                    Load Demo Specimen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-secondary/40 bg-background-secondary shadow-glow-purple group">
                  {/* eslint-disable-next-next/no-img-element */}
                  <img
                    src={stegoImage}
                    alt="Stego Preview"
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
                    Loaded Stego Carrier
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleLoadSampleStego}
                    leftIcon={<FileImage className="w-4 h-4" />}
                  >
                    Replace Image
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setStegoImage(null);
                      setRecoveredMessage(null);
                      toast({ title: "Stego Carrier Removed", message: "Image cleared from session.", type: "warning" });
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

          {/* SECTION 2: IMAGE INFORMATION & EXTRACTION STATUS */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-accent" />
                Stego Image Specifications
              </h3>
              <Badge variant={stegoImage ? "success" : "muted"} dot size="sm">
                {stegoImage ? "Ready for Extraction" : "Awaiting Image"}
              </Badge>
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

            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Detected Stego Format</span>
                <span className="font-mono font-bold text-secondary">{fileDetails.format}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-secondary/20">
                <span className="text-text-muted">Max Payload Potential</span>
                <span className="font-mono font-bold text-text-primary">{fileDetails.maxCapacityKB} KB</span>
              </div>
            </div>
          </ContentWrapper>
        </div>

        {/* =================================================== */}
        {/* RIGHT PANEL (60% - 7 Columns) */}
        {/* =================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 3: PASSWORD SECTION */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Decryption Passphrase Input
              </h3>
              <Badge variant="primary" size="sm">Step 2</Badge>
            </div>

            <FormField
              label="AES-256 Decryption Passphrase"
              tooltip="Enter the exact passphrase specified during stego image encoding"
              required
            >
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passphrase used during encoding..."
              />
            </FormField>

            <div className="p-3 bg-background-secondary/80 border border-border/60 rounded-xl flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Forgot Passphrase? <strong className="text-text-primary">Requires out-of-band key recovery</strong></span>
              </div>
              <span className="font-mono text-[10px] text-text-muted">AES-256 GCM</span>
            </div>
          </ContentWrapper>

          {/* SECTION 4: ALGORITHM SELECTION CARDS */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Extraction Algorithm Selection
              </h3>
              <Badge variant="accent" size="sm">Step 3</Badge>
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
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-2 relative select-none",
                      isSelected
                        ? "border-secondary bg-secondary/10 shadow-glow-purple"
                        : "border-border hover:border-border-hover bg-background-secondary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-lg border", isSelected ? "bg-secondary text-white border-secondary-light" : "bg-card text-text-muted border-border")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                            {algo.name}
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                          </h4>
                          <span className="text-[10px] font-mono text-text-muted uppercase">{algo.domain}</span>
                        </div>
                      </div>
                      <Badge variant={isSelected ? "secondary" : "outline"} size="sm">
                        {algo.badge}
                      </Badge>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">{algo.description}</p>

                    <div className="pt-1 text-[11px] flex items-center justify-between text-text-muted border-t border-border/40">
                      <span>Recommended Use Case:</span>
                      <strong className="text-text-primary font-mono">{algo.recommendedUse}</strong>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ContentWrapper>

          {/* SECTION 5: EXTRACTION LIVE SUMMARY PANEL */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4 border border-secondary/30 shadow-glow-purple">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Extraction Live Summary
              </h3>
              <Badge variant="success" dot size="sm">Decoder Ready</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Algorithm</span>
                <span className="font-bold text-secondary">{selectedAlgo.toUpperCase()}</span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Stego Carrier</span>
                <span className={cn("font-bold", stegoImage ? "text-success" : "text-danger")}>
                  {stegoImage ? "Loaded" : "Missing"}
                </span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Passphrase</span>
                <span className={cn("font-bold", password ? "text-success" : "text-warning")}>
                  {password ? "Entered" : "Required"}
                </span>
              </div>
              <div className="p-2.5 bg-background-secondary rounded-lg border border-border/60">
                <span className="text-[10px] text-text-muted uppercase block">Est. Runtime</span>
                <span className="font-bold text-accent">~110 ms</span>
              </div>
            </div>

            <div className="p-3 bg-background-secondary/90 rounded-xl border border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield className="w-4 h-4 text-secondary shrink-0" />
                <span>Security Protocol: <strong className="text-text-primary">AES-256 GCM + Morse De-Modulation</strong></span>
              </div>
              <span className="font-mono text-text-muted text-[11px]">Output: UTF-8 Plaintext</span>
            </div>
          </ContentWrapper>

          {/* SECTION 6: RECOVERED MESSAGE OUTPUT CARD */}
          <ContentWrapper variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-success" />
                <h3 className="text-sm font-bold text-text-primary">Recovered Confidential Message</h3>
              </div>

              <div className="flex items-center gap-2">
                {recoveredMessage && (
                  <Badge variant="success" size="sm" dot>
                    Extracted ({recoveredMessage.length} Chars)
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}>
                  {isConsoleExpanded ? "Collapse" : "Expand Console"}
                </Button>
              </div>
            </div>

            {/* Console Read-Only Output Area */}
            <div
              className={cn(
                "w-full bg-background-secondary/90 border border-border rounded-xl p-4 font-mono text-xs text-text-primary transition-all duration-300 relative space-y-3",
                isConsoleExpanded ? "min-h-[220px]" : "min-h-[140px]"
              )}
            >
              <div className="flex items-center justify-between text-[10px] text-text-muted pb-2 border-b border-border/40 select-none">
                <span>STDOUT // EXTRACTION_CONSOLE</span>
                <span>UTF-8 PLAINTEXT</span>
              </div>

              <div className="overflow-y-auto max-h-[200px] leading-relaxed">
                {recoveredMessage ? (
                  <p className="text-success font-mono font-medium animate-fadeIn">{recoveredMessage}</p>
                ) : (
                  <p className="text-text-muted font-mono italic">
                    The extracted message will appear here after successful decoding.
                  </p>
                )}
              </div>

              {recoveredMessage && (
                <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyMessage} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                    Copy Message
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownloadMessage} leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download .txt
                  </Button>
                </div>
              )}
            </div>
          </ContentWrapper>

          {/* SECTION 9: ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={handleLoadSampleStego} leftIcon={<Download className="w-4 h-4" />}>
              Download Sample Stego
            </Button>
            <Button variant="outline" size="md" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Reset Form
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSimulateExtract}
              isLoading={isExtractingLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Extract Message
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SECTION 7: DECODING WORKFLOW (VISUAL PIPELINE) */}
      {/* =================================================== */}
      <ContentWrapper variant="glass" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              How Steganographic Decoding Works
            </h2>
            <p className="text-xs text-text-muted">
              Reverse mathematical extraction pipeline from carrier image to decrypted plaintext
            </p>
          </div>
          <Badge variant="accent" size="sm">Reverse Process Flow</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          {[
            { step: "1", title: "Stego Image", desc: "Upload encoded carrier PNG/BMP", icon: FileImage },
            { step: "2", title: "Extract Binary", desc: "Extract bitstream from LSB/DCT/DWT", icon: Binary },
            { step: "3", title: "AES Decryption", desc: "Decrypt ciphertext with passphrase", icon: Lock },
            { step: "4", title: "Morse Decode", desc: "Convert dot-dash to characters", icon: Radio },
            { step: "5", title: "Recovered Text", desc: "Display confidential plaintext", icon: FileText },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-4 rounded-xl bg-background-secondary border border-border space-y-2 flex flex-col items-center justify-center relative">
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

      {/* =================================================== */}
      {/* SECTION 8: SECURITY WARNINGS & RULES */}
      {/* =================================================== */}
      <ContentWrapper variant="solid" padding="lg" className="space-y-4 border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/15 text-warning border border-warning/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Extraction Security Warnings & Protocol Rules</h3>
            <p className="text-xs text-text-muted">Avoid payload corruption during steganographic extraction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">1. Passphrase Matching</span>
            <p className="text-text-muted text-[11px]">Entering an incorrect passphrase prevents AES key derivation and recovery fails.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">2. Matching Algorithm</span>
            <p className="text-text-muted text-[11px]">Select the exact algorithm domain (LSB, DCT, DWT) specified during encoding.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">3. Avoid Image Modifications</span>
            <p className="text-text-muted text-[11px]">Do not crop, resize, or re-save stego images to prevent bit plane corruption.</p>
          </div>
          <div className="p-3 bg-card rounded-xl border border-border space-y-1">
            <span className="font-bold text-text-primary block">4. Lossless File Preservation</span>
            <p className="text-text-muted text-[11px]">Only uncompressed PNG or BMP formats preserve embedded payload bits reliably.</p>
          </div>
        </div>
      </ContentWrapper>

      {/* Image Lightbox Preview Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={stegoImage || sampleStegoUrl}
        title="Stego Carrier Image Specimen"
        dimensions={fileDetails.dimensions}
      />
    </PageContainer>
  );
}

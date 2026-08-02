"use client";

import React, { useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { Flex } from "@/components/layout/Flex";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio, RadioGroup } from "@/components/ui/Radio";
import { Switch } from "@/components/ui/Switch";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/Progress";
import { Tooltip } from "@/components/ui/Tooltip";
import { Avatar } from "@/components/ui/Avatar";
import { FormExample } from "@/components/forms/FormExample";
import { DragDropZone } from "@/components/upload/DragDropZone";
import { ImageUploadCard } from "@/components/upload/ImageUploadCard";
import { PreviewCard } from "@/components/upload/PreviewCard";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { FileInfoCard } from "@/components/upload/FileInfoCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { MetricCard } from "@/components/cards/MetricCard";
import { AlgorithmCard } from "@/components/cards/AlgorithmCard";
import { ComparisonCard } from "@/components/cards/ComparisonCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { AlertCard } from "@/components/cards/AlertCard";
import { Modal } from "@/components/feedback/Modal";
import { ConfirmationDialog } from "@/components/feedback/ConfirmationDialog";
import { ImagePreviewModal } from "@/components/feedback/ImagePreviewModal";
import { Alert } from "@/components/feedback/Alert";
import { useToast } from "@/components/feedback/Toast";
import { Tabs } from "@/components/navigation/Tabs";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Pagination } from "@/components/navigation/Pagination";
import { DropdownMenu } from "@/components/navigation/DropdownMenu";
import { ALGORITHM_METADATA } from "@/constants/design-system";

import {
  Shield,
  Layers,
  Cpu,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  Sparkles,
  Palette,
  Type,
  LayoutGrid,
  Bell,
  FolderUp,
  MoreVertical,
  Activity,
} from "lucide-react";

export default function DesignSystemCatalogPage() {
  const { toast } = useToast();
  const [selectedAlgo, setSelectedAlgo] = useState<"lsb" | "dct" | "dwt">("lsb");
  const [sliderVal, setSliderVal] = useState(65);
  const [switchVal, setSwitchVal] = useState(true);
  const [radioVal, setRadioVal] = useState("option1");
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const sampleImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80";

  const colorTokens = [
    { label: "Background", hex: "#030712", name: "--background", usage: "Main Obsidian Slate" },
    { label: "Secondary Bg", hex: "#111827", name: "--background-secondary", usage: "Panel / Sidebar" },
    { label: "Card Fill", hex: "#1F2937", name: "--card", usage: "Elevated Surfaces" },
    { label: "Borders", hex: "#374151", name: "--border", usage: "Divider / Strokes" },
    { label: "Primary Blue", hex: "#3B82F6", name: "--primary", usage: "Actions & Accents" },
    { label: "Secondary Violet", hex: "#8B5CF6", name: "--secondary", usage: "Secondary Actions" },
    { label: "Accent Cyan", hex: "#06B6D4", name: "--accent", usage: "Cyber Highlights" },
    { label: "Success Green", hex: "#10B981", name: "--success", usage: "Positive Status" },
    { label: "Warning Amber", hex: "#F59E0B", name: "--warning", usage: "Cautions" },
    { label: "Danger Red", hex: "#EF4444", name: "--danger", usage: "Errors & Destructive" },
    { label: "Text Primary", hex: "#F9FAFB", name: "--text-primary", usage: "High Contrast Headers" },
    { label: "Text Secondary", hex: "#D1D5DB", name: "--text-secondary", usage: "Body Copy" },
    { label: "Text Muted", hex: "#9CA3AF", name: "--text-muted", usage: "Labels & Captions" },
    { label: "Text Disabled", hex: "#6B7280", name: "--text-disabled", usage: "Inactive States" },
  ];

  return (
    <SidebarLayout activePath="/design-system">
      <Container size="xl" className="space-y-12 pb-16">
        {/* Header Banner */}
        <div className="glass-card border border-primary/30 rounded-2xl p-8 space-y-4 shadow-glow-blue relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <Breadcrumb items={[{ label: "Design System Showcase" }]} />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                Enterprise Design Tokens & Component Library
              </h1>
              <p className="text-sm text-text-muted mt-1 max-w-2xl">
                Phase 2A design foundation for the Hybrid Image Steganography System. Modular, accessible, and scalable across all future steganography algorithms.
              </p>
            </div>
            <Flex gap="sm" wrap>
              <Badge variant="accent" size="lg" glow>Phase 2A Active</Badge>
              <Badge variant="success" size="lg" dot>Dark Professional</Badge>
            </Flex>
          </div>
        </div>

        {/* Section 1: Color Tokens Palette */}
        <Section title="1. Color System Tokens" subtitle="Complete palette variables supporting HSL and dark mode token mappings">
          <Grid cols={4} gap="sm">
            {colorTokens.map((c) => (
              <div key={c.hex} className="glass-card border border-border rounded-xl p-3.5 space-y-3">
                <div className="h-14 rounded-lg w-full border border-white/10 shadow-inner flex items-center justify-center font-mono text-xs font-bold" style={{ backgroundColor: c.hex, color: c.hex === "#F9FAFB" || c.hex === "#D1D5DB" ? "#030712" : "#F9FAFB" }}>
                  {c.hex}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">{c.label}</h4>
                  <p className="text-[10px] text-text-muted font-mono">{c.name}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">{c.usage}</p>
                </div>
              </div>
            ))}
          </Grid>
        </Section>

        {/* Section 2: Typography Hierarchy Scale */}
        <Section title="2. Typography Scale" subtitle="Inter font scale hierarchy across headings, body, and monospace code text">
          <div className="glass-card border border-border rounded-xl p-6 space-y-6">
            <div className="space-y-4 divide-y divide-border/60">
              <div className="pt-2 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">Display (48px)</span>
                <p className="text-4xl font-extrabold tracking-tight text-text-primary flex-1">Cyber Security Research</p>
              </div>
              <div className="pt-4 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">Hero (40px)</span>
                <p className="text-3xl font-bold tracking-tight text-text-primary flex-1">Hybrid Steganography System</p>
              </div>
              <div className="pt-4 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">H1 (32px)</span>
                <p className="text-2xl font-bold text-text-primary flex-1">Multi-Domain Image Embedding</p>
              </div>
              <div className="pt-4 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">H2 (24px)</span>
                <p className="text-xl font-semibold text-text-primary flex-1">Morse Code Encryption Protocol</p>
              </div>
              <div className="pt-4 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">H3 (20px)</span>
                <p className="text-lg font-semibold text-text-primary flex-1">Discrete Cosine Transform Matrix</p>
              </div>
              <div className="pt-4 flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-mono text-text-muted w-24">Monospace (13px)</span>
                <p className="font-mono text-sm text-accent flex-1">AES-256-GCM_PAYLOAD_HASH_0x7F9A2B</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 3: Cyber Shadow & Glow Presets */}
        <Section title="3. Shadow & Cyber Glow System" subtitle="Ambient luminance glows for high-priority UI focal points">
          <Grid cols={4} gap="md">
            <div className="glass-card border border-primary/40 rounded-xl p-6 text-center space-y-2 shadow-glow-blue">
              <span className="text-xs font-mono text-primary font-bold">glow-blue</span>
              <p className="text-xs text-text-muted">Primary Active States</p>
            </div>
            <div className="glass-card border border-secondary/40 rounded-xl p-6 text-center space-y-2 shadow-glow-purple">
              <span className="text-xs font-mono text-secondary font-bold">glow-purple</span>
              <p className="text-xs text-text-muted">Secondary Highlights</p>
            </div>
            <div className="glass-card border border-accent/40 rounded-xl p-6 text-center space-y-2 shadow-glow-cyan">
              <span className="text-xs font-mono text-accent font-bold">glow-cyan</span>
              <p className="text-xs text-text-muted">Cyber Accent Badges</p>
            </div>
            <div className="glass-card border border-success/40 rounded-xl p-6 text-center space-y-2 shadow-glow-emerald">
              <span className="text-xs font-mono text-success font-bold">glow-emerald</span>
              <p className="text-xs text-text-muted">Verified Status</p>
            </div>
          </Grid>
        </Section>

        {/* Section 4: Reusable Buttons & Interactive Controls */}
        <Section title="4. Button Primitives" subtitle="Tactile spring animations, loading state variants, and icon buttons">
          <div className="glass-card border border-border rounded-xl p-6 space-y-6">
            <Flex gap="md" wrap>
              <Button variant="primary" leftIcon={<Shield className="w-4 h-4" />}>Primary Action</Button>
              <Button variant="secondary" leftIcon={<Layers className="w-4 h-4" />}>Secondary Violet</Button>
              <Button variant="accent" leftIcon={<Sparkles className="w-4 h-4" />}>Accent Cyan</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Action</Button>
              <Button variant="success">Success Action</Button>
            </Flex>

            <div className="pt-4 border-t border-border/60">
              <h4 className="text-xs font-mono text-text-muted mb-3 uppercase">Sizes & Loading States</h4>
              <Flex gap="md" align="center" wrap>
                <Button size="sm" variant="primary">Small (sm)</Button>
                <Button size="md" variant="primary">Medium (md)</Button>
                <Button size="lg" variant="primary">Large (lg)</Button>
                <Button size="md" variant="primary" isLoading>Processing</Button>
                <Button size="icon" variant="outline" title="Settings">
                  <Sliders className="w-4 h-4" />
                </Button>
              </Flex>
            </div>
          </div>
        </Section>

        {/* Section 5: Form Elements & Input Controls */}
        <Section title="5. Inputs, Controls & Validation" subtitle="Text fields, password toggles, selects, radios, checkboxes, switches, sliders & RHF integration">
          <Grid cols={2} gap="lg">
            <div className="glass-card border border-border rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Form Controls</h4>
              
              <Input placeholder="Standard Text Input..." leftIcon={<Layers className="w-4 h-4" />} />
              <PasswordInput placeholder="Secure Password Input..." />
              <Select
                placeholder="Choose embedding method"
                options={[
                  { value: "lsb", label: "LSB (Spatial Domain)" },
                  { value: "dct", label: "DCT (Frequency Domain)" },
                  { value: "dwt", label: "DWT (Wavelet Domain)" },
                ]}
              />

              <div className="pt-2 space-y-3">
                <Switch
                  checked={switchVal}
                  onChange={setSwitchVal}
                  label="Enable AES-256 Encryption"
                  description="Multi-layer cipher before embedding"
                />

                <Checkbox
                  checked={checkboxVal}
                  onChange={(e) => setCheckboxVal(e.target.checked)}
                  label="Verify image PSNR threshold > 40 dB"
                />

                <Slider
                  label="Payload Capacity Ratio"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  valueDisplay={`${sliderVal}%`}
                />
              </div>
            </div>

            {/* RHF + Zod Schema Example */}
            <FormExample />
          </Grid>
        </Section>

        {/* Section 6: File Upload UI Components */}
        <Section title="6. Upload UI Components" subtitle="Drag & drop zone, carrier upload cards, preview Lightbox cards & progress indicators">
          <Grid cols={2} gap="lg">
            <div className="space-y-4">
              <DragDropZone onFileSelect={(file) => toast({ title: "File Selected", message: file.name, type: "success" })} />
              <UploadProgress fileName="Carrier_Lena_4K.png" progress={78} speed="3.2 MB/s" />
            </div>

            <div className="space-y-4">
              <ImageUploadCard onUploadClick={() => toast({ title: "Upload Triggered", message: "Select file modal opened", type: "info" })} />
              <PreviewCard
                imageSrc={sampleImage}
                metadata={{ name: "Carrier_Sample.jpg", size: 2450123, type: "image/jpeg", dimensions: { width: 1920, height: 1080 } }}
                onPreviewClick={() => setIsImageModalOpen(true)}
                onRemove={() => toast({ title: "Removed", message: "File cleared from memory", type: "warning" })}
              />
            </div>
          </Grid>

          <FileInfoCard
            fileName="Host_Security_Vector.bmp"
            fileSize={4194304}
            fileType="image/bmp"
            resolution="2048 × 2048 px"
            capacityEst="512.0 KB Morse Payload"
          />
        </Section>

        {/* Section 7: Card Component Library */}
        <Section title="7. Cards Library" subtitle="Feature cards, KPI metric cards, algorithm selection cards, and comparison containers">
          <Grid cols={3} gap="md">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Multi-Layer Encryption"
              description="Pre-encodes data with Morse Code before applying AES-256 encryption."
              tag="Security"
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="Multi-Domain Stego"
              description="Combines LSB, DCT, and DWT algorithms for optimal capacity & robustness."
              tag="Algorithms"
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="PSNR & SSIM Analysis"
              description="Real-time statistical validation of imperceptibility and noise levels."
              tag="Analytics"
            />
          </Grid>

          <Grid cols={3} gap="md">
            <MetricCard title="Peak Signal-to-Noise" value="48.52" unit="dB" change={{ value: "+2.4 dB", positive: true }} icon={<Activity className="w-5 h-5" />} />
            <MetricCard title="Structural Similarity" value="0.9984" unit="SSIM" change={{ value: "+0.001", positive: true }} icon={<CheckCircle2 className="w-5 h-5 text-success" />} />
            <MetricCard title="Execution Time" value="142" unit="ms" change={{ value: "-18 ms", positive: true }} icon={<Cpu className="w-5 h-5 text-accent" />} />
          </Grid>

          {/* Algorithm Cards Selection */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Algorithm Selectors (Interactive State)</h4>
            <Grid cols={3} gap="md">
              {ALGORITHM_METADATA.map((algo) => (
                <AlgorithmCard
                  key={algo.id}
                  {...algo}
                  isSelected={selectedAlgo === algo.id}
                  onSelect={() => setSelectedAlgo(algo.id as "lsb" | "dct" | "dwt")}
                />
              ))}
            </Grid>
          </div>

          <ComparisonCard
            originalImage={{ src: sampleImage, label: "Original Carrier (Cover)" }}
            stegoImage={{ src: sampleImage, label: "Encoded Stego Image" }}
          />

          <Grid cols={2} gap="md">
            <InfoCard title="Morse Code Modulation Protocol" description="Morse dots and dashes are converted into high-density binary arrays prior to carrier embedding." />
            <AlertCard title="Carrier Capacity Warning" type="warning" message="Selected payload exceeds 25% of LSB spatial capacity. Consider switching to DWT." />
          </Grid>
        </Section>

        {/* Section 8: Dialogs, Modals, Toast & Alerts */}
        <Section title="8. Dialogs, Modals & Toast System" subtitle="Framer Motion backdrop modals, confirm dialogs, alerts, and toasts">
          <div className="glass-card border border-border rounded-xl p-6 space-y-4">
            <Flex gap="md" wrap>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Standard Modal</Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>Open Confirmation Dialog</Button>
              <Button variant="outline" onClick={() => setIsImageModalOpen(true)}>Open Image Lightbox</Button>
              <Button
                variant="success"
                onClick={() =>
                  toast({
                    title: "Security Verified",
                    message: "AES Key derived successfully with 256-bit entropy.",
                    type: "success",
                  })
                }
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  toast({
                    title: "Extraction Failed",
                    message: "Corrupted carrier signature detected in DCT frequency band.",
                    type: "danger",
                  })
                }
              >
                Trigger Error Toast
              </Button>
            </Flex>

            <div className="space-y-2 pt-2">
              <Alert variant="info" title="Research Architecture Notice">
                Phase 2A implements full visual layout standards. No real backend image encoding APIs are called.
              </Alert>
              <Alert variant="success" title="WCAG 2.1 AA Compliant">
                All color tokens meet strict contrast ratio standards for high legibility.
              </Alert>
            </div>
          </div>
        </Section>

        {/* Section 9: Navigation & Tabs */}
        <Section title="9. Navigation Primitives" subtitle="Tabs with Framer Motion sliding indicator, pagination, and dropdown popovers">
          <div className="glass-card border border-border rounded-xl p-6 space-y-6">
            <Tabs
              tabs={[
                { id: "tab1", label: "Spatial LSB", icon: <Layers className="w-4 h-4" />, content: <p className="text-xs text-text-muted p-4 bg-background-secondary rounded-lg">Spatial LSB embeds bits into the least significant bit plane of RGB pixels.</p> },
                { id: "tab2", label: "Frequency DCT", icon: <Cpu className="w-4 h-4" />, content: <p className="text-xs text-text-muted p-4 bg-background-secondary rounded-lg">Frequency DCT transforms 8x8 pixel blocks into cosine frequency coefficients.</p> },
                { id: "tab3", label: "Wavelet DWT", icon: <Shield className="w-4 h-4" />, content: <p className="text-xs text-text-muted p-4 bg-background-secondary rounded-lg">Wavelet DWT decomposes images into LL, LH, HL, and HH sub-bands.</p> },
              ]}
            />

            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <DropdownMenu
                trigger={<Button variant="outline" rightIcon={<MoreVertical className="w-4 h-4" />}>Quick Actions Menu</Button>}
                items={[
                  { id: "item1", label: "Export System Metrics", icon: <Activity className="w-4 h-4" />, onClick: () => toast({ title: "Exported", message: "Metrics downloaded as JSON", type: "info" }) },
                  { id: "item2", label: "Purge Session Cache", danger: true, onClick: () => toast({ title: "Purged", message: "Cache memory cleared", type: "warning" }) },
                ]}
              />

              <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
            </div>
          </div>
        </Section>
      </Container>

      {/* Modals Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Steganography System Parameter Spec"
        description="Verify system configuration before proceeding"
        footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Acknowledge</Button>}
      >
        <div className="space-y-3 text-xs text-text-secondary">
          <p>This modal is animated with Framer Motion backdrop blur and keyframe scaling.</p>
          <p className="font-mono bg-background-secondary p-3 rounded-lg border border-border">
            ALGORITHM: DWT Multi-Resolution Wavelet<br />
            CIPHER: AES-256-GCM<br />
            CARRIER FORMAT: PNG (24-bit Lossless)
          </p>
        </div>
      </Modal>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast({ title: "Confirmed", message: "Action executed successfully.", type: "danger" });
        }}
        title="Destroy Session Key?"
        message="This operation will purge the current AES-256 session key from RAM memory."
        confirmText="Destroy Key"
      />

      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={sampleImage}
        title="Carrier Image High Resolution Lightbox"
      />
    </SidebarLayout>
  );
}

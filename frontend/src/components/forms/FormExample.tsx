"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "./FormField";
import { Input, PasswordInput, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Lock, ShieldCheck, Key } from "lucide-react";

interface SampleFormValues {
  secretKey: string;
  passphrase: string;
  algorithm: string;
  notes: string;
  enableEncryption: boolean;
  agreeTerms: boolean;
}

export const FormExample: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<SampleFormValues | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SampleFormValues>({
    defaultValues: {
      secretKey: "SEC-8820-X99",
      passphrase: "",
      algorithm: "lsb",
      notes: "Steganographic payload parameters",
      enableEncryption: true,
      agreeTerms: true,
    },
  });

  const enableEncryption = watch("enableEncryption");

  const onSubmit = (data: SampleFormValues) => {
    // Pure UI state presentation demonstration only - NO API / Backend calls
    setSubmittedData(data);
  };

  return (
    <div className="bg-card/70 backdrop-blur-md border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Security & Encoding Parameters
          </h3>
          <p className="text-xs text-text-muted">
            Reusable React Hook Form layout schema with visual state validation
          </p>
        </div>
        <Badge variant="accent" dot>UI Validation Mode</Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Secret Identification Key"
          error={errors.secretKey?.message}
          tooltip="Unique encryption key prefix for session isolation"
          required
        >
          <Input
            leftIcon={<Key className="w-4 h-4" />}
            placeholder="e.g. SEC-1234"
            {...register("secretKey", { required: "Key identifier is required" })}
          />
        </FormField>

        <FormField
          label="AES Passphrase"
          error={errors.passphrase?.message}
          helperText="Requires minimum 8 characters for AES-256 derivation"
          required
        >
          <PasswordInput
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="Enter secure passphrase"
            {...register("passphrase", {
              required: "Passphrase is required",
              minLength: { value: 8, message: "Passphrase must be at least 8 characters" },
            })}
          />
        </FormField>

        <FormField label="Target Steganography Method">
          <Select
            options={[
              { value: "lsb", label: "Least Significant Bit (LSB) - Spatial" },
              { value: "dct", label: "Discrete Cosine Transform (DCT) - Frequency" },
              { value: "dwt", label: "Discrete Wavelet Transform (DWT) - Wavelet" },
            ]}
            {...register("algorithm")}
          />
        </FormField>

        <FormField label="Configuration Notes">
          <Textarea
            placeholder="Optional metadata notes..."
            {...register("notes")}
          />
        </FormField>

        <div className="pt-2 border-t border-border/50 space-y-3">
          <Switch
            checked={enableEncryption}
            onChange={(val) => setValue("enableEncryption", val)}
            label="Enable Multi-Layer AES Encryption"
            description="Pre-encrypt Morse payload before embedding into carrier image"
          />

          <Checkbox
            label="I confirm parameters adhere to security specifications"
            {...register("agreeTerms", { required: "You must confirm to proceed" })}
          />
          {errors.agreeTerms && (
            <p className="text-xs text-danger">{errors.agreeTerms.message}</p>
          )}
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setSubmittedData(null)}>
            Reset Form
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Parameters
          </Button>
        </div>
      </form>

      {submittedData && (
        <div className="mt-4 p-4 bg-background-secondary border border-primary/30 rounded-lg text-xs font-mono text-text-secondary space-y-1">
          <div className="text-primary font-semibold mb-2">Form State Verified (Client UI Only):</div>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

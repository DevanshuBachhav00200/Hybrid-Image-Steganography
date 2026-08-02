import { ReactNode } from "react";
import { ComponentVariant, ComponentSize } from "./theme";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface VariantComponentProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  dimensions?: { width: number; height: number };
  lastModified?: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: ReactNode;
  subtitle?: string;
}

export interface AlgorithmInfo {
  id: "lsb" | "dct" | "dwt";
  name: string;
  fullName: string;
  domain: string;
  description: string;
  capacityScore: number;
  robustnessScore: number;
  speedScore: number;
}

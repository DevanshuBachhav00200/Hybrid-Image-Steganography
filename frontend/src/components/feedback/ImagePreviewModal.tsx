"use client";

import React from "react";
import { Modal } from "./Modal";
import { Badge } from "@/components/ui/Badge";

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
  dimensions?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title = "Carrier Image Lightbox",
  dimensions = "1920 × 1080 px",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={title}
      description={`High resolution view • ${dimensions}`}
    >
      <div className="flex items-center justify-center p-2 bg-background-secondary/80 rounded-lg border border-border">
        {/* eslint-disable-next-next/no-img-element */}
        <img
          src={imageSrc}
          alt={title}
          className="max-h-[65vh] w-auto object-contain rounded shadow-2xl"
        />
      </div>
    </Modal>
  );
};

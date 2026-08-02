"use client";

import React from "react";
import { FileUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

export interface UploadProgressProps {
  fileName: string;
  progress: number; // 0 - 100
  status?: "uploading" | "completed" | "error";
  speed?: string;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  fileName,
  progress,
  status = "uploading",
  speed = "2.4 MB/s",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-card/90 border border-border rounded-xl p-4 space-y-2.5 shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {status === "completed" ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          ) : status === "error" ? (
            <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          ) : (
            <FileUp className="w-5 h-5 text-primary shrink-0 animate-bounce" />
          )}
          <span className="text-sm font-medium text-text-primary truncate">{fileName}</span>
        </div>

        {status === "uploading" && (
          <Badge variant="primary" size="sm" dot>
            {speed}
          </Badge>
        )}
        {status === "completed" && (
          <Badge variant="success" size="sm">
            Complete
          </Badge>
        )}
        {status === "error" && (
          <Badge variant="danger" size="sm">
            Failed
          </Badge>
        )}
      </div>

      <Progress
        value={progress}
        variant={status === "error" ? "danger" : status === "completed" ? "success" : "primary"}
        showValue
      />
    </div>
  );
};

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SkeletonHero } from "@/components/feedback/Skeletons";

export default function Loading() {
  return (
    <PageContainer size="xl" className="py-8 space-y-6">
      <SkeletonHero />
    </PageContainer>
  );
}

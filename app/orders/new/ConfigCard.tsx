"use client";

import { Card } from "@/components/ui/Card";
import { ReactNode } from "react";

interface ConfigCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function ConfigCard({ title, icon, children }: ConfigCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </Card>
  );
}

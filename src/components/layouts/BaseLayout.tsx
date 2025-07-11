
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseLayoutProps {
  children: ReactNode;
  theme?: "studio" | "tatuadores" | "navemae";
  className?: string;
}

const BaseLayout = ({ children, theme = "studio", className }: BaseLayoutProps) => {
  const themeClasses = {
    studio: "bg-gradient-to-br from-gray-50 to-gray-100",
    tatuadores: "bg-gradient-to-br from-black via-gray-900 to-red-900",
    navemae: "bg-gradient-to-br from-gray-900 via-black to-purple-900"
  };

  return (
    <div className={cn("min-h-screen", themeClasses[theme], className)}>
      {children}
    </div>
  );
};

export default BaseLayout;

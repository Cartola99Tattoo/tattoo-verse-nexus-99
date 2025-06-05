
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // 99Tattoo specific variants
        tattoo: "border-transparent bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md",
        tattooSecondary: "border-transparent bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-md",
        tattooOutline: "border-red-600 text-red-600 bg-white",
        tattooSuccess: "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md",
        tattooWarning: "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
        tattooInfo: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

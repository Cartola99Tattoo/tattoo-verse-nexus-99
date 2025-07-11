
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  variant?: "default" | "tattoo" | "tattooDark"
}>(({ className, type, variant = "default", ...props }, ref) => {
  const variants = {
    default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    tattoo: "flex h-10 w-full rounded-md border border-red-200 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus:border-red-600 focus:shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    tattooDark: "flex h-10 w-full rounded-md border border-red-300 bg-white/20 text-white placeholder-red-200 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 focus:border-red-400 focus:shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
  }

  return (
    <input
      type={type}
      className={cn(variants[variant], className)}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

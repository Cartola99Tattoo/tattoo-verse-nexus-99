
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "elevated" | "tattoo" | "tattooRed" | "tattooDark"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "rounded-lg border bg-card text-card-foreground shadow-sm",
    elevated: "rounded-lg border bg-card text-card-foreground shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1",
    tattoo: "rounded-lg border bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]",
    tattooRed: "rounded-lg border bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02]",
    tattooDark: "rounded-lg border bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
  }

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gradient" | "red" | "dark"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "flex flex-col space-y-1.5 p-6",
    gradient: "flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg",
    red: "flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg",
    dark: "flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-gray-800 to-black rounded-t-lg text-white"
  }

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

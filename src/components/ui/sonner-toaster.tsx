
import { Toaster as SonnerToaster } from "sonner";

export function SonnerToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "sonner-toast",
        duration: 3000,
        closeButton: true,
      }}
      richColors
    />
  );
}

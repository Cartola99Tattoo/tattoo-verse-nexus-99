
import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      className="sonner-toast"
      position="top-right"
      duration={3000}
      closeButton
      richColors
    />
  );
}

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
}

export default function ImageLightbox({ open, onOpenChange, src, alt }: ImageLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-2 sm:p-4 bg-black/95 border-none flex items-center justify-center">
        <VisuallyHidden><DialogTitle>Imagen ampliada</DialogTitle></VisuallyHidden>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}

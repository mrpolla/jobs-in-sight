
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(true);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className}`}
        onClick={handleImageClick}
      />
      
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="p-0 max-w-[95vw] max-h-[95vh] flex items-center justify-center bg-transparent border-none shadow-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-2 right-2 z-50 bg-black/50 rounded-full p-2 text-white" 
              onClick={() => setIsZoomed(false)}
            >
              <X size={24} />
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoomableImage;


import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ModalContent } from "./ModalContent";

interface HelpModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModalContent: React.FC<HelpModalContentProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
};

export default HelpModalContent;

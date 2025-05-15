
import React from "react";
import HelpModalContent from "./help/HelpModalContent";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  return <HelpModalContent open={open} onOpenChange={onOpenChange} />;
};

export default HelpModal;

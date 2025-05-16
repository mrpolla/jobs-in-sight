
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface WelcomeBannerProps {
  onShowHelp: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onShowHelp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen the welcome banner before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome") === "true";
    
    if (!hasSeenWelcome) {
      // Show banner after a short delay for better user experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    // Mark the banner as seen in localStorage
    localStorage.setItem("hasSeenWelcome", "true");
    setIsVisible(false);
    toast.info("You can always access help by clicking the help button in the header");
  };

  const handleShowHelp = () => {
    // Mark the banner as seen and open help modal
    localStorage.setItem("hasSeenWelcome", "true");
    setIsVisible(false);
    onShowHelp();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6 shadow-md"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-3 sm:mb-0">
              <span className="text-xl mr-2">👋</span>
              <h2 className="text-lg font-medium">Welcome to Jobs In-Sight! Need help getting started?</h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Animated arrow pointing to Help */}
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="hidden md:flex items-center text-white/90"
              >
                <span className="mr-1">Check out the Help</span>
                <ChevronRight size={16} />
              </motion.div>
              
              <Button 
                onClick={handleShowHelp}
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Show me how
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="rounded-full hover:bg-blue-500 text-white"
                aria-label="Dismiss welcome banner"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPC9zdmc+')] opacity-20 pointer-events-none"/>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBanner;

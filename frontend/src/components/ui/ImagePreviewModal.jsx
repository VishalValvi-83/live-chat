import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ImagePreviewModal({ src, isOpen, onClose }) {
    const [scale, setScale] = useState(1);

    if (!isOpen || !src) return null;

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);

            window.open(src, '_blank');
        }
    };

    return (
        <AnimatePresence onExitComplete={() => setScale(1)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={onClose}
            >

                <div className="absolute top-4 right-4 flex gap-2 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={handleZoomOut}
                        disabled={scale <= 1}
                    >
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={handleZoomIn}
                        disabled={scale >= 3}
                    >
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={handleDownload}
                    >
                        <Download className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>


                <div
                    className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.img
                        src={src}
                        alt="Preview"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: scale, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-md cursor-grab active:cursor-grabbing"
                        drag={scale > 1}
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
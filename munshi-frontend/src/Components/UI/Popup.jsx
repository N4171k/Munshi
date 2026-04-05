import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const styles = `
  .munshi-popup-backdrop {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }

  .popup-bg {
    position: absolute; inset: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .popup-modal {
    position: relative;
    width: 100%; max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    background: #13131A;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.04);
  }

  /* Custom scrollbar for popup */
  .popup-modal::-webkit-scrollbar { width: 4px; }
  .popup-modal::-webkit-scrollbar-track { background: transparent; }
  .popup-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .popup-close {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: #8A8799;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease; z-index: 10;
  }
  .popup-close:hover {
    background: rgba(255,255,255,0.09);
    color: #F0EDE6;
    border-color: rgba(255,255,255,0.14);
  }

  .popup-content { color: #F0EDE6; }

  /* Transparent/loader variant */
  .popup-transparent .popup-modal {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    max-width: none !important;
  }
`;

const Popup = ({ isOpen, onClose, children, canClose, className }) => {
    if (!isOpen) return null;

    const isTransparent = className?.includes("bg-transparent") || className?.includes("border-0");

    return (
        <AnimatePresence>
            <div className="munshi-popup-backdrop">
                <style>{styles}</style>

                {/* Backdrop */}
                <motion.div
                    className="popup-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={canClose ? onClose : undefined}
                />

                {/* Modal */}
                <motion.div
                    className={`popup-modal ${isTransparent ? "popup-transparent" : ""}`}
                    style={isTransparent ? { background: 'transparent', border: 'none', boxShadow: 'none', maxWidth: 'none' } : {}}
                    initial={{ scale: 0.96, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 12 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                    {canClose && (
                        <button className="popup-close" onClick={onClose}>
                            <X size={15} />
                        </button>
                    )}
                    <div className="popup-content">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Popup;
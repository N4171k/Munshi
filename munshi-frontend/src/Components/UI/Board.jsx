import ProfileSummary from "../BoardComponents/ProfileSummary";
import Transactions from "../BoardComponents/Transactions";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "../ChatBot/Chatbot";
import Analytics from "../BoardComponents/Analytics";
import InvestmentList from "../BoardComponents/StocksList";
import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

function AnimatedSection({ children, index = 0, className = "" }) {
    return (
        <motion.div
            custom={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: "easeInOut" }}
            className={`h-full ${className}`}
        >
            {children}
        </motion.div>
    );
}

export default function Board() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
            {/* Profile Summary */}
            <AnimatedSection index={0}>
                <ProfileSummary />
            </AnimatedSection>

            {/* Analytics + Portfolio row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="lg:col-span-8 flex flex-col h-full">
                    <AnimatedSection index={1}>
                        <Analytics />
                    </AnimatedSection>
                </div>
                <div className="lg:col-span-4 flex flex-col h-full">
                    <AnimatedSection index={2}>
                        <InvestmentList />
                    </AnimatedSection>
                </div>
            </div>

            {/* Transactions */}
            <AnimatedSection index={3}>
                <Transactions />
            </AnimatedSection>

            {/* Floating Chat Button */}
            <button
                className={`fixed bottom-7 right-7 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
                    isChatOpen 
                    ? "bg-obsidian-300 border border-white/10 text-gray-400 hover:bg-obsidian-200 hover:text-white" 
                    : "bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-100 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.35)]"
                }`}
                onClick={() => setIsChatOpen(!isChatOpen)}
                title="Munshi AI"
            >
                {isChatOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {/* Floating Chat Panel */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-[100px] right-7 z-50 w-[370px] h-[520px] bg-[#13131A] border border-white/10 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                    >
                        {/* Chat Header */}
                        <div className="px-5 py-4 border-b border-white/10 bg-[#13131A] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center text-gold-500">
                                    <Sparkles size={18} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className="font-serif text-[15px] font-bold text-[#F0EDE6] tracking-tight">Munshi AI</div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#4ADE80] font-medium mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_6px_#4ADE80]" />
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button
                                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A8799] hover:bg-white/10 hover:text-[#F0EDE6] transition-all"
                                onClick={() => setIsChatOpen(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-hidden bg-obsidian-200">
                            <Chatbot />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
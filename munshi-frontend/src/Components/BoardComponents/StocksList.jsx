import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInvestments } from "../../services/database.service";
import { setStocks } from "../../store/slices/userSlice";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export default function StocksList() {
    const investmentsData = useSelector((state) => state.user.stocks);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const getStocks = async () => {
        const response = await fetchUserInvestments();
        dispatch(setStocks(response));
    };

    useEffect(() => {
        if (user.user?.id) {
            getStocks();
        }
    }, [user.user?.id]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="flex flex-col h-full w-full bg-obsidian-200 rounded-2xl p-5 border border-gold-subtle/30">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={16} className="text-gold-500" />
                    Holdings Portfolio
                </h2>
                <div className="text-[10px] font-bold text-gold-500 bg-gold-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
                    Live
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3 custom-scrollbar overflow-y-auto max-h-[320px] pr-2"
            >
                {investmentsData && investmentsData.length > 0 ? investmentsData.map((investment, i) => (
                    <motion.div
                        variants={itemVariants}
                        key={investment.code + i}
                        className="group relative flex items-center justify-between p-4 rounded-xl bg-obsidian-200 border border-transparent hover:border-gold-500/40 hover:bg-obsidian-100 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-[0_4px_20px_rgba(212,175,55,0.08)]"
                    >
                        {/* Hover subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-400/20 transition-all duration-300">
                                <TrendingUp size={18} className="text-gold-500 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-200 flex items-center gap-1">
                                    {investment.code}
                                    <ArrowUpRight size={12} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 translate-y-1 group-hover:translate-y-0 translate-x-[-4px] group-hover:translate-x-0" />
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold group-hover:text-gold-400/70 transition-colors">Equity Asset</span>
                            </div>
                        </div>
                        <span className="font-mono text-base font-bold bg-clip-text text-transparent bg-gradient-to-br from-gold-400 to-gold-600 relative z-10 tracking-tight">
                            ₹{Number(investment.amount).toLocaleString('en-IN')}
                        </span>
                    </motion.div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-40 border border-dashed border-gold-500/20 rounded-xl bg-obsidian-100/50">
                        <TrendingUp size={28} className="text-gray-600 mb-3 opacity-50" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">No assets acquired</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

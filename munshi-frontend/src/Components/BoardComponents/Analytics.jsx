import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BarChart3, Target, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const GOLD_GRADIENTS = [
    "url(#gold1)",
    "url(#gold2)",
    "url(#gold3)",
    "url(#gold4)",
    "url(#gold5)",
    "url(#gold6)"
];

const GradientDefs = () => (
    <defs>
        <linearGradient id="gold1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5C14A" />
            <stop offset="100%" stopColor="#B5952F" />
        </linearGradient>
        <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0D880" />
            <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="gold3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C7323" />
        </linearGradient>
        <linearGradient id="gold4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C2A133" />
            <stop offset="100%" stopColor="#7A601A" />
        </linearGradient>
        <linearGradient id="gold5" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4E6A3" />
            <stop offset="100%" stopColor="#C2A133" />
        </linearGradient>
        <linearGradient id="gold6" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B5952F" />
            <stop offset="100%" stopColor="#665011" />
        </linearGradient>
    </defs>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-obsidian-200/95 border border-gold-subtle backdrop-blur-xl p-3 rounded-xl shadow-[0_4px_24px_rgba(212,175,55,0.15)] flex flex-col gap-1 z-50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {payload[0].name}
                </span>
                <span className="font-mono text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-gold-600 tracking-tight">
                    ₹{payload[0].value.toLocaleString('en-IN')}
                </span>
            </div>
        );
    }
    return null;
};

export default function Analytics() {
    const transactions = useSelector((state) => state.user?.transactions || []);
    const stocksData = useSelector((state) => state.user?.stocks || []);

    const [categoryData, setCategoryData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [investmentData, setInvestmentData] = useState([]);

    useEffect(() => {
        if (transactions.length) {
            const categoryMap = transactions.reduce((acc, txn) => {
                if (txn.type === "expense") {
                    acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
                }
                return acc;
            }, {});
            setCategoryData(Object.keys(categoryMap).map((category) => ({
                name: category, value: categoryMap[category],
            })));

            const typeMap = transactions.reduce((acc, txn) => {
                if (txn.type === "income" || txn.type === "expense") {
                    acc[txn.type] = (acc[txn.type] || 0) + Number(txn.amount);
                }
                return acc;
            }, {});
            setTypeData(Object.keys(typeMap).map((type) => ({
                name: type.charAt(0).toUpperCase() + type.slice(1),
                value: typeMap[type],
            })));
        }
    }, [transactions]);

    useEffect(() => {
        if (stocksData.length > 0) {
            const investmentMap = stocksData.reduce((acc, stock) => {
                acc[stock.code] = (acc[stock.code] || 0) + Number(stock.amount || 0);
                return acc;
            }, {});
            setInvestmentData(Object.entries(investmentMap)
                .filter(([_, value]) => value > 0)
                .map(([code, value]) => ({
                    name: code, value,
                })));
        }
    }, [stocksData]);

    const hasData = categoryData.length > 0 || typeData.length > 0 || investmentData.length > 0;

    const renderChartCard = (title, data) => {
        if (!data || data.length === 0) return null;
        
        return (
            <div className="group relative bg-obsidian-200 rounded-2xl p-5 border border-gold-subtle/30 transition-all duration-500 hover:border-gold-500/50 hover:shadow-[0_8px_32px_rgba(212,175,55,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 text-center mb-1 uppercase tracking-[0.2em] relative z-10 group-hover:text-gold-500 transition-colors">
                    {title}
                </h4>
                <div className="h-[200px] w-full relative z-10 scale-95 group-hover:scale-100 transition-transform duration-700 ease-out">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <GradientDefs />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={GOLD_GRADIENTS[index % GOLD_GRADIENTS.length]}
                                        className="transition-all duration-300 hover:opacity-80"
                                        style={{ outline: "none", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.4))" }}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Quick Intelligence Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-obsidian-200 p-4 rounded-xl border border-gold-subtle/40">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-gold-500/10 text-gold-500 animate-glow">
                        <BarChart3 size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-200 tracking-wide">Wealth Intelligence</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Analytics overview based on real-time data</p>
                    </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                        to="/expense-analysis"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-xs font-bold bg-obsidian-100 border border-gold-500/30 text-gray-300 px-4 py-2.5 rounded-lg hover:border-gold-500 hover:text-gold-500 transition-all shadow-inner hover:scale-[1.02]"
                    >
                        Deep Dive <ArrowRight size={14} />
                    </Link>
                    <Link
                        to="/saving-advice"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-100 px-4 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:scale-[1.02]"
                    >
                        <Target size={14} /> AI Advisor
                    </Link>
                </div>
            </div>

            {/* Charts Area */}
            {hasData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {renderChartCard("Expenses By Category", categoryData)}
                    {renderChartCard("Income vs Expense", typeData)}
                    {renderChartCard("Investment Distribution", investmentData)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gold-500/30 rounded-2xl bg-obsidian-200/30">
                    <BarChart3 size={32} className="text-gold-500/50 mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Insufficient Data Points</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Transact to unlock intelligence</p>
                </div>
            )}
        </div>
    );
}

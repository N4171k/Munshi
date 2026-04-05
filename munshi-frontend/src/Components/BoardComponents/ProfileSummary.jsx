import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addStockInvestment, updateUserBalance, addTransaction, fetchUserTransactions } from "../../services/database.service";
import indianStocks from "../../store/stocks";
import { setStocks, setUserData, setTransactions } from "../../store/slices/userSlice";
import { Wallet, PiggyBank, TrendingUp, Plus, X } from "lucide-react";

export default function ProfileSummary() {
    const userData = useSelector((state) => state.user.userData);
    const stocks = useSelector((state) => state.user.stocks);
    const [isInvestmentFormOpen, setIsInvestmentFormOpen] = useState(false);
    const [investment, setInvestment] = useState({ code: "TCS", amount: "0" });
    const dispatch = useDispatch();

    const getTransactions = async () => {
        const userTransactions = await fetchUserTransactions();
        dispatch(setTransactions(userTransactions));
    };

    const handleInvestmentChange = (e) => {
        const { name, value } = e.target;
        setInvestment((prev) => ({ ...prev, [name]: value }));
    };

    const handleInvestmentSubmit = async (e) => {
        e.preventDefault();
        if (Number.parseInt(investment.amount) > 0) {
            const response = await addStockInvestment(investment);
            if (response) {
                const newBalance = Number.parseInt(userData?.moneyInPocket) - Number.parseInt(investment.amount);
                const balanceResponse = await updateUserBalance(userData.id, String(newBalance));
                await addTransaction({
                    title: `Invested in ${investment.code}`,
                    amount: investment.amount,
                    category: "Investment",
                    paymentMethod: "BankTransfer",
                    type: "transfer",
                    description: "",
                    date: new Date().toISOString(),
                });
                getTransactions();
                dispatch(setStocks([...stocks, investment]));
                dispatch(setUserData(balanceResponse));
                setInvestment({ code: "", amount: "" });
                setIsInvestmentFormOpen(false);
            }
        }
        setInvestment({ code: "", amount: "" });
        setIsInvestmentFormOpen(false);
    };

    const totalInvestments = stocks.length > 0 ? stocks.reduce((sum, stock) => sum + Number(stock.amount), 0) : 0;

    const statCards = [
        { label: "Current Balance", value: Number(userData?.moneyInPocket || 0), icon: Wallet },
        { label: "Monthly Budget", value: Number(userData?.monthlyBudget || 0), icon: PiggyBank },
        { label: "Total Invested", value: totalInvestments, icon: TrendingUp },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Header row */}
            <div className="flex justify-between items-center bg-obsidian-200 p-4 rounded-xl border border-gold-subtle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-400 font-bold text-obsidian-100 flex items-center justify-center text-lg">
                        {userData?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-200 tracking-wide">Welcome back,</h2>
                        <h3 className="text-lg font-bold text-white">{userData?.name || "User"}</h3>
                    </div>
                </div>
                <button
                    onClick={() => setIsInvestmentFormOpen(true)}
                    className="group relative inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-100 px-5 py-2.5 rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <Plus size={16} strokeWidth={2.5} className="relative z-10" />
                    <span className="relative z-10 uppercase tracking-wider text-xs">New Investment</span>
                </button>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className="group relative rounded-2xl p-5 flex flex-col gap-4 bg-obsidian-200 border border-gold-subtle/50 transition-all duration-500 hover:scale-[1.02] hover:border-gold-500/80 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)]"
                        >
                            {/* Animated Background Gradient on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="flex justify-between items-start relative z-10">
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gold-400 transition-colors duration-300">
                                    {card.label}
                                </span>
                                <div className="p-2 rounded-lg bg-gold-500/10 text-gold-500 group-hover:bg-gold-500 group-hover:text-obsidian-100 transition-colors duration-300">
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                            </div>
                            
                            <div className="relative z-10 flex flex-col">
                                <span className="font-mono text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 group-hover:from-gold-400 group-hover:to-gold-600 transition-all duration-500 tracking-tight">
                                    ₹{card.value.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Custom Frosted Modal */}
            {isInvestmentFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-obsidian-200 border border-gold-500/30 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.1)] overflow-hidden animate-slide-up-fade relative">
                        <button 
                            onClick={() => setIsInvestmentFormOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 mb-6">Execute Trade</h3>
                            
                            <form onSubmit={handleInvestmentSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        Select Asset
                                    </label>
                                    <select
                                        name="code"
                                        value={investment.code}
                                        onChange={handleInvestmentChange}
                                        className="w-full bg-obsidian-100 border border-gold-500/20 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Select a stock component</option>
                                        {indianStocks.map((stock, index) => (
                                            <option key={index} value={stock.code} className="bg-obsidian-200 text-gray-200">
                                                {stock.name} ({stock.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        Principal Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={investment.amount}
                                        onChange={handleInvestmentChange}
                                        placeholder="0"
                                        className="w-full bg-obsidian-100 border border-gold-500/20 rounded-xl px-4 py-3 text-sm text-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all font-mono"
                                        required
                                    />
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsInvestmentFormOpen(false)}
                                        className="flex-1 px-4 py-3 text-xs uppercase tracking-wider font-bold border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-4 py-3 text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-100 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)]"
                                    >
                                        Confirm Trade
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

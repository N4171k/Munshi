import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Home, Lightbulb, Car, Film, UtensilsCrossed,
    Shirt, HeartPulse, PiggyBank, TrendingUp, Plus, HelpCircle, Wallet, ArrowDownLeft, ArrowUpRight
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserTransactions, addTransaction, updateUserBalance } from "../../services/database.service";
import { setTransactions, setUserData } from "../../store/slices/userSlice";
import Loader from "../UI/Loader";
import Popup from "../UI/Popup";
import TransactionForm from "./TransactionForm";

const categoryIconMap = {
    Groceries: { icon: ShoppingCart },
    Rent: { icon: Home },
    Utilities: { icon: Lightbulb },
    Transportation: { icon: Car },
    Entertainment: { icon: Film },
    Dining: { icon: UtensilsCrossed },
    Shopping: { icon: Shirt },
    Healthcare: { icon: HeartPulse },
    Savings: { icon: PiggyBank },
    Investment: { icon: TrendingUp },
    Income: { icon: Wallet },
    Others: { icon: HelpCircle },
};

function Transaction({ transaction }) {
    const isPositive = transaction.type === 'income' || transaction.type === 'refund';
    const catInfo = categoryIconMap[transaction.category] || { icon: HelpCircle };
    const Icon = catInfo.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group flex items-center justify-between py-4 px-3 border-b border-gold-subtle/20 last:border-0 hover:bg-obsidian-100 rounded-xl transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-obsidian-300 shadow-inner border border-white/5 relative group-hover:border-gold-500/30 transition-all">
                    {isPositive ? (
                        <ArrowUpRight size={14} className="absolute top-1 right-1 text-gold-500" />
                    ) : (
                        <ArrowDownLeft size={14} className="absolute bottom-1 left-1 text-red-400" />
                    )}
                    <Icon size={18} className="text-gray-300 group-hover:text-gold-400 transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{transaction.title}</h3>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 flex gap-2 items-center mt-0.5">
                        <span className="text-gold-500/70">{transaction.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" /> 
                        <span>{transaction.paymentMethod}</span>
                    </p>
                </div>
            </div>
            <div className="text-right flex flex-col items-end flex-shrink-0 ml-4 relative z-10">
                <span className={`font-mono text-base font-bold tracking-tight ${isPositive ? 'text-gold-500 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-red-400'}`}>
                    {isPositive ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] uppercase font-bold text-gray-600 mt-1 tracking-widest">{new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
            </div>
        </motion.div>
    );
}

export default function Transactions() {
    const user = useSelector((state) => state.user);
    const transactions = useSelector((state) => state.user?.transactions);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [error, setError] = useState(null);

    const getTransactions = async () => {
        setIsLoading(true);
        const userTransactions = await fetchUserTransactions();
        if (!userTransactions) { setError(true); return; }
        dispatch(setTransactions(userTransactions));
        setIsLoading(false);
    };

    useEffect(() => {
        if (user.user?.id) {
            getTransactions();
        }
    }, [user.user?.id]);

    async function handleUpdateBalance(transactionData) {
        let newBalance = 0;
        if (transactionData.type === "income" || transactionData.type === "refund") {
            newBalance = Number.parseInt(user.userData?.moneyInPocket) + Number.parseInt(transactionData.amount);
        } else {
            newBalance = Number.parseInt(user.userData?.moneyInPocket) - Number.parseInt(transactionData.amount);
        }
        const response = await updateUserBalance(user.userData.id, String(newBalance));
        if (!response) return false;
        return response;
    }

    async function handleAddTransactions(transactionData) {
        setIsLoading(true);
        const response = await addTransaction(transactionData);
        if (!response) return;
        const newUserData = await handleUpdateBalance(transactionData);
        getTransactions();
        if (newUserData) dispatch(setUserData(newUserData));
        setIsLoading(false);
        setIsFormOpen(false);
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-40 text-xs font-bold uppercase tracking-widest text-red-400 bg-obsidian-200/50 rounded-2xl border border-red-500/20">
                Failed to load ledger
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full w-full flex justify-center items-center py-12">
                <Loader fill="var(--color-gold-500)" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-obsidian-200 rounded-2xl p-5 border border-gold-subtle/30">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={16} className="text-gold-500" />
                    Ledger
                </h2>
                <div className="text-[10px] font-bold text-obsidian-100 bg-gold-500 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    {transactions?.length || 0} Records
                </div>
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {transactions && transactions.length > 0 ? transactions.map((txn) => (
                        <Transaction key={txn.id} transaction={txn} />
                    )) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-gold-500/20 rounded-xl bg-obsidian-100/50"
                        >
                            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Ledger is empty</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={() => setIsFormOpen(true)}
                className="mt-6 flex items-center justify-center w-full bg-obsidian-300 border-2 border-dashed border-gold-subtle text-gray-400 px-4 py-3.5 rounded-xl hover:bg-obsidian-100 hover:border-gold-500 hover:text-gold-400 transition-all font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] group"
            >
                <Plus size={16} strokeWidth={3} className="mr-2 group-hover:scale-125 transition-transform text-gold-500" />
                Add Entry
            </button>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-obsidian-200 border border-gold-500/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden animate-slide-up-fade">
                        <TransactionForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddTransactions} />
                    </div>
                </div>
            )}
        </div>
    );
}

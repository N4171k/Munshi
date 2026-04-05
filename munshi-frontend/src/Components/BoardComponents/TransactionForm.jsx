import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const defaultPaymentMethods = ["Cash", "UPI", "CreditCard", "BankTransfer", "Check"];
const transactionTypes = ["income", "expense", "transfer"];

const TransactionForm = ({ onSubmit, onClose }) => {
    const [transactionData, setTransactionData] = useState({
        title: "",
        amount: "",
        category: "Others",
        paymentMethod: "Cash",
        type: "expense",
        description: "",
        date: "",
    });

    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState(defaultPaymentMethods);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (transactionData.type === "expense") {
            setCategories(["Groceries", "Rent", "Utilities", "Transportation", "Entertainment", "Dining", "Shopping", "Healthcare", "Others"]);
            setPaymentMethods(["Cash", "UPI", "CreditCard", "BankTransfer", "Check"]);
        } else if (transactionData.type === "income") {
            setCategories(["Income"]);
            setPaymentMethods(["Cash", "UPI", "BankTransfer", "Check"]);
        } else {
            setCategories(["Savings", "Investment"]);
            setPaymentMethods(["BankTransfer", "Check"]);
        }
    }, [transactionData.type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(transactionData);
    };

    return (
        <div className="w-full h-full relative">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-100 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110 z-10"
            >
                <X size={16} />
            </button>

            <div className="p-8">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 mb-8 border-b border-gold-500/20 pb-4">
                    New Entry
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={transactionData.title}
                            onChange={handleChange}
                            className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-gray-200 transition-all outline-none shadow-inner"
                            placeholder="e.g., Tesla Stock, Michelin Star Dinner..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Amount */}
                        <div>
                            <label htmlFor="amount" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                min={0}
                                value={transactionData.amount}
                                onChange={handleChange}
                                className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 font-mono text-sm text-gray-200 transition-all outline-none shadow-inner"
                                placeholder="₹0"
                                required
                            />
                        </div>
                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={transactionData.date}
                                onChange={handleChange}
                                className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 font-mono text-sm text-gray-200 transition-all outline-none shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    {/* Type - pill buttons */}
                    <div className="bg-obsidian-300 p-1.5 rounded-xl border border-obsidian-100 shadow-inner">
                        <div className="flex gap-1 relative">
                            {transactionTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setTransactionData(prev => ({ ...prev, type, category: "" }))}
                                    className={`relative flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 z-10 ${
                                        transactionData.type === type
                                            ? 'text-obsidian-100 bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-obsidian-100/50'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={transactionData.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-gray-200 appearance-none transition-all outline-none shadow-inner cursor-pointer"
                            >
                                <option value="" disabled>Select Segment</option>
                                {categories.map((category) => (
                                    <option key={category} value={category} className="bg-obsidian-200 text-gray-200">{category}</option>
                                ))}
                            </select>
                        </div>
                        {/* Payment Method */}
                        <div>
                            <label htmlFor="paymentMethod" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Payment</label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={transactionData.paymentMethod}
                                onChange={handleChange}
                                className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-gray-200 appearance-none transition-all outline-none shadow-inner cursor-pointer"
                            >
                                {paymentMethods.map((method) => (
                                    <option key={method} value={method} className="bg-obsidian-200 text-gray-200">{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">Note (Optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={transactionData.description}
                            onChange={handleChange}
                            className="w-full p-3 bg-obsidian-100 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-gray-200 min-h-[80px] resize-none transition-all outline-none shadow-inner"
                            placeholder="Elaborate on this transaction..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gold-500/10">
                        <button
                            type="button"
                            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 border border-obsidian-100 bg-obsidian-300 rounded-xl hover:bg-obsidian-100 transition-colors"
                            onClick={onClose}
                        >
                            Dismiss
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-100 rounded-xl hover:brightness-110 shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] transition-all"
                        >
                            Log Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;

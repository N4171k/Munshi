import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ProfileForm({ onClose, onSubmit, initialData = {} }) {
    const [dob, setDob] = useState(initialData.dob || "");
    const [monthlyIncome, setMonthlyIncome] = useState(initialData.monthlyIncome || "");
    const [monthlyBudget, setMonthlyBudget] = useState(initialData.monthlyBudget || "");
    const [type, setType] = useState(initialData.type || "Student");
    const [moneyInPocket, setMoneyInPocket] = useState(initialData.moneyInPocket || "");
    const [additionalInfo, setAdditionalInfo] = useState(initialData.additionalInfo || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ dob, monthlyIncome, monthlyBudget, type, moneyInPocket, additionalInfo });
        onClose();
    };

    const inputClasses = "w-full p-2.5 bg-[#0D0D10] border border-[rgba(255,255,255,0.06)] rounded-lg focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm text-[#F0EDE6] outline-none transition-all";
    const labelClasses = "text-[10px] font-semibold uppercase tracking-wider text-[#8A8799] mb-1.5 block";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full px-6 sm:px-8 py-8 mx-auto bg-[#13131A] text-[#F0EDE6] rounded-2xl relative border border-[rgba(201,168,76,0.15)] shadow-2xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)] transition-all text-[#8A8799] hover:text-[#F0EDE6]"
            >
                <X size={16} />
            </button>

            <div className="text-center mb-7 mt-2">
                <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">👤</span>
                </div>
                <h2 className="text-xl font-bold text-[#F0EDE6] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {initialData.type ? "Edit Your Profile" : "Complete Your Profile"}
                </h2>
                <p className="text-xs text-[#8A8799] mt-1.5">
                    {initialData.type ? "Update your financial constraints and profile" : "Help us personalize your financial dashboard"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={labelClasses}>Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                        className={`${inputClasses} font-mono`}
                        style={{ colorScheme: "dark" }}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Monthly Income</label>
                        <input
                            type="number"
                            min={0}
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(e.target.value)}
                            required
                            placeholder="₹0"
                            className={`${inputClasses} font-mono`}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Monthly Budget</label>
                        <input
                            type="number"
                            min={0}
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(e.target.value)}
                            required
                            placeholder="₹0"
                            className={`${inputClasses} font-mono`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Current Balance</label>
                        <input
                            type="number"
                            value={moneyInPocket}
                            min={0}
                            onChange={(e) => setMoneyInPocket(e.target.value)}
                            required
                            placeholder="₹0"
                            className={`${inputClasses} font-mono`}
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Profile Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className={`${inputClasses}`}
                        >
                            <option value="Student">Student</option>
                            <option value="Employee">Employee</option>
                            <option value="Businessman">Businessman</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Additional Info (Optional)</label>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Goals, upcoming expenses, or anything useful..."
                        className={`${inputClasses} min-h-[80px] resize-none`}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 bg-[#C9A84C] text-[#0D0D10] px-6 py-3 rounded-xl font-semibold text-[13px] hover:bg-[#E8C97A] transition-all shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transform hover:-translate-y-0.5"
                >
                    {initialData.type ? "Save Profile" : "Save & Continue"}
                </button>
            </form>
        </motion.div>
    );
}

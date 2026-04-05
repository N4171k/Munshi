import React, { useEffect, useState } from "react";
import { Pie, Radar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const COLORS = [
    "#00B386", "#2C74F6", "#7C3AED", "#EB5B3C",
    "#F59E0B", "#EC4899", "#06B6D4",
];
const TYPE_COLORS = { expense: "#EB5B3C", income: "#00B386" };

export default function Analytics() {
    const transactions = useSelector((state) => state.user?.transactions || []);
    const stocksData = useSelector((state) => state.user?.stocks || []);
    const userCash = useSelector((state) => Number(state.user?.user?.moneyInPocket) || 0);

    const [categoryData, setCategoryData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [investmentData, setInvestmentData] = useState([]);
    const [radarChartData, setRadarChartData] = useState(null);

    useEffect(() => {
        if (transactions.length) {
            const categoryMap = transactions.reduce((acc, txn) => {
                if (txn.type === "expense") {
                    acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
                }
                return acc;
            }, {});
            const formattedCategoryData = Object.keys(categoryMap).map((category, index) => ({
                name: category,
                value: categoryMap[category],
                color: COLORS[index % COLORS.length],
            }));
            setCategoryData(formattedCategoryData);

            const typeMap = transactions.reduce(
                (acc, txn) => {
                    acc[txn.type] += Number(txn.amount);
                    return acc;
                },
                { expense: 0, income: 0 }
            );
            const formattedTypeData = Object.keys(typeMap).map((type) => ({
                name: type.charAt(0).toUpperCase() + type.slice(1),
                value: typeMap[type],
                color: TYPE_COLORS[type],
            }));
            setTypeData(formattedTypeData);
        }
    }, [transactions]);

    useEffect(() => {
        if (stocksData.length > 0) {
            const investmentMap = stocksData.reduce((acc, stock) => {
                const amount = Number(stock.amount || 0);
                acc[stock.code] = (acc[stock.code] || 0) + amount;
                return acc;
            }, {});
            const formattedInvestmentData = Object.entries(investmentMap)
                .filter(([_, value]) => value > 0)
                .map(([code, value], index) => ({
                    name: code,
                    value: value,
                    color: COLORS[index % COLORS.length],
                }));
            setInvestmentData(formattedInvestmentData);
        }
    }, [stocksData]);

    useEffect(() => {
        const expenseAttributes = ["Rent", "Groceries", "Utilities", "Entertainment", "Transport", "Healthcare", "Others"];
        const expenseValues = expenseAttributes.map((attribute) => {
            return transactions
                .filter((txn) => txn.type === "expense" && txn.category === attribute)
                .reduce((acc, txn) => acc + Number(txn.amount), 0);
        });

        if (expenseValues.some(val => val > 0)) {
            const radarData = {
                labels: expenseAttributes,
                datasets: [{
                    label: "Expenses",
                    data: expenseValues,
                    backgroundColor: "rgba(0, 179, 134, 0.15)",
                    borderColor: "rgba(0, 179, 134, 0.8)",
                    pointBackgroundColor: "#00B386",
                    pointBorderColor: "#FFFFFF",
                    pointHoverBackgroundColor: "#FFFFFF",
                    pointHoverBorderColor: "#00B386",
                    borderWidth: 1.5,
                }],
            };
            setRadarChartData(radarData);
        }
    }, [transactions]);

    const getChartData = (data) => ({
        labels: data.map(item => item.name),
        datasets: [{
            data: data.map(item => item.value),
            backgroundColor: data.map(item => item.color),
            borderWidth: 2,
            borderColor: '#FFFFFF',
        }],
    });

    const totalInvested = investmentData.reduce((acc, curr) => acc + curr.value, 0);
    const netWorthData = {
        labels: ["Cash", "Invested"],
        datasets: [{
            data: [(userCash - totalInvested), totalInvested],
            backgroundColor: ["#2C74F6", "#00B386"],
            borderWidth: 2,
            borderColor: '#FFFFFF',
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: '#6B7280',
                    font: { family: 'Inter, sans-serif', size: 11 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            tooltip: {
                backgroundColor: '#FFFFFF',
                titleColor: '#1E2330',
                bodyColor: '#1E2330',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const donutChartOptions = { ...chartOptions, cutout: "65%" };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(0, 0, 0, 0.06)' },
                grid: { color: 'rgba(0, 0, 0, 0.06)' },
                pointLabels: {
                    color: '#6B7280',
                    font: { family: 'Inter, sans-serif', size: 10 }
                },
                ticks: { display: false, maxTicksLimit: 5 }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: chartOptions.plugins.tooltip
        }
    };

    const ChartCard = ({ title, children, className = "" }) => (
        <div className={`flex flex-col items-center bg-white p-6 rounded-xl border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] ${className}`}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-5 text-center">{title}</h3>
            {children}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mx-auto"
        >
            <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-6">
                Financial Overview
            </h2>
            <div className="flex justify-center gap-5 xl:gap-6 flex-wrap">
                {categoryData.length > 0 && (
                    <ChartCard title="Expense by Category" className="w-full sm:w-[400px]">
                        <div style={{ width: "100%", height: 260 }}>
                            <Pie data={getChartData(categoryData)} options={chartOptions} />
                        </div>
                    </ChartCard>
                )}
                {typeData.length > 0 && (
                    <ChartCard title="Income vs Expense" className="w-full sm:w-[400px]">
                        <div style={{ width: "100%", height: 260 }}>
                            <Pie data={getChartData(typeData)} options={chartOptions} />
                        </div>
                    </ChartCard>
                )}
                {investmentData.length > 0 && (
                    <ChartCard title="Investment Split" className="w-full sm:w-[400px]">
                        <div style={{ width: "100%", height: 260 }}>
                            <Pie data={getChartData(investmentData)} options={chartOptions} />
                        </div>
                    </ChartCard>
                )}
                {radarChartData && (
                    <ChartCard title="Spending Pattern" className="w-full sm:w-[400px]">
                        <div style={{ width: "100%", height: 260 }}>
                            <Radar data={radarChartData} options={radarOptions} />
                        </div>
                    </ChartCard>
                )}
                <ChartCard title="Net Worth Split" className="w-full sm:w-[400px]">
                    <div style={{ width: "100%", height: 260, position: 'relative' }}>
                        <Pie data={netWorthData} options={donutChartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <span className="font-mono text-lg font-bold text-[var(--text-primary)]">
                                ₹{Number(userCash).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {categoryData.length === 0 && !radarChartData && investmentData.length === 0 && (
                <div className="flex justify-center items-center h-44 border border-dashed border-[var(--border-strong)] rounded-xl mt-6">
                    <p className="text-sm text-[var(--text-muted)]">Add transactions to see detailed analytics</p>
                </div>
            )}
        </motion.div>
    );
}

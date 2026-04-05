import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { getAnalysis, getAdvice } from "../services/chat.service";
import FinAnalytics from "../Components/FinAnalytics";
import Popup from "../Components/UI/Popup";
import Loader from "../Components/UI/Loader";
import Layout from "../Components/UI/Layout";
import { motion } from "framer-motion";
import { FileText, Download, Sparkles, TrendingUp } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: rgba(201, 168, 76, 0.12);
    --obsidian: #0D0D10;
    --surface: #13131A;
    --surface-2: #1A1A24;
    --surface-3: #22222F;
    --border: rgba(255,255,255,0.07);
    --border-gold: rgba(201, 168, 76, 0.22);
    --text-1: #F0EDE6;
    --text-2: #8A8799;
    --text-3: #52505E;
    --blue: #60A5FA;
    --blue-dim: rgba(96, 165, 250, 0.1);
  }

  .munshi-analysis { font-family: 'DM Sans', sans-serif; }
  .serif { font-family: 'Playfair Display', serif; }

  .analysis-header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px 28px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }

  .header-icon {
    width: 44px; height: 44px; border-radius: 13px;
    background: var(--blue-dim); border: 1px solid rgba(96,165,250,0.2);
    display: flex; align-items: center; justify-content: center;
  }

  .export-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; border: 1px solid var(--border);
    color: var(--text-2); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; padding: 10px 18px;
    border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
  }
  .export-btn:hover {
    border-color: var(--border-gold); color: var(--gold);
  }

  .content-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px 48px;
    position: relative; overflow: hidden;
  }

  .content-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 300px; height: 300px;
    background: radial-gradient(circle at top right, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-gold), transparent);
    margin: 40px 0;
  }

  .analytics-embed {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    margin: 32px 0;
  }

  .analytics-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600; color: var(--gold);
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 20px;
  }

  /* Markdown overrides for dark theme */
  .munshi-md h1, .munshi-md h2, .munshi-md h3 {
    font-family: 'Playfair Display', serif;
    color: var(--text-1);
    letter-spacing: -0.02em;
    margin-top: 28px; margin-bottom: 12px;
  }
  .munshi-md h1 { font-size: 26px; }
  .munshi-md h2 { font-size: 22px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
  .munshi-md h3 { font-size: 17px; color: var(--gold); font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .munshi-md p { color: var(--text-2); line-height: 1.75; font-size: 15px; margin-bottom: 14px; font-weight: 300; }
  .munshi-md strong { color: var(--text-1); font-weight: 600; }
  .munshi-md ul, .munshi-md ol { color: var(--text-2); font-size: 14px; line-height: 1.8; padding-left: 20px; }
  .munshi-md li { margin-bottom: 6px; }
  .munshi-md li::marker { color: var(--gold); }
  .munshi-md code { background: var(--surface-3); color: var(--gold-light); font-size: 13px; padding: 2px 8px; border-radius: 5px; }
  .munshi-md blockquote { border-left: 3px solid var(--border-gold); padding-left: 18px; color: var(--text-2); font-style: italic; margin: 20px 0; }
  .munshi-md table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .munshi-md th { background: var(--surface-2); color: var(--text-1); font-weight: 600; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
  .munshi-md td { padding: 10px 14px; color: var(--text-2); border-bottom: 1px solid var(--border); }

  .signature {
    text-align: right;
    font-size: 12px;
    color: var(--text-3);
    padding-top: 24px;
    margin-top: 32px;
    border-top: 1px solid var(--border);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .skeleton {
    background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 32px; text-align: center;
  }
  .empty-icon {
    width: 64px; height: 64px; border-radius: 20px;
    background: var(--gold-dim); border: 1px solid var(--border-gold);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
`;

const SkeletonLine = ({ w = "100%", h = 16, mb = 12 }) => (
    <div className="skeleton" style={{ width: w, height: h, marginBottom: mb }} />
);

const FinancialAnalysisPage = () => {
    const user = useSelector((state) => state.user);
    const [markdownContent1, setMarkdownContent1] = useState("");
    const [markdownContent2, setMarkdownContent2] = useState("");
    const [isLoaderPopupOpen, setIsLoaderPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoaderPopup(true);
                setIsLoading(true);
                const analysis = await getAnalysis(user);
                setMarkdownContent1(analysis.answer);
                const advice = await getAdvice(user);
                setMarkdownContent2(advice.answer);
                setIsLoaderPopup(false);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching analysis:", error);
                setIsLoaderPopup(false);
                setIsLoading(false);
            }
        };

        if (user.user && user.userData) fetchAnalysis();
    }, [user]);

    const handlePrint = () => window.print();

    const hasContent = markdownContent1 || markdownContent2;

    return (
        <Layout>
            <div className="munshi-analysis">
                <style>{styles}</style>

                <motion.div
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Header */}
                    <div className="analysis-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div className="header-icon">
                                <FileText size={20} color="var(--blue)" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 2 }}>
                                    Transactions & Analysis
                                </h1>
                                <p style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Sparkles size={11} color="var(--gold)" /> AI-generated financial insights
                                </p>
                            </div>
                        </div>
                        <button className="export-btn" onClick={handlePrint}>
                            <Download size={14} /> Export PDF
                        </button>
                    </div>

                    {/* Content */}
                    <div className="content-card">
                        {isLoading ? (
                            <div style={{ padding: '20px 0' }}>
                                <SkeletonLine w="60%" h={28} mb={20} />
                                <SkeletonLine h={14} mb={10} />
                                <SkeletonLine w="90%" h={14} mb={10} />
                                <SkeletonLine w="75%" h={14} mb={32} />
                                <SkeletonLine w="40%" h={20} mb={16} />
                                <SkeletonLine h={14} mb={10} />
                                <SkeletonLine w="85%" h={14} mb={10} />
                            </div>
                        ) : !hasContent ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <TrendingUp size={28} color="var(--gold)" strokeWidth={1.5} />
                                </div>
                                <h3 className="serif" style={{ fontSize: 22, color: 'var(--text-1)', marginBottom: 10 }}>No data yet</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 300 }}>Complete your financial profile to unlock AI-powered analysis.</p>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {markdownContent1 && (
                                    <div className="munshi-md">
                                        <ReactMarkdown>{markdownContent1}</ReactMarkdown>
                                    </div>
                                )}

                                <div className="section-divider" />

                                <div className="analytics-embed">
                                    <div className="analytics-label">
                                        <TrendingUp size={13} /> Visual Analytics
                                    </div>
                                    <FinAnalytics />
                                </div>

                                <div className="section-divider" />

                                {markdownContent2 && (
                                    <div className="munshi-md">
                                        <ReactMarkdown>{markdownContent2}</ReactMarkdown>
                                    </div>
                                )}

                                <div className="signature">Generated by Munshi AI</div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <Popup isOpen={isLoaderPopupOpen} onClose={() => setIsLoaderPopup(false)} canClose={false} className="max-w-none border-0 bg-transparent p-0 shadow-none">
                <Loader fill="var(--gold)" />
            </Popup>
        </Layout>
    );
};

export default FinancialAnalysisPage;
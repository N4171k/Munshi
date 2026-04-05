import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { getSavingAdvice } from "../services/chat.service";
import Popup from "../Components/UI/Popup";
import Loader from "../Components/UI/Loader";
import Layout from "../Components/UI/Layout";
import { motion } from "framer-motion";
import { Target, Download, Sparkles, PiggyBank, CheckCircle2 } from "lucide-react";

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
    --positive: #4ADE80;
    --positive-dim: rgba(74, 222, 128, 0.1);
  }

  .munshi-saving { font-family: 'DM Sans', sans-serif; }
  .serif { font-family: 'Playfair Display', serif; }

  .saving-header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px 28px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    position: relative; overflow: hidden;
  }
  .saving-header::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 200px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.03));
    pointer-events: none;
  }

  .header-icon {
    width: 44px; height: 44px; border-radius: 13px;
    background: var(--gold-dim); border: 1px solid var(--border-gold);
    display: flex; align-items: center; justify-content: center;
  }

  .export-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; border: 1px solid var(--border);
    color: var(--text-2); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; padding: 10px 18px;
    border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
  }
  .export-btn:hover { border-color: var(--border-gold); color: var(--gold); }

  .content-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px 48px;
    position: relative; overflow: hidden;
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
  .munshi-md blockquote {
    border-left: 3px solid var(--border-gold);
    padding: 16px 20px; color: var(--text-1);
    font-style: italic; margin: 20px 0;
    background: var(--gold-dim); border-radius: 0 10px 10px 0;
  }
  .munshi-md table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .munshi-md th { background: var(--surface-2); color: var(--text-1); font-weight: 600; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
  .munshi-md td { padding: 10px 14px; color: var(--text-2); border-bottom: 1px solid var(--border); }

  .signature {
    text-align: right; font-size: 12px; color: var(--text-3);
    padding-top: 24px; margin-top: 32px;
    border-top: 1px solid var(--border);
    letter-spacing: 0.05em; text-transform: uppercase;
  }

  .skeleton {
    background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite; border-radius: 8px;
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

  /* Goal progress pills at top */
  .goal-pills {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px;
  }
  .goal-pill {
    display: flex; align-items: center; gap: 6px;
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 100px; padding: 6px 14px 6px 8px;
    font-size: 12px; font-weight: 500; color: var(--text-2);
    transition: all 0.2s;
  }
  .goal-pill:hover { border-color: var(--border-gold); color: var(--text-1); }
  .goal-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }

  .info-banner {
    background: var(--positive-dim);
    border: 1px solid rgba(74,222,128,0.15);
    border-radius: 12px; padding: 14px 18px;
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 28px;
  }
  .info-banner p { color: var(--positive); font-size: 13px; margin: 0; font-weight: 400; line-height: 1.5; }
`;

const SkeletonLine = ({ w = "100%", h = 16, mb = 12 }) => (
    <div className="skeleton" style={{ width: w, height: h, marginBottom: mb }} />
);

const SavingAdvisor = () => {
    const user = useSelector((state) => state.user);
    const [markdownContent1, setMarkdownContent1] = useState("");
    const [isLoaderPopupOpen, setIsLoaderPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoaderPopup(true);
                setIsLoading(true);
                const advice = await getSavingAdvice(user);
                setMarkdownContent1(advice.answer);
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

    return (
        <Layout>
            <div className="munshi-saving">
                <style>{styles}</style>

                <motion.div
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Header */}
                    <div className="saving-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div className="header-icon">
                                <Target size={20} color="var(--gold)" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 2 }}>
                                    Goals & Savings
                                </h1>
                                <p style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Sparkles size={11} color="var(--gold)" /> AI-powered saving recommendations
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
                                <SkeletonLine w="50%" h={28} mb={20} />
                                <SkeletonLine h={14} mb={10} />
                                <SkeletonLine w="88%" h={14} mb={10} />
                                <SkeletonLine w="70%" h={14} mb={32} />
                                <SkeletonLine w="35%" h={20} mb={16} />
                                <SkeletonLine h={14} mb={10} />
                                <SkeletonLine w="92%" h={14} mb={10} />
                                <SkeletonLine w="60%" h={14} mb={10} />
                            </div>
                        ) : !markdownContent1 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <PiggyBank size={28} color="var(--gold)" strokeWidth={1.5} />
                                </div>
                                <h3 className="serif" style={{ fontSize: 22, color: 'var(--text-1)', marginBottom: 10 }}>No advice yet</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 300 }}>Complete your profile to receive personalized savings recommendations.</p>
                            </div>
                        ) : (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Intro info banner */}
                                <div className="info-banner">
                                    <CheckCircle2 size={18} color="var(--positive)" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <p>Your savings plan has been personalized based on your income, spending patterns, and financial goals.</p>
                                </div>

                                {/* Goal pills */}
                                <div className="goal-pills">
                                    {["Emergency Fund", "Investments", "Retirement", "Short-term Goals"].map((g, i) => (
                                        <div className="goal-pill" key={i}>
                                            <div className="goal-pill-dot" style={{ opacity: 0.6 + i * 0.1 }} />
                                            {g}
                                        </div>
                                    ))}
                                </div>

                                <div className="munshi-md">
                                    <ReactMarkdown>{markdownContent1}</ReactMarkdown>
                                </div>

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

export default SavingAdvisor;
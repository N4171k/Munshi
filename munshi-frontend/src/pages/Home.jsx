import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Wallet, ArrowRight, Shield, Zap, X, Eye, EyeOff } from "lucide-react";
import Popup from "../Components/UI/Popup";
import Loader from "../Components/UI/Loader";
import { getUser, login, signup } from "../services/auth.service";
import { setUser } from "../store/slices/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: rgba(201, 168, 76, 0.12);
    --obsidian: #0D0D10;
    --surface: #13131A;
    --surface-2: #1A1A24;
    --surface-3: #22222F;
    --border: rgba(255,255,255,0.07);
    --border-gold: rgba(201, 168, 76, 0.25);
    --text-1: #F0EDE6;
    --text-2: #8A8799;
    --text-3: #52505E;
    --positive: #4ADE80;
    --negative: #F87171;
  }

  .munshi-home * { box-sizing: border-box; }
  .munshi-home { font-family: 'DM Sans', sans-serif; background: var(--obsidian); color: var(--text-1); min-height: 100vh; overflow-x: hidden; }

  .grain-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat; background-size: 128px;
  }

  .glow-orb {
    position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none;
  }

  .serif { font-family: 'Playfair Display', serif; }

  .nav-blur {
    background: rgba(13, 13, 16, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .gold-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--gold-dim); border: 1px solid var(--border-gold);
    color: var(--gold-light); font-size: 11px; font-weight: 600;
    padding: 5px 12px; border-radius: 100px; letter-spacing: 0.08em; text-transform: uppercase;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--obsidian);
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
    padding: 14px 28px; border-radius: 12px; border: none; cursor: pointer;
    transition: all 0.2s ease; letter-spacing: 0.01em;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201, 168, 76, 0.3); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--text-2); border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px;
    padding: 13px 24px; border-radius: 12px; cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover { border-color: var(--border-gold); color: var(--text-1); }

  .feature-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px;
    transition: all 0.3s ease; position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; inset: 0; opacity: 0;
    background: linear-gradient(135deg, var(--gold-dim), transparent);
    transition: opacity 0.3s ease;
  }
  .feature-card:hover { border-color: var(--border-gold); transform: translateY(-4px); }
  .feature-card:hover::before { opacity: 1; }

  .icon-box {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    background: var(--gold-dim); border: 1px solid var(--border-gold);
    margin-bottom: 20px;
  }

  .stat-item { text-align: center; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: var(--gold); line-height: 1; }
  .stat-label { font-size: 13px; color: var(--text-2); margin-top: 6px; letter-spacing: 0.04em; }

  .divider { width: 1px; height: 60px; background: var(--border); }

  /* Auth Modal */
  .auth-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 40px; width: 100%; max-width: 420px;
    position: relative; overflow: hidden;
  }
  .auth-modal::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%);
  }

  .input-group label {
    display: block; font-size: 11px; font-weight: 600; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
  }
  .input-group input {
    width: 100%; background: var(--surface-2); border: 1px solid var(--border);
    color: var(--text-1); font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 12px 16px; border-radius: 10px; outline: none; transition: border-color 0.2s;
  }
  .input-group input:focus { border-color: var(--gold); }
  .input-group input::placeholder { color: var(--text-3); }

  .mode-toggle {
    display: flex; background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 4px; gap: 4px;
  }
  .mode-btn {
    flex: 1; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    transition: all 0.2s ease;
  }
  .mode-btn.active { background: var(--gold); color: var(--obsidian); font-weight: 600; }
  .mode-btn.inactive { background: transparent; color: var(--text-2); }
  .mode-btn.inactive:hover { color: var(--text-1); }

  .error-msg {
    background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.2);
    color: var(--negative); font-size: 13px; padding: 10px 14px; border-radius: 8px;
    display: flex; align-items: center; gap: 8px;
  }

  .hero-line { position: absolute; background: linear-gradient(90deg, transparent, var(--border-gold), transparent); height: 1px; width: 100%; }

  .ticker-item {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0 32px; white-space: nowrap;
    font-size: 12px; color: var(--text-2); letter-spacing: 0.05em;
  }
  .ticker-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); opacity: 0.5; }

  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ticker-track { display: flex; animation: ticker 30s linear infinite; width: max-content; }
  .ticker-wrap { overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 14px 0; }

  .floating-card {
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 24px;
  }

  .pill { display: inline-flex; align-items: center; gap: 4px; background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.2); color: var(--positive); font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; }
`;

const tickerItems = ["Smart Tracking", "AI Analysis", "Portfolio Monitoring", "Savings Goals", "Expense Reports", "Budget Planning", "Financial Insights", "Wealth Management"];

export default function Home() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isLoaderPopupOpen, setIsLoaderPopup] = useState(false);
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const openPopup = (m) => { setMode(m); setPopupOpen(true); setAuthError(""); };
    const closePopup = () => setPopupOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError("");
        setIsLoaderPopup(true);
        try {
            const userData = mode === "login"
                ? await login({ email: form.email, password: form.password })
                : await signup({ name: form.name, email: form.email, password: form.password });
            dispatch(setUser(userData));
            closePopup();
        } catch (error) {
            setAuthError(error?.response?.data?.error || "Authentication failed. Please try again.");
        } finally {
            setIsLoaderPopup(false);
        }
    };

    useEffect(() => {
        const autoLogin = async () => {
            try {
                setIsLoaderPopup(true);
                const userData = await getUser();
                if (userData) dispatch(setUser(userData));
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoaderPopup(false);
            }
        };
        if (!user) autoLogin();
    }, [dispatch, user]);

    const features = [
        { title: "Smart Tracking", desc: "Every rupee accounted for. Auto-categorize income and expenses with precision.", icon: Wallet, num: "01" },
        { title: "AI Insights", desc: "Personalized recommendations that adapt to your unique spending patterns.", icon: Zap, num: "02" },
        { title: "Portfolio View", desc: "Visualize your wealth trajectory with real-time investment monitoring.", icon: TrendingUp, num: "03" },
    ];

    return (
        <div className="munshi-home">
            <style>{styles}</style>
            <div className="grain-overlay" />

            {/* NAV */}
            <nav className="nav-blur fixed w-full top-0 z-50">
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="serif" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                        Munshi<span style={{ color: 'var(--gold)' }}>.</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className="btn-ghost" style={{ padding: '9px 20px' }} onClick={() => openPopup("login")}>Log in</button>
                        <button className="btn-primary" style={{ padding: '9px 20px' }} onClick={() => openPopup("signup")}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={{ position: 'relative', paddingTop: 160, paddingBottom: 120, overflow: 'hidden' }}>
                {/* Glow orbs */}
                <div className="glow-orb" style={{ width: 500, height: 500, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
                <div className="glow-orb" style={{ width: 300, height: 300, bottom: 0, left: '10%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)' }} />

                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                        <div className="gold-badge" style={{ marginBottom: 28 }}>
                            <Shield size={12} /> Your finances, intelligently managed
                        </div>

                        <h1 className="serif" style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-1)', marginBottom: 24 }}>
                            Take command of<br />
                            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>your wealth.</em>
                        </h1>

                        <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 300 }}>
                            Track expenses, manage investments, and receive AI-powered financial intelligence — all in one refined dashboard.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={() => openPopup("signup")}>
                                Start for free <ArrowRight size={16} />
                            </button>
                            <button className="btn-ghost" onClick={() => openPopup("login")}>
                                Sign in
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating preview card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ marginTop: 72, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <div className="floating-card" style={{ minWidth: 200 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Monthly Savings</div>
                            <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--gold)' }}>₹24,500</div>
                            <div className="pill" style={{ marginTop: 10 }}>↑ 18% this month</div>
                        </div>
                        <div className="floating-card" style={{ minWidth: 200 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Expenses Tracked</div>
                            <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-1)' }}>₹1,12,000</div>
                            <div style={{ marginTop: 10, height: 4, borderRadius: 4, background: 'var(--surface-3)', overflow: 'hidden' }}>
                                <div style={{ width: '68%', height: '100%', background: 'var(--gold)', borderRadius: 4 }} />
                            </div>
                        </div>
                        <div className="floating-card" style={{ minWidth: 200 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>AI Score</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                {[40, 60, 50, 75, 65, 85, 78].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: h * 0.5, background: i === 5 ? 'var(--gold)' : 'var(--surface-3)', borderRadius: 3, transition: 'height 0.3s' }} />
                                ))}
                            </div>
                            <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: 'var(--positive)' }}>Excellent</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TICKER */}
            <div className="ticker-wrap">
                <div className="ticker-track">
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <div className="ticker-item" key={i}>
                            <div className="ticker-dot" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* STATS */}
            <section style={{ padding: '80px 32px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
                    {[
                        { val: "100%", label: "Free to use" },
                        { val: "AI", label: "Powered insights" },
                        { val: "24/7", label: "Always accessible" },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
                            <div className="stat-item">
                                <div className="stat-value">{s.val}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                            {i < 2 && <div className="divider" />}
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section style={{ padding: '100px 32px', background: 'var(--surface)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>What Munshi offers</div>
                        <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                            Everything you need,<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>nothing you don't.</em>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="feature-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                    <div className="icon-box">
                                        <f.icon size={20} color="var(--gold)" />
                                    </div>
                                    <span className="serif" style={{ fontSize: 48, fontWeight: 700, color: 'var(--surface-3)', lineHeight: 1 }}>{f.num}</span>
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)', marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section style={{ padding: '80px 32px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)',
                            border: '1px solid var(--border-gold)',
                            borderRadius: 24, padding: '56px 48px', textAlign: 'center',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <h2 className="serif" style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-1)', marginBottom: 16, letterSpacing: '-0.02em' }}>
                            Ready to master your <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>finances?</em>
                        </h2>
                        <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 32, fontWeight: 300 }}>Join thousands managing their money smarter with Munshi.</p>
                        <button className="btn-primary" style={{ fontSize: 15, padding: '16px 36px' }} onClick={() => openPopup("signup")}>
                            Create free account <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 32px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-3)' }}>© {new Date().getFullYear()} Munshi. All rights reserved.</span>
                    <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>Munshi<span style={{ color: 'var(--gold)' }}>.</span></span>
                </div>
            </footer>

            {/* AUTH MODAL */}
            <AnimatePresence>
                {isPopupOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={closePopup}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="auth-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={closePopup} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--surface-3)', border: 'none', color: 'var(--text-2)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={16} />
                            </button>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div className="serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>
                                    {mode === "login" ? "Welcome back." : "Join Munshi."}
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>
                                    {mode === "login" ? "Sign in to your account." : "Start managing money smarter."}
                                </p>

                                <div className="mode-toggle" style={{ marginBottom: 24 }}>
                                    <button className={`mode-btn ${mode === "login" ? "active" : "inactive"}`} onClick={() => setMode("login")}>Log in</button>
                                    <button className={`mode-btn ${mode === "signup" ? "active" : "inactive"}`} onClick={() => setMode("signup")}>Sign up</button>
                                </div>

                                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {mode === "signup" && (
                                        <div className="input-group">
                                            <label>Full Name</label>
                                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                                        </div>
                                    )}
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                                    </div>
                                    <div className="input-group" style={{ position: 'relative' }}>
                                        <label>Password</label>
                                        <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, bottom: 13, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {authError && (
                                        <div className="error-msg"><span>⚠</span>{authError}</div>
                                    )}

                                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '14px 24px' }}>
                                        {mode === "login" ? "Sign in" : "Create account"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Popup isOpen={isLoaderPopupOpen} onClose={() => setIsLoaderPopup(false)} canClose={false} className="max-w-none border-0 bg-transparent p-0 shadow-none">
                <Loader fill="var(--gold)" />
            </Popup>
        </div>
    );
}
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { getUserData, saveUserData } from "../services/database.service";
import Popup from "../Components/UI/Popup";
import Loader from "../Components/UI/Loader";
import { useState, useEffect } from "react";
import ProfileForm from "../Components/ProfileForm";
import { setUserData } from "../store/slices/userSlice";
import Board from "../Components/UI/Board";
import Layout from "../Components/UI/Layout";
import { UserCircle, ArrowRight, Sparkles } from "lucide-react";

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
    --border-gold: rgba(201, 168, 76, 0.25);
    --text-1: #F0EDE6;
    --text-2: #8A8799;
    --text-3: #52505E;
  }

  .munshi-dash { font-family: 'DM Sans', sans-serif; }
  .serif { font-family: 'Playfair Display', serif; }

  .onboarding-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
  }

  .onboarding-card {
    background: var(--surface);
    border: 1px solid var(--border-gold);
    border-radius: 28px;
    padding: 56px 48px;
    text-align: center;
    max-width: 480px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .onboarding-card::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%; transform: translateX(-50%);
    width: 280px; height: 280px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .avatar-ring {
    width: 80px; height: 80px; border-radius: 24px;
    background: var(--gold-dim);
    border: 1px solid var(--border-gold);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 28px;
    position: relative; z-index: 1;
  }

  .step-dots {
    display: flex; gap: 6px; justify-content: center; margin-bottom: 32px;
  }
  .step-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--surface-3);
  }
  .step-dot.active { background: var(--gold); width: 20px; border-radius: 3px; }

  .start-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--gold); color: var(--obsidian);
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
    padding: 15px 32px; border-radius: 14px; border: none; cursor: pointer;
    transition: all 0.2s ease; letter-spacing: 0.01em;
  }
  .start-btn:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px rgba(201, 168, 76, 0.3);
  }

  .checklist {
    display: flex; flex-direction: column; gap: 12px;
    text-align: left; margin: 28px 0 36px;
  }
  .checklist-item {
    display: flex; align-items: center; gap: 12px;
    font-size: 13px; color: var(--text-2);
  }
  .check-icon {
    width: 20px; height: 20px; border-radius: 6px;
    background: var(--gold-dim); border: 1px solid var(--border-gold);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 11px; color: var(--gold);
  }
`;

export default function Dashboard() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isLoaderPopupOpen, setIsLoaderPopupOpen] = useState(false);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoaderPopupOpen(true);
                const response = await getUserData();
                if (response) {
                    dispatch(setUserData(response));
                    setIsProfileComplete(true);
                } else {
                    setIsProfileComplete(false);
                }
                setIsLoaderPopupOpen(false);
            } catch (error) {
                setIsLoaderPopupOpen(false);
                console.error("Error fetching user profile:", error);
            }
        };

        if (user.user && !user.userData) {
            fetchUserProfile();
        } else if (user.user && user.userData) {
            setIsProfileComplete(true);
        }
    }, [dispatch, user.user, user.userData]);

    async function saveUserToDB(data) {
        try {
            setIsLoaderPopupOpen(true);
            const profile = await saveUserData(data);
            if (profile) {
                dispatch(setUserData(profile));
                setIsProfileComplete(true);
            }
            setIsLoaderPopupOpen(false);
        } catch (error) {
            console.error("Error saving user to database:", error);
            setIsLoaderPopupOpen(false);
        }
    }

    const firstName = user?.user?.name?.split(" ")[0] || "there";
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <Layout>
            <div className="munshi-dash">
                <style>{styles}</style>

                {/* Onboarding State */}
                {!isProfileComplete && !isLoaderPopupOpen && (
                    <div className="onboarding-wrap">
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="onboarding-card"
                        >
                            <div className="step-dots">
                                <div className="step-dot active" />
                                <div className="step-dot" />
                                <div className="step-dot" />
                            </div>

                            <div className="avatar-ring">
                                <UserCircle size={36} color="var(--gold)" strokeWidth={1.5} />
                            </div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 10 }}>
                                    {greeting}, {firstName}
                                </p>
                                <h2 className="serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    Set up your<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>financial profile.</em>
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 0, fontWeight: 300 }}>
                                    A few details to unlock personalized insights and start taking control of your money.
                                </p>

                                <div className="checklist">
                                    {["Set your income & budget", "Choose spending categories", "Define your savings goals"].map((item, i) => (
                                        <div className="checklist-item" key={i}>
                                            <div className="check-icon">✦</div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="start-btn" onClick={() => setIsProfileFormOpen(true)}>
                                    Complete Profile
                                    <ArrowRight size={17} />
                                </button>

                                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 16 }}>Takes less than 2 minutes</p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Profile Form Modal */}
                {isProfileFormOpen && (
                    <Popup isOpen={isProfileFormOpen} onClose={() => setIsProfileFormOpen(false)} canClose={true} className="max-w-xl p-0 bg-white">
                        <ProfileForm onClose={() => setIsProfileFormOpen(false)} onSubmit={saveUserToDB} />
                    </Popup>
                )}

                {/* Dashboard Board */}
                {isProfileComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Board />
                    </motion.div>
                )}

                {/* Loader */}
                <Popup isOpen={isLoaderPopupOpen} onClose={() => setIsLoaderPopupOpen(false)} canClose={false} className="max-w-none border-0 bg-transparent p-0 shadow-none">
                    <Loader fill="var(--gold)" />
                </Popup>
            </div>
        </Layout>
    );
}
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Globe, EyeOff, Info, ChevronRight, LogOut } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setLanguage, setIncognito } from "../../store/slices/uiSlice";
import { logout } from "../../services/auth.service";
import { logoutUser } from "../../store/slices/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .settings-trigger {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #8A8799; width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease; position: relative;
  }
  .settings-trigger:hover {
    background: rgba(255,255,255,0.08);
    color: #F0EDE6;
    border-color: rgba(255,255,255,0.12);
  }
  .settings-trigger.active {
    background: rgba(201, 168, 76, 0.1);
    border-color: rgba(201, 168, 76, 0.25);
    color: #C9A84C;
  }

  .settings-panel {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 280px;
    background: #13131A;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    overflow: hidden;
    z-index: 100;
    font-family: 'DM Sans', sans-serif;
  }

  .settings-header {
    padding: 16px 18px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
  }

  .settings-header-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: rgba(201, 168, 76, 0.1);
    border: 1px solid rgba(201, 168, 76, 0.2);
    display: flex; align-items: center; justify-content: center;
    color: #C9A84C;
  }

  .settings-title {
    font-size: 13px; font-weight: 600; color: #F0EDE6; letter-spacing: -0.01em;
  }
  .settings-subtitle {
    font-size: 11px; color: #52505E; margin-top: 1px;
  }

  .settings-body { padding: 12px; display: flex; flex-direction: column; gap: 4px; }

  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 10px;
    border-radius: 10px;
    transition: background 0.15s ease;
  }
  .settings-row:hover { background: rgba(255,255,255,0.03); }

  .settings-row-left {
    display: flex; align-items: center; gap: 10px;
  }

  .row-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    color: #8A8799; flex-shrink: 0;
  }

  .row-label {
    font-size: 13px; font-weight: 500; color: #C8C5D0;
  }
  .row-desc { font-size: 11px; color: #52505E; margin-top: 1px; }

  .settings-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 4px 10px;
  }

  .about-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 10px 10px;
    border-radius: 10px; border: none;
    background: transparent; cursor: pointer;
    transition: background 0.15s ease;
  }
  .about-btn:hover { background: rgba(255,255,255,0.03); }
  .about-btn-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: #C9A84C;
  }
`;

export default function HamburgerMenu({ onAboutPage }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();

    const language = useSelector((state) => state.ui.language);
    const incognito = useSelector((state) => state.ui.incognito);

    const handleLogout = async () => {
        await logout();
        dispatch(logoutUser());
        window.location.reload();
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            <style>{styles}</style>

            <button
                className={`settings-trigger ${isMenuOpen ? "active" : ""}`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                title="Settings"
            >
                <Settings size={16} />
            </button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="settings-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Header */}
                        <div className="settings-header">
                            <div className="settings-header-icon">
                                <Settings size={14} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="settings-title">Preferences</div>
                                <div className="settings-subtitle">Customize your experience</div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="settings-body">
                            {/* Language */}
                            <div className="settings-row">
                                <div className="settings-row-left">
                                    <div className="row-icon">
                                        <Globe size={13} />
                                    </div>
                                    <div>
                                        <div className="row-label">Language</div>
                                        <div className="row-desc">AI chat language</div>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    option1="English"
                                    option2="Hindi"
                                    value={language}
                                    onToggle={(val) => dispatch(setLanguage(val))}
                                />
                            </div>

                            <div className="settings-divider" />

                            {/* Incognito */}
                            <div className="settings-row">
                                <div className="settings-row-left">
                                    <div className="row-icon">
                                        <EyeOff size={13} />
                                    </div>
                                    <div>
                                        <div className="row-label">Incognito Chat</div>
                                        <div className="row-desc">Don't save history</div>
                                    </div>
                                </div>
                                <ToggleSwitch
                                    option1="Off"
                                    option2="On"
                                    value={incognito ? "On" : "Off"}
                                    onToggle={(val) => dispatch(setIncognito(val === "On"))}
                                />
                            </div>

                            {onAboutPage && (
                                <>
                                    <div className="settings-divider" />
                                    <button
                                        className="about-btn"
                                        onClick={() => { onAboutPage(); setIsMenuOpen(false); }}
                                    >
                                        <div className="settings-row-left">
                                            <div className="row-icon" style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.15)' }}>
                                                <Info size={13} />
                                            </div>
                                            <span className="about-btn-text">About Munshi</span>
                                        </div>
                                        <ChevronRight size={14} color="#C9A84C" />
                                    </button>
                                </>
                            )}

                            <div className="settings-divider" />
                            <button
                                className="about-btn"
                                onClick={handleLogout}
                            >
                                <div className="settings-row-left">
                                    <div className="row-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                        <LogOut size={13} />
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#ef4444', fontFamily: "'DM Sans', sans-serif" }}>Sign out</span>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
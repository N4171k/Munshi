import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import ProfileForm from "../ProfileForm";
import Popup from "./Popup";
import Loader from "./Loader";
import { saveUserData } from "../../services/database.service";
import { setUserData } from "../../store/slices/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .munshi-layout {
    font-family: 'DM Sans', sans-serif;
    display: flex; min-height: 100vh;
    background: #0D0D10;
  }

  .layout-main {
    flex: 1;
    margin-left: 240px;
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  @media (max-width: 1023px) {
    .layout-main { margin-left: 0; }
    .desktop-sidebar { display: none; }
  }

  .topbar {
    position: sticky; top: 0; z-index: 40;
    height: 64px;
    background: rgba(13, 13, 16, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px;
  }

  .topbar-left { display: flex; align-items: center; gap: 16px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }

  .mobile-menu-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    color: #8A8799; width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease;
  }
  .mobile-menu-btn:hover { background: rgba(255,255,255,0.08); color: #F0EDE6; }

  .mobile-logo {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #F0EDE6; letter-spacing: -0.02em; text-decoration: none;
  }
  .mobile-logo span { color: #C9A84C; }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: #F0EDE6; letter-spacing: -0.02em;
  }

  .topbar-icon-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #8A8799; width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease; position: relative;
  }
  .topbar-icon-btn:hover { background: rgba(255,255,255,0.08); color: #F0EDE6; border-color: rgba(255,255,255,0.12); }

  .notif-dot {
    position: absolute; top: 7px; right: 7px;
    width: 6px; height: 6px; border-radius: 50%;
    background: #C9A84C;
    border: 1px solid #0D0D10;
  }

  .avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(201, 168, 76, 0.15);
    border: 1px solid rgba(201, 168, 76, 0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700; color: #C9A84C;
    cursor: pointer; letter-spacing: 0;
  }

  .layout-content {
    flex: 1;
    padding: 28px 32px;
    max-width: 1320px;
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .layout-content { padding: 20px 16px; }
    .topbar { padding: 0 16px; }
  }

  /* Mobile overlay */
  .mobile-overlay {
    position: fixed; inset: 0; z-index: 50;
    display: none;
  }
  .mobile-overlay.open { display: block; }
  .mobile-overlay-bg {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  }
  .mobile-overlay-sidebar {
    position: relative; width: 240px; height: 100%;
    animation: slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  /* Breadcrumb / path indicator */
  .path-crumb {
    font-size: 11px; color: #52505E;
    letter-spacing: 0.04em; font-weight: 500;
  }
  .path-sep { margin: 0 6px; color: #2A2A35; }

  /* Subtle grid background on main content area */
  .layout-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;

const pageMap = {
    "/dashboard": { title: "Dashboard", crumb: "Home" },
    "/expense-analysis": { title: "Analysis", crumb: "Transactions & Analysis" },
    "/saving-advice": { title: "Goals", crumb: "Goals & Savings" },
};

export default function Layout({ children }) {
    const user = useSelector((state) => state.user.user);
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isLoaderPopupOpen, setIsLoaderPopupOpen] = useState(false);
    const location = useLocation();

    const handleSaveProfile = async (data) => {
        try {
            setIsLoaderPopupOpen(true);
            const profile = await saveUserData(data);
            if (profile) {
                dispatch(setUserData(profile));
            }
            setIsLoaderPopupOpen(false);
            setIsProfileFormOpen(false);
        } catch (error) {
            console.error("Error saving user profile:", error);
            setIsLoaderPopupOpen(false);
        }
    };

    const page = pageMap[location.pathname] || { title: "Dashboard", crumb: "Home" };

    return (
        <div className="munshi-layout layout-bg">
            <style>{styles}</style>

            {/* Desktop Sidebar */}
            <div className="desktop-sidebar">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className={`mobile-overlay ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="mobile-overlay-bg" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="mobile-overlay-sidebar">
                    <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>

            {/* Main */}
            <div className="layout-main">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        {/* Mobile: hamburger + logo */}
                        <button
                            className="mobile-menu-btn"
                            style={{ display: 'none' }}
                            onClick={() => setIsMobileMenuOpen(true)}
                            id="mobile-menu-toggle"
                        >
                            <Menu size={18} />
                        </button>
                        <Link to="/dashboard" className="mobile-logo" style={{ display: 'none' }} id="mobile-logo">
                            Munshi<span>.</span>
                        </Link>

                        {/* Desktop: page title + breadcrumb */}
                        <div id="desktop-title">
                            <div className="page-title">{page.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                                <span className="path-crumb">Munshi</span>
                                <span className="path-sep">›</span>
                                <span className="path-crumb" style={{ color: '#C9A84C' }}>{page.crumb}</span>
                            </div>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="topbar-icon-btn" title="Notifications">
                            <Bell size={16} />
                            <div className="notif-dot" />
                        </button>
                        <HamburgerMenu />
                        <div 
                            className="avatar" 
                            title="Edit Profile"
                            onClick={() => setIsProfileFormOpen(true)}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1 }}>
                    <div className="layout-content">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Edit Profile Modal */}
            {isProfileFormOpen && (
                <Popup isOpen={isProfileFormOpen} onClose={() => setIsProfileFormOpen(false)} canClose={true} className="max-w-xl p-0 bg-transparent border-0 shadow-none">
                    <ProfileForm 
                        onClose={() => setIsProfileFormOpen(false)} 
                        onSubmit={handleSaveProfile} 
                        initialData={userData || {}} 
                    />
                </Popup>
            )}

            {/* Global Loader */}
            <Popup isOpen={isLoaderPopupOpen} onClose={() => setIsLoaderPopupOpen(false)} canClose={false} className="max-w-none border-0 bg-transparent p-0 shadow-none">
                <Loader fill="#C9A84C" />
            </Popup>

            <style>{`
                @media (max-width: 1023px) {
                    #mobile-menu-toggle { display: flex !important; }
                    #mobile-logo { display: flex !important; }
                    #desktop-title { display: none !important; }
                }
            `}</style>
        </div>
    );
}
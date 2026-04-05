import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Target, LogOut, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../services/auth.service";
import { logoutUser } from "../../store/slices/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .munshi-sidebar {
    font-family: 'DM Sans', sans-serif;
    position: fixed; left: 0; top: 0;
    height: 100vh; width: 240px;
    background: #0D0D10;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    z-index: 50;
  }

  .sidebar-logo-row {
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .sidebar-logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: #F0EDE6; letter-spacing: -0.02em; text-decoration: none;
  }

  .sidebar-logo span { color: #C9A84C; }

  .sidebar-nav {
    flex: 1; padding: 16px 12px;
    display: flex; flex-direction: column; gap: 4px;
  }

  .nav-section-label {
    font-size: 10px; font-weight: 600; color: #52505E;
    text-transform: uppercase; letter-spacing: 0.12em;
    padding: 0 12px; margin: 8px 0 6px;
  }

  .nav-link {
    display: flex; align-items: center; gap: 12px;
    height: 44px; padding: 0 14px; border-radius: 12px;
    font-size: 13.5px; font-weight: 500;
    text-decoration: none; transition: all 0.18s ease;
    position: relative; overflow: hidden;
  }

  .nav-link.active {
    background: rgba(201, 168, 76, 0.12);
    color: #C9A84C;
    border: 1px solid rgba(201, 168, 76, 0.22);
  }

  .nav-link.active .nav-icon { color: #C9A84C; }

  .nav-link.inactive {
    color: #8A8799;
    border: 1px solid transparent;
  }

  .nav-link.inactive:hover {
    background: rgba(255,255,255,0.04);
    color: #F0EDE6;
    border-color: rgba(255,255,255,0.07);
  }

  .nav-link.inactive:hover .nav-icon { color: #F0EDE6; }

  .nav-link-indicator {
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; background: #C9A84C;
    border-radius: 0 3px 3px 0; opacity: 0;
    transition: opacity 0.18s ease;
  }

  .nav-link.active .nav-link-indicator { opacity: 1; }

  .nav-icon { transition: color 0.18s ease; flex-shrink: 0; }

  .sidebar-bottom {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .logout-btn {
    display: flex; align-items: center; gap: 12px;
    width: 100%; height: 44px; padding: 0 14px;
    border-radius: 12px; border: 1px solid transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
    color: #52505E; background: transparent;
    cursor: pointer; transition: all 0.18s ease;
    text-align: left;
  }

  .logout-btn:hover {
    background: rgba(248, 113, 113, 0.08);
    color: #F87171;
    border-color: rgba(248, 113, 113, 0.15);
  }

  .close-btn {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
    color: #8A8799; width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease;
  }
  .close-btn:hover { background: rgba(255,255,255,0.08); color: #F0EDE6; }

  .sidebar-divider {
    height: 1px; background: rgba(255,255,255,0.05);
    margin: 8px 12px;
  }

  .brand-tag {
    padding: 0 24px 20px;
    font-size: 10px; color: #52505E; letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export default function Sidebar({ onClose }) {
    const location = useLocation();
    const dispatch = useDispatch();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Analysis", path: "/expense-analysis", icon: TrendingUp },
        { name: "Goals & Advice", path: "/saving-advice", icon: Target },
    ];

    const handleLogout = async () => {
        await logout();
        dispatch(logoutUser());
        window.location.reload();
    };

    return (
        <aside className="munshi-sidebar">
            <style>{styles}</style>

            {/* Logo */}
            <div className="sidebar-logo-row">
                <Link to="/dashboard" className="sidebar-logo">
                    Munshi<span>.</span>
                </Link>
                {onClose && (
                    <button className="close-btn lg:hidden" onClick={onClose}>
                        <X size={15} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Navigation</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={`nav-link ${isActive ? "active" : "inactive"}`}
                        >
                            <div className="nav-link-indicator" />
                            <Icon
                                size={17}
                                className="nav-icon"
                                strokeWidth={isActive ? 2.2 : 1.7}
                            />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={17} strokeWidth={1.7} />
                    <span>Sign out</span>
                </button>
            </div>

            <div className="brand-tag">Munshi © {new Date().getFullYear()}</div>
        </aside>
    );
}
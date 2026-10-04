import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store/useStore";
    import logo from '../../../assets/images/logo.png'

type MenuItem = {
    key: string;
    label: string;
    icon: React.ComponentType<any>;
};

type SidebarProps = {
    menu: MenuItem[];
    activeTab: string;
    onTabChange: (key: string) => void;
    isOpen: boolean; // Mobile open/close
    onClose: () => void;
};

const SideBar = ({
    menu,
    activeTab,
    onTabChange,
    isOpen,
    onClose,
}: SidebarProps) => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogOut = () => {
        sessionStorage.clear();
        navigate("/");
    };
    const { userStore } = useStore();

    return (
        <>
            {/* 1. Mobile Overlay (Darkens background when sidebar is open) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col
                    transition-all duration-300 ease-in-out
                    /* Mobile: Slide in/out */
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    /* Desktop: Always visible, dynamic width */
                    lg:static lg:translate-x-0 
                    ${isCollapsed ? "lg:w-24" : "lg:w-72"}
                `}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="cursor-pointer hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-500 hover:text-orange-500 shadow-md z-[60] transition-transform active:scale-90"
                >
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo Section */}
                <div className={`p-6 mb-4 transition-all duration-300 ${isCollapsed ? "lg:px-6" : "lg:p-8"}`}>
                    <div className="flex items-center gap-3 group cursor-pointer">
                        {/* Logo Container: Defined size ensures alignment */}
                        <div className="w-25 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Logo"
                                className="object-contain"
                            />
                        </div>

                        {/* Text: Ensure whitespace-nowrap so it doesn't stack during transition */}
                        <span className={`font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
                            }`}>
                            OwlStudy
                        </span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-hidden">
                    {menu.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => onTabChange(key)}
                            className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${activeTab === key
                                    ? "bg-gradient-to-br from-orange-50 to-rose-50 text-rose-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${activeTab === key ? "text-orange-500" : "text-slate-400"}`} />
                            <span className={`ml-3 whitespace-nowrap transition-all duration-300 origin-left ${isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* Security Activity (Mobile Only) */}
                <div className="lg:hidden px-4 mb-4">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-100">
                        <div className="relative flex h-2.5 w-2.5 mt-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                Security Activity
                            </span>
                            <span className="text-xs text-slate-600 break-words leading-snug">
                                {userStore.state.lastLoginTime}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="p-4 mt-auto border-t border-slate-100">
                    <button
                        onClick={handleLogOut}
                        className={`group flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-gradient-to-br from-orange-500 to-rose-500 active:scale-95 ${isCollapsed ? "px-0" : "px-5"}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3H21m0 0l-3-3m3 3l-3 3" />
                        </svg>
                        <span className={`transition-all duration-300 overflow-hidden ${isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"}`}>
                            Log Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SideBar;
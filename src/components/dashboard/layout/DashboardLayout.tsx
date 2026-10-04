import { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

type DashboardLayoutProps = {
    menu: any[];
    activeTab: string;
    onTabChange: (key: string) => void;
    children: React.ReactNode;
    name: string;
    onBlogClick?: () => void;
};

const DashboardLayout = ({
    menu,
    activeTab,
    onTabChange,
    children,
    name,
    onBlogClick
}: DashboardLayoutProps) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
            {/* Sidebar */}
            <SideBar
                menu={menu}
                activeTab={activeTab}
                onTabChange={(key) => {
                    onTabChange(key);
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} name={name} onBlogClick={onBlogClick} />

                <main className="flex-1 p-4 md:p-10 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
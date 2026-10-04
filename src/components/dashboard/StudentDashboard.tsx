import { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import NewBlog from '../blog/NewBlog';
import BlogDashboard from "../blog/BlogDashboard";
import DocumentUpload from "../document/DocumentUpload";

const IconDashboard = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const IconDocument = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: IconDashboard },
        { key: "document", label: "Documents", icon: IconDocument },
    ];

    const [showNewBlog, setShowNewBlog] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <BlogDashboard />;
            case "document":
                return <DocumentUpload />;
            default:
                return;
        }
    };

    return (
        <>
        <DashboardLayout
            menu={menu}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            name="Student Dashboard"
            onBlogClick={() => setShowNewBlog(true)}
        >
            {renderContent()}
        </DashboardLayout>

        {showNewBlog && (
            <NewBlog show={showNewBlog} onClose={() => setShowNewBlog(false)} />
        )}
        </>
    );

};

export default StudentDashboard;

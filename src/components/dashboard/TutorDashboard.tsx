import { useState } from "react";
import CalendarSchedule from "../schedule/CalendarSchedule";
import DashboardLayout from "./layout/DashboardLayout";
import AssignedStudents from "../assignedStudent/AssignedStudents";
import NewBlog from "../blog/NewBlog";
import UploadAssignment from "../assignment/UploadAssignment";

const IconSchedule = ({ className }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className={className}
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
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

const IconStudent = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TutorDashBoard = () => {

    const [activeTab, setActiveTab] = useState("schedule");
    const [showNewBlog, setShowNewBlog] = useState(false);

    const menu = [
        { key: "schedule", label: "Schedule", icon: IconSchedule },
        { key: "document", label: "Document", icon: IconDocument },
        { key: "assigned-students", label: "Students", icon: IconStudent }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "schedule":
                return <CalendarSchedule />;
            case "document":
                return <UploadAssignment />;
            case "assigned-students":
                return <AssignedStudents />;
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
                name="Tutor Dashboard"
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

export default TutorDashBoard;
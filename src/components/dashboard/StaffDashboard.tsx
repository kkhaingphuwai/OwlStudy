import { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import AllocationScreen from "../allocation/AllocationScreen";
import ExceptionReport from "../report/ExceptionReport";

const IconAllocation = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
    </svg>
);

const IconReportAnalytics = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);


const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("report");

    const menu = [
        { key: "report", label: "Exception Report", icon: IconReportAnalytics },
        { key: "allocation", label: "Allocation", icon: IconAllocation }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "report":
                return <ExceptionReport />;
            case "allocation":
                return <AllocationScreen />;
            default:
                return;
        }
    };

    return (
        <DashboardLayout
            menu={menu}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            name="Staff Dashboard"
        >
            {renderContent()}
        </DashboardLayout>
        
    );
};

export default StaffDashboard;

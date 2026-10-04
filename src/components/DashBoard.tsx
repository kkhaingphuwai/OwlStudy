import PermissionGate from "./auth/PermissionGate";
import StaffDashboard from "./dashboard/StaffDashboard";
import StudentDashboard from "./dashboard/StudentDashboard";
import TutorDashboard from "./dashboard/TutorDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";  

const Dashboard = () => {
  return (
    <>
      <div>
        <PermissionGate permissions={["VIEW_STAFF_DASHBOARD"]}>
          <StaffDashboard />
        </PermissionGate>

        <PermissionGate permissions={["VIEW_STUDENT_DASHBOARD"]}>
          <StudentDashboard />
        </PermissionGate>

        <PermissionGate permissions={["VIEW_TUTOR_DASHBOARD"]}>
          <TutorDashboard />
        </PermissionGate>
      </div>

      <PermissionGate permissions={["VIEW_ADMIN_DASHBOARD"]}> 
        <AdminDashboard />
      </PermissionGate>
    </>
  );
};

export default Dashboard;

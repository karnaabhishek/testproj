import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import DashboardView from "@/views/Admin/DashboardView";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import StudentLayout from "@/layouts/User/User";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  if (user?.role === "STUDENT")
    return <WithLayout layout={StudentLayout} component={DashboardView} />;
  return <WithLayout layout={AdminLayout} component={DashboardView} />;
};

export default WithAuth(UserDashboard);

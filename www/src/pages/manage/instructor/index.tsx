import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import InstructorListView from "@/views/Admin/InstructorView";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER LIST PAGE ||============================== //
const UserList = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={InstructorListView} />;
  return <WithLayout layout={AdminLayout} component={InstructorListView} />;
};

export default WithAuth(UserList);

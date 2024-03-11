import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import StudentLayout from "@/layouts/User/User";
import StudentManagementView from "@/views/Admin/StudentManagementView";
import ProfileView from "@/views/Client/ProfileView";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| STUDENT LIST PAGE ||============================== //
const UserList = () => {
  // const user = useSelector(
  //   (state: IRootState) => state?.auth?.currentUser?.user
  // );
  // if (user?.role === "STUDENT")
  //   return <WithLayout layout={StudentLayout} component={ProfileView} />;
  return <WithLayout layout={AdminLayout} component={StudentManagementView} />;
};

export default WithAuth(UserList);

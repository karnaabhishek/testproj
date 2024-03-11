import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import ProfileView from "@/views/Client/ProfileView";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import StudentLayout from "@/layouts/User/User";

// ==============================|| PROFILE DETAILS PAGE ||============================== //
const UserProfile = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  if (user?.role === "STUDENT")
    return <WithLayout layout={StudentLayout} component={ProfileView} />;
  return <WithLayout layout={AdminLayout} component={ProfileView} />;
};

export default WithAuth(UserProfile);

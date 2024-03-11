import React from "react";

// project imports
import LoginView from "@/views/Auth/LoginView";
import WithLayout from "@/components/WithLayout";
import Blank from "@/layouts/Blank";
import withPublicRoute from "@/components/WithPublicRoute";

// ==============================|| LOGIN PAGE ||============================== //

const Login = () => {
  return <WithLayout layout={Blank} component={LoginView} />;
};

export default withPublicRoute(Login);

import React from "react";
import WithLayout from "@/components/WithLayout";
import Blank from "@/layouts/Blank";
import RegisterView from "@/views/Auth/RegisterView";

const signup = () => {
  return <WithLayout layout={Blank} component={RegisterView} />;
};

export default signup;

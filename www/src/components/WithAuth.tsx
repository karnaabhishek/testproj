import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import IRootState from "../store/interface"; // Assuming you have a RootState interface
import { Box } from "@mui/material";
import Image from "next/image";
import Loader from "./Loader";

interface Props {}

const WithAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent: React.FC<P> = (props) => {
    const isAuthenticated = useSelector(
      (state: IRootState) => state.auth.isAuthenticated
    );
    const authLoading = useSelector(
      (state: IRootState) => state.auth.authLoading
    );
    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect them to the login page
      if (!isAuthenticated && !authLoading) {
        router.replace("/login"); // Use replace instead of push to prevent back button from taking user to the protected page
      }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
      return <Loader />;
    }

    // Render the wrapped component only if authenticated
    return isAuthenticated ? <WrappedComponent {...(props as P)} /> : null;
  };

  return AuthComponent;
};

export default WithAuth;

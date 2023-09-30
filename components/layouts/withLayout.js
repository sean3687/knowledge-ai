// components/DynamicLayout.js
import DashboardLayout from "./dashboardLayout";
import SinglePageLayout from "./singlePageLayout";
import { useState, useEffect } from "react";

function withLayout(WrappedComponent, layoutType) {
  return function LayoutWrapper(props) {
    const [accessToken, setAccessToken] = useState("");
    const [nameString, setNameString] = useState("")

    useEffect(() => {
      setAccessToken(sessionStorage.getItem("accessToken") || "");
      setNameString(sessionStorage.getItem("name") || "")
    }, []);

    if (layoutType === "dashboard") {
      return (
        <DashboardLayout accessToken={accessToken} name={nameString}>
          <WrappedComponent {...props} accessToken={accessToken} />
        </DashboardLayout>
      );
    } else if (layoutType === "login") {
      const LayoutWithSinglePage = SinglePageLayout(WrappedComponent);
      return <LayoutWithSinglePage {...props} />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withLayout;

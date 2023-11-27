// components/DynamicLayout.js
import DashboardLayout from "./dashboardLayout";
import SinglePageLayout from "./singlePageLayout";

function withLayout(WrappedComponent, layoutType) {
  return function LayoutWrapper(props) {
    if (layoutType === "dashboard") {
      return (
        <DashboardLayout>
          <WrappedComponent {...props}/>
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

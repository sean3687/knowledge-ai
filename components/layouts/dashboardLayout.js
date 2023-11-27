import ResponsiveNavbar from "../navigation/responsiveNavbar"
import { useState, useEffect } from "react";


function DashboardLayout({ children, accessToken, username}) {

    return (
        <div className="flex flex-col h-screen lg:flex-row">
            <ResponsiveNavbar />
            <div className="w-full overflow-y-auto bg-white">
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;






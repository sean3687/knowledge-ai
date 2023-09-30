import Navbar from "../../components/responsiveNavbar"
import { useState, useEffect } from "react";


function DashboardLayout({ children, accessToken, name }) {
    return (
        <div className="flex flex-col h-screen lg:flex-row">
            <Navbar accessToken={accessToken} name={name}/>
            <div className="w-full overflow-y-auto bg-slate-100">
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;






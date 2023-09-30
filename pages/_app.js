import "../styles/globals.css";
import DashboardLayout from "../components/layouts/dashboardLayout";
import LoginLayout from "../components/layouts/singlePageLayout";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

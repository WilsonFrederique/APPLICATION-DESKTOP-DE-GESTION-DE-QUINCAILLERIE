import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Layout/Header";

const MainLayout = () => {
    return (
        <>
            <Header />
            <div className="h-[calc(100vh-40px)] mt-[45px]">
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;
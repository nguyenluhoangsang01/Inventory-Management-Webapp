import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import bgSvg from "../assets/bg-svg.svg";

const Auth = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <div className="absolute inset-0 overflow-hidden">
        <img src={bgSvg} alt="bg" />
      </div>

      <div className="z-30 relative w-full pt-20">
        <div className="flex flex-col items-center justify-center">
          <img
            src="https://stc-zaloid.zdn.vn/zaloid/client/images/zlogo.png"
            alt="logo"
            className="w-36 mb-6"
          />

          <p>
            {pathname === "/login"
              ? "Sign in to Zalo account to connect to Zalo Web"
              : pathname === "/register" &&
                "Create a Zalo account to connect to Zalo Web"}
          </p>
        </div>

        <div className="max-w-md h-full mx-auto mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;

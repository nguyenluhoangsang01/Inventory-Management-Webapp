import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Default = () => {
  return (
    <div className="flex">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default Default;

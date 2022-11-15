import React from "react";
import { RiLogoutBoxRLine, RiProfileLine } from "react-icons/ri";

const sideBarItems = [
  {
    title: "Profile",
    icon: <RiProfileLine />,
  },
  {
    title: "Logout",
    icon: <RiLogoutBoxRLine />,
  },
];

const Sidebar = () => {
  return (
    <div className="bg-[#0091FF] text-white w-16 h-screen">
      {sideBarItems.map((sideBarItem) => (
        <div
          key={sideBarItem.title}
          title={sideBarItem.title}
          className="w-16 h-16 flex items-center justify-center hover:bg-[#006EDC] cursor-pointer transition"
        >
          {sideBarItem.icon}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

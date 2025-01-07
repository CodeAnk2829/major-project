import { Sidebar } from "flowbite-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiBell,
  HiChartPie,
  HiHome,
  HiOutlineUser,
  HiUser,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { FaSignOutAlt } from "react-icons/fa";

const getInitials = (name: string) => {
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0]
      : nameParts[0][0] + nameParts[nameParts.length - 1][0];
  return initials.toUpperCase();
};

const SideBar = () => {
  const customTheme = {
    root: {
      base: "h-full",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded bg-[rgb(222,224,244)] py-4 dark:bg-gray-800 h-screen",
    },
    collapse: {
      button:
        "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      icon: {
        base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        open: {
          off: "",
          on: "text-gray-900",
        },
      },
      label: {
        base: "ml-3 flex-1 whitespace-nowrap text-left",
        icon: {
          base: "h-6 w-6 transition delay-0 ease-in-out",
          open: {
            on: "rotate-180",
            off: "",
          },
        },
      },
      list: "space-y-2 py-2",
    },
    cta: {
      base: "mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700",
      color: {
        blue: "bg-cyan-50 dark:bg-cyan-900",
        dark: "bg-dark-50 dark:bg-dark-900",
        failure: "bg-red-50 dark:bg-red-900",
        gray: "bg-alternative-50 dark:bg-alternative-900",
        green: "bg-green-50 dark:bg-green-900",
        light: "bg-light-50 dark:bg-light-900",
        red: "bg-red-50 dark:bg-red-900",
        purple: "bg-purple-50 dark:bg-purple-900",
        success: "bg-green-50 dark:bg-green-900",
        yellow: "bg-yellow-50 dark:bg-yellow-900",
        warning: "bg-yellow-50 dark:bg-yellow-900",
      },
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ml-2",
      active: "bg-gray-100 dark:bg-gray-700",
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-75",
        noIcon: "font-bold",
      },
      content: {
        base: "flex-1 whitespace-nowrap px-3",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-gray-700 dark:text-gray-100",
      },
      label: "",
      listItem: "",
    },
    items: {
      base: "",
    },
    itemGroup: {
      base: "mt-4 space-y-2 border-t border-[rgb(60,79,131)] pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
    logo: {
      base: "mb-5 flex items-center bg-gray-50 w-96 pl-2 py-2.5 -mt-5 dark:bg-gray-800",
      collapsed: {
        on: "hidden",
        off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
      },
      img: "mr-3 h-6 sm:h-7",
    },
  };
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      const res = await fetch("", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar
      className="w-96 min-h-screen flex flex-col justify-between p-0 "
      theme={customTheme}
    >
      {/* Sidebar Logo */}
      <Sidebar.Logo
        href="#"
        img="/manit_logo.png"
        imgAlt="MANIT logo"
        className="[&>img]:h-16 [&>img]:w-16 [&>img]:rounded-lg border-none"
      >
        <div>
          <span className="text-xl font-bold text-gray-800">Maulana Azad</span>
          <br />
          <span className="text-lg font-semibold text-gray-700">
            National Institute of Technology
          </span>
          <br />
          <span className="text-md font-light text-gray-600">
            Complaint Portal
          </span>
        </div>
      </Sidebar.Logo>

      <Sidebar.Items className="">
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && (
            <Link to="/">
              <Sidebar.Item icon={HiHome} as="div" className="text-xl py-5 ">
                Home
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && (
            <Link to="/dashboard">
              <Sidebar.Item icon={HiChartPie} as="div" className="text-xl py-5">
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && (
            <Link to="/notifications">
              <Sidebar.Item icon={HiBell} as="div" className="text-xl py-5">
                Notifications
              </Sidebar.Item>
            </Link>
          )}

          {currentUser && (
            <Link to="/profile">
              <Sidebar.Item icon={HiUser} as="div" className="text-xl py-5">
                Profile
              </Sidebar.Item>
            </Link>
          )}
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup className="flex flex-col gap-1 items-center">
          {currentUser && (
            <button className="text-white bg-[rgb(60,79,131)] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-5 text-center me-2 mb-2 mt-64 w-64 ">
              Create Complaint
            </button>
          )}

          <div className="mt-auto w-full p-4 rounded-lg flex items-center gap-4 pb-2">
            {currentUser && (
              <div className="w-16 h-16 bg-[rgb(60,79,131)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(currentUser?.name || "Guest User")}
              </div>
            )}
            <div>
              <h2 className="font-bold">@{currentUser?.name}</h2>
              <p className="text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={FaSignOutAlt}
            className="cursor-pointer py-5"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SideBar;

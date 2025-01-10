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
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import CreateComplaintModal from "./CreateComplaintModal";
import { FaChevronRight } from "react-icons/fa6";

const getInitials = (name: string) => {
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0]
      : nameParts[0][0] + nameParts[nameParts.length - 1][0];
  return initials.toUpperCase();
};

const SideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(true);
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
    <div className="flex ">
      <div
        className={` ${
          open ? "w-full" : "w-24"
        } bg-[rgb(224,224,244)] min-h-screen h-full p-5 pt-8 relative duration-300`}
      >
        <FaChevronRight
          className={`absolute cursor-pointer -right-3 top-9 w-7 bg-white border-dark-purple
        border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
          color="bg-rgb[(224,224,244)]"
          fontSize="1.5em"
        />

        <div className={`flex gap-x-4 items-center`}>
          <img
            src="/manit_logo.png"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg] h-16"
            }`}
          />
          <div className={`${!open && "hidden"}`}>
            <span className="text-xl font-bold text-gray-800">
              Maulana Azad
            </span>
            <br />
            <span className="text-lg font-semibold text-gray-700">
              National Institute of Technology
            </span>
            <br />
            <span className="text-md font-light text-gray-600">
              Complaint Portal
            </span>
          </div>
        </div>

        <ul className="pt-6">
          <div className="flex-grow">
            <Link to={"/"}>
              <li
                className={`flex rounded-md p-3.5 cursor-pointer text-gray-800 hover:bg-gray-100 items-center gap-x-4 mt-3 text-2xl} `}
              >
                <HiHome className="text-2xl" />
                <span
                  className={`${
                    !open && "hidden"
                  } origin-left duration-200 text-2xl`}
                >
                  Home
                </span>
              </li>
            </Link>

            <Link to={"/dashboard"}>
              <li
                className={`flex rounded-md p-3.5 cursor-pointer text-gray-800 hover:bg-gray-100 items-center gap-x-4 mt-3 text-2xl} `}
              >
                <HiChartPie className="text-2xl" />
                <span
                  className={`${
                    !open && "hidden"
                  } origin-left duration-200 text-2xl`}
                >
                  Dashboard
                </span>
              </li>
            </Link>
            <Link to={"/notifications"}>
              <li
                className={`flex rounded-md p-3.5 cursor-pointer text-gray-800 hover:bg-gray-100 items-center gap-x-4 mt-3 text-2xl} `}
              >
                <HiBell className="text-2xl" />
                <span
                  className={`${
                    !open && "hidden"
                  } origin-left duration-200 text-2xl`}
                >
                  Notifications
                </span>
              </li>
            </Link>

            <Link to={"/profile"}>
              <li
                className={`flex rounded-md p-3.5 cursor-pointer text-gray-800 hover:bg-gray-100 items-center gap-x-4 mt-3 text-2xl} `}
              >
                <HiUser className="text-2xl" />
                <span
                  className={`${
                    !open && "hidden"
                  } origin-left duration-200 text-2xl`}
                >
                  Profile
                </span>
              </li>
            </Link>

            <li
              className={`flex justify-center rounded-md p-3.5 cursor-pointer text-gray-800  items-center gap-x-4 mt-3 text-2xl} `}
            >
              <button
                className={` text-white bg-[rgb(60,79,131)] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-5 text-center w-2/3 mt-10 ${
                  !open && "hidden"
                }`}
                onClick={() => setIsModalOpen(true)}
              >
                Create Complaint
              </button>
              {!open && (
                <FaPlus
                  className="text-2xl"
                  onClick={() => setIsModalOpen(true)}
                />
              )}
            </li>

            <Link to={"/profile"}>
              <li
                className={`flex rounded-md p-3.5 cursor-pointer hover:bg-light-white text-gray-800  items-center gap-x-4 mt-3`}
              >
                <div
                  className={`flex items-center ${
                    !open ? "justify-center" : "justify-start"
                  } w-full p-4`}
                >
                  <div
                    className={`${
                      open ? "w-16 h-16" : "w-12 h-12 text-xl"
                    } bg-[rgb(60,79,131)] rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                  >
                    {getInitials(currentUser?.name || "Guest User")}
                  </div>
                  {open && (
                    <div className="ml-4">
                      <h2 className="font-bold">@{currentUser?.name}</h2>
                      <p className="text-gray-500">{currentUser?.email}</p>
                    </div>
                  )}
                </div>
              </li>
            </Link>

            <li
              className={`flex rounded-md p-3.5 cursor-pointer hover:bg-light-white text-gray-800 hover:bg-gray-100 items-center gap-x-4 mt-3 text-2xl `}
              onClick={handleSignout}
            >
              <FaSignOutAlt className="text-2xl" />
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-200 text-2xl`}
              >
                Sign Out
              </span>
            </li>
          </div>
        </ul>
      </div>
      <CreateComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SideBar;

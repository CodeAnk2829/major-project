import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { signOutSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  console.log(currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customThemeTi = {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      rightIcon: {
        base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "p-4 sm:text-base",
        },
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
        },
        withRightIcon: {
          on: "pr-10",
          off: "",
        },
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
      },
    },
  };
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(" ");
    const initials =
      nameParts.length === 1
        ? nameParts[0][0]
        : nameParts[0][0] + nameParts[nameParts.length - 1][0];
    return initials.toUpperCase();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

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

  const handleDeleteUser = async () => {
    setShowModal(false);
    // try {
    //     dispatch(deleteUserStart());
    //     const res = await fetch(`/api/user/delete/${currentUser._id}`,{
    //         method: 'DELETE',
    //     });
    //     const data = await res.json();
    //     if(!res.ok){
    //         dispatch(deleteUserFailure(data.message));
    //     }else{
    //         dispatch(deleteUserSuccess(data));
    //     }
    // } catch (error) {
    //     dispatch(deleteUserFailure(error.message));
    // }
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    // setUpdateUserError(null);
    // setUpdateUserSuccess(true);
    // if(Object.keys(formData).length === 0){
    //     setUpdateUserError('No changes made');
    //     return;
    // }
    // try {
    //     dispatch(updateStart());
    //     const res = await fetch(`/api/user/update/${currentUser._id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(formData),
    //       });
    //     const data = await res.json();

    //     if(!res.ok){
    //         dispatch(updateFailure(data.message));
    //         setUpdateUserError(data.message);
    //     }else{
    //         dispatch(updateSuccess(data));
    //         setUpdateUserSuccess("User profile updated successfully");
    //     }
    // } catch (error) {
    //     dispatch(updateFailure(error.message));
    // }
}
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <Sidebar isAdmin={currentUser.role === 'ADMIN'}/>
      </div>

      {/* Main content */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        <div className="max-w-lg mx-auto p-3 w-full">
          <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
              <div
                className={`bg-[rgb(60,79,131)] rounded-full  w-full h-full flex items-center justify-center text-white text-5xl font-bold`}
              >
                {getInitials(currentUser?.name || "Guest User")}
              </div>
            </div>
            <TextInput
              type="text"
              id="name"
              placeholder="Name"
              defaultValue={currentUser.name}
              theme={customThemeTi}
              onChange={handleChange}
              className="mt-5"
            />
            <TextInput
              type="email"
              id="email"
              placeholder="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              theme={customThemeTi}
            />
            <TextInput
              type="password"
              id="password"
              placeholder="password"
              theme={customThemeTi}
              onChange={handleChange}
            />
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              outline
              disabled={loading}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
          </form>
          <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer" onClick={() => setShowModal(true)}>
              Delete Account
            </span>
            <span className="cursor-pointer" onClick={handleSignout}>
              Sign Out
            </span>
          </div>
          {updateUserSuccess && (
            <Alert color="success" className="mt-5">
              {updateUserSuccess}
            </Alert>
          )}

          {updateUserError && (
            <Alert color="failure" className="mt-5">
              {updateUserError}
            </Alert>
          )}

          {error && (
            <Alert color="failure" className="mt-5">
              {error}
            </Alert>
          )}

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete your account?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteUser}>
                    Yes, I'm sure
                  </Button>

                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Profile;

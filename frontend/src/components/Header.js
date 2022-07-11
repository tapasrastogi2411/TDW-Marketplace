import React from "react";
import { Link } from "react-router-dom";
import { signOutOfApp, getCurrentUser } from "../service/auth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOutOfApp();
    const user = getCurrentUser();
    if (user === null) {
      console.log("User Signed Out.");
      navigate("/");
    }
  };

  return (
    <div className="h-14 w-full flex justify-center p-1 mb-2 bg-blue-200">
      {!currentUser ? (
        <div className="ml-auto mr-3 self-center">
          <Link
            to="/login"
            className="bg-black px-3 py-1 text-white rounded-md"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <button
          onClick={() => handleSignOut()}
          className="ml-auto mr-3 self-center"
        >
          <div className="bg-black px-3 py-1 text-white rounded-md">
            Sign out
          </div>
        </button>
      )}
    </div>
  );
}

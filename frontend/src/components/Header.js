import React, { useContext} from "react";
import { Link } from "react-router-dom";
import { signOutOfApp } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import app from "../config/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth(app);

  //Used for updating user on refresh since firebase uses asynchronus calls so on refresh, user could be null 
  //even if the user is logged in. Need to wait for firebase to update the user.  
  onAuthStateChanged(auth, (user) => { 
    if (user) { 
      //Set signed in user
      setUser(user); 
    }else { 
      //Set user to null when they logout
      setUser(null); 
    }
  }); 

  const handleSignOut = async () => {
    await signOutOfApp();
    navigate("/");
  };

  return (
    <div className="h-14 w-full flex justify-center p-1 mb-2 bg-blue-200">
      <div className="ml-auto mr-3 self-center">
        <Link
          to="/"
          className="bg-black px-3 py-1 text-white rounded-md"
        >
          <img alt="Logo" src="../images/tdwmarketlogo.png"></img>
        </Link>
      </div>
      {!user ? (
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

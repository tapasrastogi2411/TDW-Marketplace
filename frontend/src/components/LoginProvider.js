import React from "react";
import { signInToApp, signOutOfApp, getCurrentUser } from "../service/auth";
import {
  googleProvider,
  facebookProvider,
  githubProvider,
  microsoftProvider,
} from "../config/authMethods";
import { useNavigate } from "react-router-dom";

export default function LoginProvider(props) {
  const navigate = useNavigate();
  const handleSignIn = async (provider) => {
    await signInToApp(provider);
    const user = getCurrentUser();
    if (user) {
      navigate("/");
    }
  };

  const providers = {
    Google: googleProvider,
    Microsoft: microsoftProvider,
  };
  return (
    <button
      onClick={() => handleSignIn(providers[props.details.providerName])}
      className="flex justify-center items-center border w-1/4 ml-auto mr-auto border-current py-3 rounded-3xl	mt-3	"
    >
      <div>
        <img className="w-8 h-8" src={props.details.icon} />
      </div>
      <div className="ml-3"> Continue with {props.details.providerName}</div>
    </button>
  );
}

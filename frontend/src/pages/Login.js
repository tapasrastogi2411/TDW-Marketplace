import React from "react";
import Header from "../components/Header";
import LoginProvider from "../components/LoginProvider";

export default function Login(props) {
  const googleProviderDetail = {
    icon: "/google-icon.png",
    providerName: "Google",
  };

  return (
    <div>
      <Header />
      <div className="text-center text-xl mb-4 pt-4 font-medium">
        Sign in to access our website and its features!
      </div>
      <LoginProvider details={googleProviderDetail} />
    </div>
  );
}

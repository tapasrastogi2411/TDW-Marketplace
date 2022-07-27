import React from "react";
import Header from "../components/Header";
import LoginProvider from "../components/LoginProvider";

export default function Login(props) {

  const googleProviderDetail = {
    icon: "/google-icon.png",
    providerName: "Google",
  };

  const microsoftProviderDetail = {
    icon: "/microsoft-icon.svg",
    providerName: "Microsoft",
  };

  return (
    <div>
      <Header />
      <div className="text-center text-xl mb-4 font-medium">
        Sign in with any of the following:
      </div>
      <LoginProvider details={googleProviderDetail} />
      <LoginProvider details={microsoftProviderDetail} />
    </div>
  );
}

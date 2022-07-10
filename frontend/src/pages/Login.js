import React from "react";
import Header from "../components/Header";
import LoginProvider from "../components/LoginProvider";

export default function Login(props) {
  const googleProviderDetail = {
    icon: "https://cdn.icon-icons.com/icons2/2699/PNG/512/google_logo_icon_169090.png",
    providerName: "Google",
  };

  const microsoftProviderDetail = {
    icon: "https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/media/microsoft_logo.svg",
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

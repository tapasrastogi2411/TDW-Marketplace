import React from 'react'
import Header from "../components/Header"
import LoginProvider from "../components/LoginProvider"

export default function Login(props) {
  const googleProviderDetail = {
    "icon": "https://cdn.icon-icons.com/icons2/2699/PNG/512/google_logo_icon_169090.png",
    "providerName": "Google"
  }
    
  return (
    <div>
      <Header />
      <div class="text-center text-xl mb-4 font-medium">Sign in with any of the following:</div>      
      <LoginProvider details={googleProviderDetail}/>
    </div>
  )
}

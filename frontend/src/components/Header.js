import React from 'react'

export default function Header() {
  return (
    <div className="h-14 w-full flex justify-center p-1 mb-2 bg-blue-200">
        {/* TODO: if signed in show signout, signed out show signin */}
        <a href="" className="ml-auto mr-3 self-center">
            <div className="bg-black px-3 py-1 text-white rounded-md">Sign in</div>
        </a>
    </div>
  )
}

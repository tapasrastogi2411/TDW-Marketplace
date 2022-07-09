import React from 'react'

export default function LoginProvider(props) {
  return (
    <a href="" className="flex justify-center items-center border w-1/4 ml-auto mr-auto border-current py-3 rounded-3xl	mt-3	">
        <div>
            <img className="w-8 h-8" src={props.details.icon} />
        </div>
        <div className="ml-3"> Continue with {props.details.providerName}</div>
    </a>
  )
}

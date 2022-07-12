import React from "react";
import { getCurrentUser } from "../service/auth";
import Cookies from "js-cookie";
const axios = require("axios").default;

export default function Listing(props) {
  function scheduleEvent() {
    const refresh = Cookies.get("refresh");
    const config = {
      headers: { Authorization: `Bearer ${refresh}` },
    };
    axios
      .post("http://localhost:5001/api/tasks/google_calendar", {}, config)
      .then(console.log)
      .catch(console.log);
  }
  return (
    <div className="w-11/12 ml-auto mr-auto border-black border p-3 mb-5 mt-3">
      <div className="flex justify-between	">
        <img
          className="max-h-36 max-w-md"
          src={props.details.imageUrl}
          alt="item for listing"
        ></img>
        <div className="w-2/5 ml-3 flex-row">
          <div className="font-semibold">{props.details.itemName}</div>
          <div className="mt-9">{props.details.itemDescription}</div>
        </div>
        <div className="">
          <div className="font-semibold">Starting bid:</div>
          <div className="mt-9">{props.details.startingBid}</div>
        </div>
        <div className="">
          <div className="font-semibold">Date of bid:</div>
          <div className="mt-9">{props.details.dateOfBid}</div>
        </div>
        <div className="flex items-center ml-4 mr-2">
          {/* TODO: button for starting video bidding session? */}
          <button
            className="bg-purple-300 p-2 rounded-md"
            onClick={() => scheduleEvent()}
          >
            {" "}
            Add to calendar
          </button>
        </div>
        <div className="flex items-center ml-4 mr-2">
          {/* TODO: fix this to call api */}
          <a className="bg-purple-300 p-2 rounded-md" href="">
            {" "}
            More details
          </a>
        </div>
      </div>
    </div>
  );
}

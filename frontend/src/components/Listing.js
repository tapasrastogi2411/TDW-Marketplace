import React, { useContext } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const axios = require("axios").default;

export default function Listing(props) {
  const { user, setUser } = useContext(UserContext);
  console.log(props.details);

  function scheduleEvent() {
    const refresh = Cookies.get("refresh");
    const config = {
      headers: { Authorization: `Bearer ${refresh}` },
    };
    axios
      .post("/api/tasks/google_calendar", {}, config)
      .then(console.log)
      .catch(console.log);
  }

  const startAuction = async () => {
    try {
      await axios.put("/products/updateProduct", {
        id: props.details._id,
        roomStatus: true,
        biddingDate: props.details.biddingDate,
        description: props.details.description,
        name: props.details.name,
        roomId: props.details.roomId,
        startingBid: props.details.startingBid,
        uid: props.details.uid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-11/12 ml-auto mr-auto border-black border p-3 mb-5 mt-3">
      <div className="flex justify-between	">
        <img
          className="max-h-36 max-w-md"
          src={props.details.imageUrl}
          alt="item for listing"
        ></img>
        <div className="w-2/5 ml-3 flex-row">
          <div className="font-semibold">{props.details.name}</div>
          <div className="mt-9">{props.details.description}</div>
        </div>
        <div className="">
          <div className="font-semibold">Starting bid:</div>
          <div className="mt-9">{props.details.startingBid}</div>
        </div>
        <div className="">
          <div className="font-semibold">Date of bid:</div>
          <div className="mt-9">{props.details.biddingDate}</div>
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
          {props.details.roomStatus === true && (
            <Link
              to={`/auction_session/${props.details.roomId}`}
              className="bg-black px-3 py-1 text-white rounded-md"
            >
              Join Auction
            </Link>
          )}
          {props.details.roomStatus === false &&
            user &&
            user.uid === props.details.uid && (
              <button
                className="bg-purple-300 p-2 rounded-md"
                onClick={() => startAuction()}
              >
                Start Auction
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

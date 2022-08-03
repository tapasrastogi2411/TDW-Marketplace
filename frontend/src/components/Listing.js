import React, { useContext } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { storage } from "../config/firebase-config";
import { ref, deleteObject } from "firebase/storage";
// import io from "socket.io-client";
// const axios = require("axios").default;
import Axios from "../axiosBaseURL";
import { useState } from "react";

export default function Listing(props) {
  const { user, setUser } = useContext(UserContext);
  const [dropdown, setdropdown] = useState(false);
  const googleToken = Cookies.get("google_id_token");
  const showCalendar = googleToken && user;
  const showJoin = props.details.roomStatus === true && user;
  const showStart =
    props.details.roomStatus === false &&
    user &&
    user.uid === props.details.uid;
  const showStop =
    props.details.roomStatus === true && user && user.uid === props.details.uid;
  const showDelete = user && user.uid === props.details.uid;
  function scheduleEvent() {
    const config = {
      headers: { Authorization: `Bearer ${googleToken}` },
    };
    Axios.post(
      `/api/products/${props.details._id}/tasks/google_calendar`,
      {},
      config
    )
      .then(() => {
        props.setMessage({
          content: "Scheduled to add to your calendar!",
          status: "Success",
        });
      })
      .catch(() => {
        props.setMessage({
          content: "Please try again later to add to calendar",
          status: "Failure",
        });
      });
  }
  // TODO: Probably want to check for authorization in the backend when trying to delete, start auction, and end auction
  const startAuction = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      };
      await Axios.patch(
        "/api/products/",
        {
          id: props.details._id,
          roomStatus: true,
          biddingDate: props.details.biddingDate,
          description: props.details.description,
          name: props.details.name,
          startingBid: props.details.startingBid,
          uid: props.details.uid,
          productImage: props.details.productImage,
        },
        config
      );
      props.refetch();
      // io.to(props.details._id).emit("disconnect")
    } catch (err) {
      console.log(err);
    }
  };

  const stopAuction = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      };
      await Axios.patch(
        "/api/products/",
        {
          id: props.details._id,
          roomStatus: false,
          biddingDate: props.details.biddingDate,
          description: props.details.description,
          name: props.details.name,
          startingBid: props.details.startingBid,
          uid: props.details.uid,
          productImage: props.details.productImage,
        },
        config
      );
      props.refetch();
      //TODO: probably want to remove all people currently in the room and give them an appropriate error message !
    } catch (err) {
      console.log(err);
    }
  };

  const deleteListing = () => {
    try {
      const imageRef = ref(storage, props.details.productImage);
      deleteObject(imageRef)
        .then(async () => {
          const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          };
          await Axios.delete("/api/products/" + props.details._id, config);
          props.refetch();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-11/12 ml-auto mr-auto p-3 mb-5 mt-3 rounded-lg shadow-[2px_2px_20px_2px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between">
        <img
          className="object-contain h-32 w-20 sm:w-32 md:w-48 flex-start"
          src={props.details.productImage}
          alt="item for listing"
        ></img>
        <div className="w-2/5 ml-3 flex-row">
          <div className="font-semibold text-xl">{props.details.name}</div>
          <div className="mt-9">{props.details.description}</div>
        </div>
        <div className="hidden md:block mr-12">
          <div className="font-semibold">Starting bid:</div>
          <div className="mt-9">${props.details.startingBid}</div>
        </div>
        <div className="hidden md:block mr-10">
          <div className="font-semibold">Date of bid:</div>
          <div className="mt-9">{props.details.biddingDate}</div>
        </div>
        <div className="relative inline-block text-left">
          <div>
            <button
              onClick={() => setdropdown(!dropdown)}
              type="button"
              className={
                showCalendar || showJoin || showStart || showStop || showDelete
                  ? "inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  : "invisible"
              }
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Options
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {dropdown && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {showCalendar && (
                  <a
                    onClick={() => scheduleEvent()}
                    className="text-gray-700 hover:bg-gray-300 block px-4 py-2 text-sm hover:cursor-pointer"
                  >
                    Add to Calendar
                  </a>
                )}
                {showJoin && (
                  <Link
                    to={`/auction_session/${props.details._id}`}
                    className="text-gray-700 hover:bg-gray-300 block px-4 py-2 text-sm"
                  >
                    Join Auction
                  </Link>
                )}
                {showStart && (
                  <a
                    className="text-gray-700 hover:bg-gray-300 block px-4 py-2 text-sm hover:cursor-pointer"
                    onClick={() => startAuction()}
                  >
                    Start Auction
                  </a>
                )}
                {showStop && (
                  <a
                    className="text-gray-700 hover:bg-gray-300 block px-4 py-2 text-sm hover:cursor-pointer"
                    onClick={() => stopAuction()}
                  >
                    Stop Auction
                  </a>
                )}
                {showDelete && (
                  <a
                    className="text-gray-700 hover:bg-gray-300 block px-4 py-2 text-sm hover:cursor-pointer"
                    onClick={() => deleteListing()}
                  >
                    Delete Listing
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

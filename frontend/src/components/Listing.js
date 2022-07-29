import React, { useContext } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { storage } from "../config/firebase-config";
import { ref, deleteObject } from "firebase/storage"

// const axios = require("axios").default;
import Axios from '../axiosBaseURL'

export default function Listing(props) {
  const { user, setUser } = useContext(UserContext);

  function scheduleEvent() {
    const refresh = Cookies.get("refresh");
    const config = {
      headers: { Authorization: `Bearer ${refresh}` },
    };
    Axios
      .post(`/api/tasks/listings/${props.details._id}/google_calendar`, {}, config)
      .then(console.log)
      .catch(console.log);
  }
  // TODO: Probably want to check for authorization in the backend when trying to delete, start auction, and end auction 
  const startAuction = async () => {
    try {
      await Axios.put("/products/updateProduct", {
        id: props.details._id,
        roomStatus: true,
        biddingDate: props.details.biddingDate,
        description: props.details.description,
        name: props.details.name,
        roomId: props.details.roomId,
        startingBid: props.details.startingBid,
        uid: props.details.uid,
      });
      props.refetch(); 
    } catch (err) {
      console.log(err);
    }
  };

  const stopAuction = async () => { 
    try {
      await Axios.put("/products/updateProduct", {
        id: props.details._id,
        roomStatus: false,
        biddingDate: props.details.biddingDate,
        description: props.details.description,
        name: props.details.name,
        roomId: props.details.roomId,
        startingBid: props.details.startingBid,
        uid: props.details.uid,
      });
      props.refetch(); 
      //TODO: probably want to remove all people currently in the room and give them an appropriate error message ! 
    } catch (err) {
      console.log(err);
    }
  }

  const deleteListing = () => { 
    try { 
      const imageRef = ref(storage, props.details.productImage);
      deleteObject(imageRef).then(async () => { 
        await Axios.delete("/products/deleteProduct/" + props.details._id);
        props.refetch(); 
      }).catch((err) => { 
        console.log(err); 
      }); 
    }
    catch (err) { 
      console.log(err); 
    }
  }

  return (
    <div className="w-11/12 ml-auto mr-auto border-black border p-3 mb-5 mt-3">
      <div className="flex justify-between	">
        <img
          className="max-h-36 max-w-md"
          src={props.details.productImage}
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
                className="bg-black px-3 py-1 text-white rounded-md"
                onClick={() => startAuction()}
              >
                Start Auction
              </button>
            )}
          {props.details.roomStatus === true &&
            user &&
            user.uid === props.details.uid && (
              <button
                className="bg-black px-3 py-1 text-white rounded-md"
                onClick={() => stopAuction()}
              >
                Stop Auction
              </button>
            )}
          {user && user.uid === props.details.uid && ( 
            <button
                className="bg-red-500 px-3 py-1 text-white rounded-md"
                onClick={() => deleteListing()}
              >
                Delete
              </button>
          )}
        </div>
      </div>
    </div>
  );
}

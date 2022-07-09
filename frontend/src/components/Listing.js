import React from "react";

export default function Listing(props) {
  return (
    <div className="w-11/12 ml-auto mr-auto border-black border p-3 mb-5 mt-3">
      <div className="flex justify-between	">
        <img className="max-h-36 max-w-md" src={props.details.imageUrl}></img>
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
          <a className="bg-purple-300 p-2 rounded-md" href="">
            {" "}
            More details
          </a>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Header from "../components/Header";

export default function AddItem(props) {
  return (
    <div>
      <Header />
      <form className="ml-10">
        <div className="font-medium text-lg mb-5 ">Add an item:</div>
        <div className="pb-5">
          <label>
            Product name:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="text"
              name="productName"
              placeholder="eg. Round table"
            />
          </label>
        </div>
        <div className="pb-5">
          <label>
            Starting bid:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="text"
              name="startingBid"
              placeholder="$50"
            />
          </label>
        </div>
        <div className="pb-5">
          <label>
            Bidding date:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="text"
              name="biddingDate"
              placeholder="eg. July 31, 2022 | 5pm"
            />
          </label>
        </div>
        <input
          className="bg-black text-white px-4 py-1 rounded"
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}

import Header from "../components/Header.js";
import Listing from "../components/Listing.js";
import { Link } from "react-router-dom";
import React from "react";
import { useQuery } from "react-query";
import Axios from "../axiosBaseURL";
import { UserContext } from "../App.js";
import { useContext } from "react";
import FlashMessage from "react-flash-message";
import { useState } from "react";

function Main() {
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState({ content: "", status: "" });
  const flashDuration = 5000;
  const resetMessageState = () => {
    setTimeout(() => {
      setMessage({ content: "", status: "" });
    }, flashDuration);
  };

  const fetchProducts = async () => {
    try {
      return await Axios.get("/products/");
    } catch (err) {
      console.log(err);
    }
  };

  const { data, status, error, refetch } = useQuery("products", fetchProducts);

  return (
    <div className="Main">
      <Header />
      {message.status && (
        <FlashMessage duration={flashDuration}>
          <div
            className={
              message.status === "Success"
                ? "bg-green-200 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md"
                : "bg-red-200 border-t-4 border-red-400 rounded-b text-red-900 px-4 py-3 shadow-md"
            }
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className={
                    message.status === "Success"
                      ? "fill-current h-6 w-6 text-green-500 mr-4"
                      : "fill-current h-6 w-6 text-red-400 mr-4"
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">{message.status}</p>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
          {resetMessageState()}
        </FlashMessage>
      )}
      <div className="flex w-11/12 ml-auto mr-auto items-center mt-5 mb-8">
        <div className="font-semibold	text-xl md:text-2xl tracking-widest">
          Search for items on marketplace
        </div>
        <div className="ml-auto">
          {user && (
            <Link
              to="listing/new"
              className="bg-purple-300 py-2 px-3 rounded-md whitespace-nowrap font-semibold"
            >
              List an item
            </Link>
          )}
        </div>
      </div>
      {status === "error" && <p>{error}</p>}
      {status === "loading" && <p>Fetching Data...</p>}
      {status === "success" && (
        <div>
          {data.data.map((product, index) => {
            return (
              <Listing
                setMessage={setMessage}
                refetch={refetch}
                key={index}
                details={product}
              />
            );
          })}{" "}
        </div>
      )}
    </div>
  );
}

export default Main;

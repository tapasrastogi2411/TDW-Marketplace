import Header from "../components/Header.js";
import Listing from "../components/Listing.js";
import { Link } from "react-router-dom";
import React from "react";
import { useQuery } from "react-query";
import Axios from '../axiosBaseURL'

function Main() {

  const fetchProducts = async () => {
    try { 
      return await Axios.get("/products/");
    } 
    catch (err) { 
      console.log(err); 
    }
  };

  const { data, status, error, refetch } = useQuery("products", fetchProducts);

  return (
    <div className="Main">
      <Header/>
      <div className="flex w-11/12 ml-auto mr-auto items-center mt-5 mb-8">
        <div className="font-semibold	text-2xl	tracking-widest">
          Search for items on marketplace
        </div>
        <div className="ml-auto">
          <Link to="listing/new" className="bg-pink-300	py-2 px-5 rounded-md">
            Have an item to list?
          </Link>
        </div>
      </div>
      {status === "error" && <p>{error}</p>}
      {status === "loading" && <p>Fetching Data...</p>}
      {status === "success" && (
        <div>
          {data.data.map((product, index) => {
            return <Listing refetch={refetch} key={index} details={product} />;
          })}{" "}
        </div>
      )}
    </div>
  );
}

export default Main;

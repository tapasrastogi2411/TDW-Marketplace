import Header from "../components/Header.js";
import Listing from "../components/Listing.js";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
const axios = require("axios").default;

function Main() {
  const [products, setProducts] = useState([]); 

  useEffect(() => { 
    async function fetchProducts(){ 
      try {   
        const res = await axios.get("/products/getProducts"); 
        setProducts(res.data); 
      }
      catch(err) { 
        console.log(err); 
      }
    } 
    fetchProducts(); 
  }, []); 

  return (
    <div className="Main">
      <Header />
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
      {products.map((product, index) => { 
        return <Listing key={index} details={product}/>
      })}
    </div>
  );

}

export default Main;

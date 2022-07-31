import React from "react";
import Header from "../components/Header";
import { useState } from "react";
import Cookies from "js-cookie";
import { getCurrentUser } from "../service/auth";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { storage } from "../config/firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// const axios = require("axios").default;
import Axios from '../axiosBaseURL'

export default function AddItem(props) {
  const navigate = useNavigate();
  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [startingBid, setStartingBid] = useState(" ");
  const [biddingDate, setBiddingDate] = useState(" ");
  const [image, setImage] = useState(" ");
  const [progress, setProgress] = useState(0); 
  const [disable, setDisable] = useState(false);
  const refresh = Cookies.get("refresh");
  const config = {
    headers: { Authorization: `Bearer ${refresh}` },
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setDisable(true)

    const randomName = uuid();
    const storageRef = ref(storage, `/images/${randomName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    
    uploadTask.on(
      "state_changes",
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
        setProgress(prog); 
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          try {
            const user = getCurrentUser();
            if (user) {
              const roomId = uuid();
              const uid = user.uid;
              const roomStatus = false;
              const product = {
                name,
                uid,
                startingBid,
                description,
                roomId,
                biddingDate,
                roomStatus,
                productImage: url,
              };
              await Axios.post("/products/", product, config);
              navigate("/");
            } else {
              //TODO: Change this to have a proper error message at top which says to sign in! (make a reusable component)
              console.log("No user signed in!");
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    );
  };

  const changeName = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const changeDescription = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  const changeStartingBid = (e) => {
    e.preventDefault();
    setStartingBid(e.target.value);
  };

  const changeBiddingDate = (e) => {
    e.preventDefault();
    setBiddingDate(e.target.value);
  };

  const changeProductImage = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };
  return (
    <div>
      <Header/>
      <form className="ml-10" onSubmit={onSubmit}>
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
              onChange={(e) => changeName(e)}
            />
          </label>
        </div>
        <div className="pb-5">
          <label>
            Description
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="text"
              name="description"
              placeholder="eg. This product is ..."
              onChange={(e) => changeDescription(e)}
            />
          </label>
        </div>
        <div className="pb-5">
          <label>
            Product Image
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="file"
              name="productImage"
              placeholder="Please upload a image."
              onChange={(e) => changeProductImage(e)}
            />
          </label>
        </div>
        <div className="pb-5">
          <h3>Uploaded {progress} %</h3>
        </div>
        <div className="pb-5">
          <label>
            Starting bid:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="text"
              name="startingBid"
              placeholder="eg. 50"
              onChange={(e) => changeStartingBid(e)}
            />
          </label>
        </div>
        <div className="pb-5">
          <label>
            Bidding date:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1"
              type="datetime-local"
              name="biddingDate"
              placeholder="eg. July 31, 2022 | 5pm"
              onChange={(e) => changeBiddingDate(e)}
            />
          </label>
        </div>
        <button
          className="bg-black text-white px-4 py-1 rounded disabled:bg-gray-500"
          type="submit"
          disabled={disable}
        >
          Submit
          </button>
      </form>
    </div>
  );
}

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
import Axios from "../axiosBaseURL";
import FlashMessage from "react-flash-message";

export default function AddItem(props) {
  const navigate = useNavigate();
  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [startingBid, setStartingBid] = useState(" ");
  const [biddingDate, setBiddingDate] = useState(" ");
  const [image, setImage] = useState(" ");
  const [progress, setProgress] = useState(0);
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState({ content: "", status: "" });
  const flashDuration = 5000;
  const resetMessageState = () => {
    setTimeout(() => {
      setMessage({ content: "", status: "" });
    }, flashDuration);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);

    const randomName = uuid();
    const storageRef = ref(storage, `/images/${randomName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changes",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
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
              const config = {
                headers: { Authorization: `Bearer ${user.accessToken}` },
              };
              await Axios.post("/api/products/", product, config)
                .then(() => {
                  navigate("/");
                })
                .catch((err) => {
                  setMessage({
                    content: err.response.data.error,
                    status: "Failure",
                  });
                  setDisable(false);
                });
            } else {
              setMessage({
                content: "Please log in",
                status: "Failure",
              });
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
    if (!e.target.files[0].type.startsWith("image")) {
      setMessage({
        content: "Please upload an image",
        status: "Failure",
      });
    } else {
      setImage(e.target.files[0]);
    }
  };
  return (
    <div>
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
      <form className="ml-10" onSubmit={onSubmit}>
        <div className="font-medium text-lg mb-5 pt-5">Add an item:</div>
        <div className="pb-5">
          <label>
            Product name:
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1 w-4/5 sm:w-96"
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
              className="bg-gray-300 pl-3 pr-16 rounded py-1 w-4/5 sm:w-96"
              type="text"
              name="description"
              placeholder="eg. This product is ..."
              onChange={(e) => changeDescription(e)}
            />
          </label>
        </div>
        <div className="pb">
          <label>
            Product Image
            <br />
            <input
              className="bg-gray-300 pl-3 pr-16 rounded py-1 w-4/5 sm:w-96"
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
              className="bg-gray-300 pl-3 pr-16 rounded py-1 w-4/5 sm:w-96"
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
              className="bg-gray-300 pl-3 pr-16 rounded py-1 w-4/5 sm:w-96"
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

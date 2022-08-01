import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import Header from "../components/Header.js";
import { useQuery } from "react-query";
import Axios from "../axiosBaseURL";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import FlashMessage from "react-flash-message";

const RenderVideo = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [props.peer]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="ml-auto mr-auto h-72 w-72"
    />
  );
};

export default function JoinAuction() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { auctionId } = useParams();
  const socket = useRef();
  const currentVideo = useRef();
  const peers = useRef([]);
  const [peersUpdate, setPeersUpdate] = useState([]);
  const [message, setMessage] = useState({ content: "", status: "" });
  const flashDuration = 5000;
  const resetMessageState = () => {
    setTimeout(() => {
      setMessage({ content: "", status: "" });
    }, flashDuration);
  };

  const fetchProduct = async () => {
    try {
      return await Axios.get(`/products/room/${auctionId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const { data, status, error, refetch } = useQuery("product", fetchProduct);

  useEffect(() => {
    if (user) {
      socket.current = io.connect(process.env.REACT_APP_BASE_URL);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentVideo.current.srcObject = mediaStream;

          // current user joined room
          socket.current.emit("joinRoom", auctionId);

          // fetch existing users in room
          socket.current.on("otherUsersInAuction", (otherUsers) => {
            const inAuction = [];
            otherUsers.forEach((userId) => {
              const user = new Peer({
                initiator: true,
                trickle: false,
                stream: mediaStream,
              });
              user.on("signal", (signal) => {
                socket.current.emit("sendingSignal", {
                  userToSignal: userId,
                  userJoined: socket.current.id,
                  signal,
                });
              });
              inAuction.push(user);
              peers.current.push({ userId, user });
            });
            setPeersUpdate(inAuction);
          });

          socket.current.on("userJoinedAuction", (data) => {
            const user = new Peer({
              initiator: false,
              trickle: false,
              stream: mediaStream,
            });
            user.on("signal", (signal) => {
              socket.current.emit("receivedSignal", {
                signal,
                userJoined: data.userJoined,
              });
            });
            user.signal(data.signal);
            peers.current.push({ userId: data.userJoined, user });

            setPeersUpdate((users) => [...users, user]);
          });

          socket.current.on("gotSignal", (data) => {
            const userIndex = peers.current.findIndex(
              (user) => user.userId === data.id
            );
            if (userIndex !== -1) {
              peers.current[userIndex].user.signal(data.signal);
            }
          });
        })
        .catch((err) => {
          setMessage({
            content:
              "Issue with getting camera and microphone access, please try again",
            status: "Failure",
          });
          console.log(err);
        });

      socket.current.on("userDisconnected", (data) => {
        const userIndex = peers.current.findIndex(
          (user) => user.userId === data.id
        );
        if (userIndex !== -1) {
          peers.current.splice(userIndex, 1);
        }
        const inAuction = [];
        peers.current.forEach((peer) => {
          inAuction.push(peer.user);
        });
        setPeersUpdate(inAuction);
      });

      socket.current.on("auctionFull", () => {
        setMessage({
          content: "Auction is now full, please wait until someone leaves",
          status: "Failure",
        });
        navigate("/");
      });

      socket.current.on("manualDisconnect", () => {
        socket.current.disconnect();
        // redirect and popup or something
        navigate("/");
      });
    } else {
      setMessage({
        content: "Please sign in to join video call",
        status: "Failure",
      });
    }
  }, [auctionId]);

  const disconnectAll = () => {
    socket.current.emit("disconnectAll", { auctionId });
  };

  const disconnect = () => {
    socket.current.disconnect();
    navigate("/");
  };

  return (
    <div className="h-screen bg-slate-200">
      <Header socket={socket.current} />
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
      {status === "error" && user && <p>{error}</p>}
      {status === "loading" && user && <p>Fetching Data...</p>}

      <div className="bg-[#FFD8C4]">
        {status === "success" && user && (
          <>
            <h2 className="flex items-center justify-center text-xl md:text-2xl lg:text-3xl pb-3 pt-4 text-center">
              Auction Item: {data.data.name}
            </h2>
            <h3 className="flex items-center justify-center text-center">
              {data.data.description}
            </h3>
            <img
              className="max-h-40 max-w-md pt-4 mx-auto shadow-lg"
              src={data.data.productImage}
              alt="item for auction"
            ></img>
            <h3 className="m-3 flex items-center justify-center text-center">
              Starting Bid: ${data.data.startingBid}
            </h3>
          </>
        )}
        <div className="flex items-center justify-center pb-8">
          {status === "success" && user && user.uid === data.data.uid && (
            <button
              className="bg-red-900 px-3 py-1 m-3 text-white rounded-md"
              onClick={() => disconnectAll()}
            >
              Disconnect all users
            </button>
          )}
          {user && (
            <button
              className="bg-red-500 px-3 py-1 m-3 text-white rounded-md"
              onClick={() => disconnect()}
            >
              Leave auction
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 grid-flow-dense bg-slate-200 pb-16">
        <video
          ref={currentVideo}
          muted
          autoPlay
          playsInline
          className="ml-auto mr-auto h-72 w-72"
        />
        {peersUpdate.map((peer, index) => {
          return <RenderVideo key={index} peer={peer} />;
        })}
      </div>
    </div>
  );
}

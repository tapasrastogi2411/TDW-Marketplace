import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import Header from "../components/Header.js";
import { useQuery } from "react-query";
import Axios from "../axiosBaseURL";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const RenderVideo = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [props.peer]);

  return (
    <video
      style={{ height: "300px", width: "300px" }}
      ref={ref}
      autoPlay
      playsInline
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
      navigate("/")
      alert("auction full!");
    });

    socket.current.on("manualDisconnect", () => {
      socket.current.disconnect()
      // redirect and popup or something
      navigate("/")
    })   
    } else {
      alert ("please sign in")
    }
  }, [auctionId]);

  const disconnectAll = () => {
    socket.current.emit("disconnectAll", { auctionId });
  };

  const disconnect = () => {
    socket.current.disconnect()
    navigate("/")
  }

  return (
    <div>
      <Header socket={socket.current} />
      {status === "error" && user && <p>{error}</p>}
      {status === "loading" && user &&  <p>Fetching Data...</p>}
      {status === "success" && user && (
        <div className="m-4">
          <h2>Auction Item : {data.data.name}</h2>
          <h3>Description   : {data.data.description}</h3>
          <img
            className="max-h-36 max-w-md pt-4"
            src={data.data.productImage}
            alt="item for auction"
          ></img>
          <h3 className="pt-4">Room ID : {data.data.roomId}</h3>
          <h3>Starting Bid : {data.data.startingBid}</h3>
          <h3>Bidding Date : {data.data.biddingData}</h3>
        </div>
      )}
      {status === "success" && user && user.uid === data.data.uid && (
        <button
          className="bg-red-500 px-3 py-1 m-3 text-white rounded-md"
          onClick={() => disconnectAll()}
        >
          Disconnect all users
        </button>
      )}
      <button
          className="bg-red-500 px-3 py-1 m-3 text-white rounded-md"
          onClick={() => disconnect()}
        >
          Leave auction
        </button>
      <video
        style={{ height: "300px", width: "300px" }}
        ref={currentVideo}
        muted
        autoPlay
        playsInline
      />
        <div>
          <div
            style={{
              margin: "auto",
              flexWrap: "wrap",
            }}
          >
            {peersUpdate.map((peer, index) => {
              return <RenderVideo key={index} peer={peer} />;
            })}
          </div>
        </div>
    </div>
  );
}

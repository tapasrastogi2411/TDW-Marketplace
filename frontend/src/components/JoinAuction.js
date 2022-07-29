import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import Header from "../components/Header.js";
import { useQuery } from "react-query";
import Axios from "../axiosBaseURL";
import { UserContext } from "../App";
import { useLocation } from "react-router-dom";

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
  const { user, setUser } = useContext(UserContext);
  const { auctionId } = useParams();
  const socket = useRef();
  const currentVideo = useRef();
  const peers = useRef([]);
  const [peersUpdate, setPeersUpdate] = useState([]);
  // const location = useLocation();
  // console.log(location);
  // const firstRender = useRef(true);

  const fetchProduct = async () => {
    try {
      return await Axios.get(`/products/getProducts/room/${auctionId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const { data, status, error, refetch } = useQuery("product", fetchProduct);

  // window.onpopstate = () => {
  //   socket.current.disconnect();
  // }

  // useEffect(() => {
  //   console.log("location changed");
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //     console.log("hi", location);
  //   }
  //   console.log(location);
  //   if (!firstRender.current && status === "success") {
  //     console.log(socket.current);
  //     socket.current.disconnect();
  //     console.log("here", status);
  //   }
  // }, [location])

  useEffect(() => {
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
      //TODO: what to do when auction is full
    });

    socket.current.on("disconnectPeers", () => {
      peers.current = [];
      setPeersUpdate([]);
    });

    window.addEventListener("beforeunload", function (e) {
      socket.current.emit("disconnect");
    });
  }, [auctionId]);

  const disconnectAll = () => {
    socket.current.emit("disconnectAll", { auctionId });
  };

  return (
    <div>
      <Header socket={socket.current} />
      {status === "error" && <p>{error}</p>}
      {status === "loading" && <p>Fetching Data...</p>}
      {status === "success" && (
        <div>
          <h2>Auction Item: {data.data.name}</h2>
          <h3>Description : {data.data.description}</h3>
          <img
            className="max-h-36 max-w-md"
            src={data.data.productImage}
            alt="item for auction"
          ></img>
          <h3>Room ID : {data.data.roomId}</h3>
          <h3>Starting Bid : {data.data.startingBid}</h3>
          <h3>Bidding Date : {data.data.biddingData}</h3>
        </div>
      )}
      {status === "success" && user && user.uid === data.data.uid && (
        <button
          className="bg-red-500 px-3 py-1 text-white rounded-md"
          onClick={() => disconnectAll()}
        >
          Delete
        </button>
      )}
      <video
        style={{ height: "300px", width: "300px" }}
        ref={currentVideo}
        muted
        autoPlay
        playsInline
      />
      {user && (
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
      )}
      {!user && <h1>Please Log in</h1>}
    </div>
  );
}

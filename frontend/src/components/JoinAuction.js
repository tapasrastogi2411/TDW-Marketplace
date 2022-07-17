import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";

export default function JoinAuction() {
  const { auctionId } = useParams();
  const socket = useRef();
  const currentVideo = useRef();
  const peers = useRef([]);

  const [peersUpdate, setPeersUpdate] = useState([]);

  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentVideo.current.srcObject = mediaStream;

        // current user joined room
        socket.current.emit("joinRoom", auctionId);

        // fetch existing users in room
        socket.current.on("otherUsersInAuction", (otherUsers) => {
          let inAuction = [];
          otherUsers.forEach((userId) => {
            let user = new Peer({
              initiator: true,
              trickle: false,
              mediaStream,
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

        //
        socket.current.on("userJoinedAuction", (data) => {
          let user = new Peer({
            initiator: false,
            trickle: false,
            mediaStream,
          });
          user.on("signal", (signal) => {
            socket.current.emit("receivedSignal", {
              signal,
              userJoined: data.userJoined,
            });
          });
          user.signal(data.signal);
          peers.current.push({ userId: data.userJoined, user });

          setPeersUpdate(peersUpdate.push(user));
        });

        socket.current.on("gotSignal", (data) => {
          const userIndex = peers.current.findIndex(
            (user) => user.userId === data.id
          );
          if (userIndex !== -1) {
            peers.current[userIndex].peer.signal(data.signal);
          }
        });
      });
  }, []);

  const RenderVideo = (props) => {
    const peer = useRef();
    useEffect(() => {
      props.data.on("stream", (stream) => {
        peer.current.srcObject = stream;
      });
    }, []);
    return <video ref={peer} autoPlay playsInline />;
  };

  return (
    <div
      style={{
        margin: "auto",
        flexWrap: "wrap",
      }}
    >
      <video
        style={{ height: "300px", width: "300px" }}
        ref={currentVideo}
        muted
        autoPlay
        playsInline
      />
      {peersUpdate.map((data, index) => {
        return <RenderVideo key={index} data={data} />;
      })}
    </div>
  );
}

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
          console.log(socket.current.id); 
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

        //
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
          
          setPeersUpdate(users => [...users, user]);
        });

        socket.current.on("gotSignal", (data) => {
          const userIndex = peers.current.findIndex(
            (user) => user.userId === data.id
          );
          console.log(peers.current[userIndex].user); 
          if (userIndex !== -1) {
            peers.current[userIndex].user.signal(data.signal);
          }
        });
      });
  }, [auctionId]);

  const RenderVideo = (props) => { 
    const ref = useRef();

    useEffect(() => {
      props.peer.on("stream", (stream) => {
        console.log("here 2", props.peer); 
        ref.current.srcObject = stream;
      });
    }, [props.peer]);

    return (<video ref={ref} autoPlay playsInline />);
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
      {console.log(peers)}
      {console.log(peersUpdate)}
      {peersUpdate.map((peer) => {
        return <RenderVideo peer={peer} />;
      })}
    </div>
  );
}

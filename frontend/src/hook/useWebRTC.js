// src/hook/useWebRTC.js

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

const SIGNALING_SERVER = "http://localhost:5050"; // WebRTC signaling server

const useWebRTC = (roomId, isHost) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const socket = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    socket.current = io(SIGNALING_SERVER);

    socket.current.on("connect", () => {
      console.log("Connected to signaling server");
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        console.log("Got user media stream");

        if (isHost) {
          console.log("Setting up as Host...");
          peerRef.current = new SimplePeer({ initiator: true, trickle: false, stream: mediaStream });

          peerRef.current.on("signal", (offer) => {
            console.log("Sending offer...");
            socket.current.emit("offer", { roomId, offer });
          });

          socket.current.on("answer", (answer) => {
            console.log("Received answer, connecting...");
            peerRef.current.signal(answer);
          });
        } else {
          console.log("Setting up as Guest...");
          socket.current.on("offer", (offer) => {
            console.log("Received offer, responding...");
            peerRef.current = new SimplePeer({ initiator: false, trickle: false, stream: mediaStream });

            peerRef.current.on("signal", (answer) => {
              socket.current.emit("answer", { roomId, answer });
            });

            peerRef.current.signal(offer);
          });
        }

        socket.current.on("ice-candidate", (candidate) => {
          if (peerRef.current) {
            peerRef.current.signal(candidate);
          } else {
            console.warn("Received ICE candidate before peerRef was initialized");
          }
        });

        if (peerRef.current) {
          peerRef.current.on("stream", (remoteStream) => {
            console.log("Received remote stream:", remoteStream);
            setRemoteStream(remoteStream);
          });
        }

      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getMedia();

    return () => {
      console.log("Cleaning up WebRTC connection...");
      if (socket.current) socket.current.disconnect();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [roomId, isHost]);

  return { stream, remoteStream };
};

export default useWebRTC;

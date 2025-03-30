import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

const SOCKET_SERVER = "http://localhost:5000"; // Match server.js

const useWebRTC = (roomId, userId, isHost) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const socket = useRef(io(SOCKET_SERVER, { autoConnect: true }));
  const peerRef = useRef(null);

  useEffect(() => {
    socket.current.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.current.emit("register", userId); // Register user
      socket.current.emit("join-room", roomId); // Join meeting room
    });

    const initWebRTC = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        console.log("Got user media stream");

        peerRef.current = new SimplePeer({
          initiator: isHost,
          trickle: false,
          stream: mediaStream,
          config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
        });

        peerRef.current.on("signal", (data) => {
          if (isHost) {
            console.log("Sending offer...");
            socket.current.emit("offer", { roomId, offer: data });
          } else {
            console.log("Sending answer...");
            socket.current.emit("answer", { roomId, answer: data });
          }
        });

        peerRef.current.on("stream", (remote) => {
          console.log("Received remote stream:", remote);
          setRemoteStream(remote);
        });

        peerRef.current.on("error", (err) => {
          console.error("Peer error:", err);
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    socket.current.on("offer", async (offer) => {
      if (!isHost && !peerRef.current.signalingState) {
        await peerRef.current.signal(offer);
      }
    });

    socket.current.on("answer", (answer) => {
      if (isHost) {
        peerRef.current.signal(answer);
      }
    });

    socket.current.on("ice-candidate", (candidate) => {
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    });

    initWebRTC();

    return () => {
      console.log("Cleaning up WebRTC...");
      socket.current.disconnect();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [roomId, userId, isHost]);

  return { stream, remoteStream };
};

export default useWebRTC;
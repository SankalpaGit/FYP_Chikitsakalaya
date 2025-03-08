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
    // Connect to WebRTC signaling server
    socket.current = io(SIGNALING_SERVER);

    // Join the meeting room
    socket.current.emit("join-room", roomId);

    // Get user media (camera & mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);

      if (isHost) {
        // If host, create an offer
        peerRef.current = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: mediaStream,
        });

        peerRef.current.on("signal", (offer) => {
          socket.current.emit("offer", { roomId, offer });
        });

        socket.current.on("answer", (answer) => {
          peerRef.current.signal(answer);
        });
      } else {
        // If guest, wait for offer
        socket.current.on("offer", (offer) => {
          peerRef.current = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: mediaStream,
          });

          peerRef.current.on("signal", (answer) => {
            socket.current.emit("answer", { roomId, answer });
          });

          peerRef.current.signal(offer);
        });
      }

      // Handle ICE candidates
      socket.current.on("ice-candidate", (candidate) => {
        peerRef.current.signal(candidate);
      });

      peerRef.current.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    });

    return () => {
      socket.current.disconnect();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [roomId, isHost]);

  return { stream, remoteStream };
};

export default useWebRTC;

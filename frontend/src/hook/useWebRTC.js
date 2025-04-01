import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

const SOCKET_SERVER = "http://localhost:5000";

const useWebRTC = (roomId, userId, isHost) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null Facetune_2024-10-30_21-56-33.png
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_SERVER, { autoConnect: true });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.current.emit("register", userId);
      socket.current.emit("join-room", roomId);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        console.log("Requesting media devices...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mediaStream) throw new Error("No media stream available.");
        setStream(mediaStream);
        console.log("Got user media stream");
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    initWebRTC();
  }, []);

  useEffect(() => {
    if (!stream) return;

    if (peerRef.current) {
      console.log("Destroying old peer connection...");
      peerRef.current.destroy();
    }

    peerRef.current = new SimplePeer({
      initiator: isHost,
      trickle: true,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      },
    });

    peerRef.current.on("signal", (data) => {
      console.log("Sending signaling data:", data);
      socket.current.emit("webrtc-signal", { roomId, signal: data });
    });

    peerRef.current.on("stream", (remote) => {
      console.log("Received remote stream:", remote);
      setRemoteStream(remote);
    });

    peerRef.current.on("error", (err) => {
      console.error("Peer error:", err);
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [stream, isHost, roomId]);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("webrtc-signal", (signal) => {
      if (peerRef.current) {
        console.log("Received WebRTC signal:", signal);
        peerRef.current.signal(signal);
      }
    });

    socket.current.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.current.off("webrtc-signal");
      socket.current.off("call-ended");
    };
  }, []);

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setRemoteStream(null);
    if (socket.current) {
      socket.current.emit("call-end", roomId);
    }
  };

  return { stream, remoteStream, endCall };
};

export default useWebRTC;
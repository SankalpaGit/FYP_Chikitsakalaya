import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";

const SOCKET_SERVER = "http://localhost:5000";

const useWebRTC = (roomId) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const peerRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_SERVER, { autoConnect: true });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("host-status", (hostStatus) => {
      console.log("Host status received:", hostStatus);
      console.log('host joined the room');

      setIsHost(hostStatus);
    });

    socket.current.on("participant-count", (count) => {
      setParticipantCount(count);
    });

    socket.current.on("room-full", (message) => {
      console.log(message);
      alert(message);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true
          });
        if (!mediaStream) throw new Error("No media stream available");
        console.log("Media stream is available:", mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    initWebRTC();
  }, []);

  useEffect(() => {
    if (!stream) return;

    console.log("Stream:", stream);
    console.log("isHost:", isHost);
    console.log("roomId:", roomId);

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
    console.log("SimplePeer initialized successfully");
    
    peerRef.current.on("signal", (data) => {
      socket.current.emit("webrtc-signal", { roomId, signal: data });
    });

    peerRef.current.on("stream", (remote) => {
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

  return { stream, remoteStream, endCall, isHost, participantCount };
};

export default useWebRTC;
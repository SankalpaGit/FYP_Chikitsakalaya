import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER = "http://localhost:5000";

const useWebRTC = (roomId) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const pcRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_SERVER, { autoConnect: true });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.current.emit("join-room", roomId);
    });

    socket.current.on("host-status", (hostStatus) => {
      console.log("Host status received:", hostStatus);
      setIsHost(hostStatus);
    });

    socket.current.on("participant-count", (count) => {
      console.log("Participant count updated:", count);
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
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Media stream acquired:", mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    initWebRTC();
  }, []);

  useEffect(() => {
    if (!stream || !socket.current) return;

    console.log("Setting up RTCPeerConnection...");
    pcRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    stream.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track);
      pcRef.current.addTrack(track, stream);
    });

    pcRef.current.ontrack = (event) => {
      console.log("Received remote stream:", event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.current.emit("webrtc-signal", { roomId, signal: event.candidate });
      }
    };

    pcRef.current.onconnectionstatechange = () => {
      console.log("Connection state:", pcRef.current.connectionState);
    };

    const createOffer = async () => {
      try {
        const offer = await pcRef.current.createOffer();
        console.log("Created offer:", offer);
        await pcRef.current.setLocalDescription(offer);
        console.log("Offer set as local description:", pcRef.current.localDescription);
        socket.current.emit("webrtc-signal", { roomId, signal: pcRef.current.localDescription });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    if (isHost) {
      createOffer();
    }

    socket.current.on("webrtc-signal", async (signal) => {
      console.log("Received signal:", signal);
      try {
        if (signal.type === "offer" && !isHost) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          console.log("Sending answer:", pcRef.current.localDescription);
          socket.current.emit("webrtc-signal", { roomId, signal: pcRef.current.localDescription });
        } else if (signal.type === "answer" && isHost) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(signal));
          console.log("Added ICE candidate:", signal);
        }
      } catch (error) {
        console.error("Error handling signal:", error);
      }
    });

    socket.current.on("call-ended", () => {
      console.log("Call ended by remote user");
      endCall();
    });

    return () => {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [stream, isHost, roomId]);

  const endCall = () => {
    console.log("Ending call...");
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
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
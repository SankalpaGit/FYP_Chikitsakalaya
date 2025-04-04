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
  const pendingCandidates = useRef([]);
  const hasSentOffer = useRef(false);
  const isHostRef = useRef(false);

  useEffect(() => {
    const initializeWebRTC = async () => {
      // Get stream first
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: 30 },
          audio: true,
        });
        console.log("Media stream acquired:", mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        return;
      }

      // Setup socket and peer connection
      socket.current = io(SOCKET_SERVER, { autoConnect: true });
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      console.log("Setting up RTCPeerConnection...");

      // Add tracks immediately
      mediaStream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track);
        pcRef.current.addTrack(track, mediaStream);
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

      pcRef.current.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pcRef.current.iceConnectionState);
      };

      pcRef.current.onconnectionstatechange = () => {
        console.log("Connection state:", pcRef.current.connectionState);
        if (pcRef.current.connectionState === "connected") {
          console.log("WebRTC connection established!");
        } else if (pcRef.current.connectionState === "failed") {
          console.error("Connection failed!");
        }
      };

      socket.current.on("connect", () => {
        console.log("Connected to Socket.io server");
        socket.current.emit("join-room", roomId);
      });

      socket.current.on("host-status", (hostStatus) => {
        console.log("Host status received:", hostStatus);
        setIsHost(hostStatus);
        isHostRef.current = hostStatus;
      });

      socket.current.on("participant-count", (count) => {
        console.log("Participant count updated:", count);
        setParticipantCount(count);
      });

      socket.current.on("room-full", (message) => {
        console.log(message);
        alert(message);
      });

      socket.current.on("webrtc-signal", async (signal) => {
        console.log("Received signal:", signal);
        try {
          if (signal.type === "offer" && !isHostRef.current) {
            console.log("Non-host received offer, setting remote description...");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            const answer = await pcRef.current.createAnswer();
            console.log("Created answer:", answer);
            await pcRef.current.setLocalDescription(answer);
            console.log("Sending answer:", pcRef.current.localDescription);
            socket.current.emit("webrtc-signal", { roomId, signal: pcRef.current.localDescription });
            drainPendingCandidates();
          } else if (signal.type === "answer" && isHostRef.current) {
            console.log("Host received answer, setting remote description...");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            drainPendingCandidates();
          } else if (signal.candidate) {
            if (pcRef.current.remoteDescription) {
              console.log("Adding ICE candidate:", signal);
              await pcRef.current.addIceCandidate(new RTCIceCandidate(signal));
            } else {
              console.log("Queuing ICE candidate:", signal);
              pendingCandidates.current.push(signal);
            }
          }
        } catch (error) {
          console.error("Error handling signal:", error);
        }
      });
    };

    initializeWebRTC();

    return () => {
      console.log("Cleaning up WebRTC...");
      if (socket.current) socket.current.disconnect();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      pendingCandidates.current = [];
      hasSentOffer.current = false;
    };
  }, [roomId]);

  useEffect(() => {
    if (!stream || !isHost || participantCount !== 2 || hasSentOffer.current || !pcRef.current) return;

    const createAndSendOffer = async () => {
      try {
        const offer = await pcRef.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        console.log("Created offer:", offer);
        await pcRef.current.setLocalDescription(offer);
        console.log("Sending offer:", pcRef.current.localDescription);
        socket.current.emit("webrtc-signal", { roomId, signal: pcRef.current.localDescription });
        hasSentOffer.current = true;
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    console.log("Host initiating offer since participantCount is 2");
    createAndSendOffer();
  }, [stream, isHost, participantCount, roomId]);

  const drainPendingCandidates = async () => {
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      console.log("Adding queued ICE candidate:", candidate);
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const endCall = () => {
    console.log("Ending call...");
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
      hasSentOffer.current = false;
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
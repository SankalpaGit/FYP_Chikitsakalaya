import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AgoraRTC from "agora-rtc-sdk-ng";

const SOCKET_SERVER = "http://localhost:5000";
const APP_ID = "a105c36c9c5146848d727340b2ca6dec"; // Replace with your App ID from Step 1

const useAgora = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const client = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    const initializeAgora = async () => {
      // Initialize Agora client
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      socket.current = io(SOCKET_SERVER, { autoConnect: true });

      // Socket.io room management
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

      // Join Agora channel
      try {
        await client.current.join(APP_ID, roomId, null, null);
        console.log("Joined Agora channel:", roomId);

        // Create and publish local stream
        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: { width: 640, height: 480, frameRate: 30 },
        });
        setLocalStream({ audio: localAudioTrack, video: localVideoTrack });
        await client.current.publish([localAudioTrack, localVideoTrack]);
        console.log("Local stream published");
      } catch (error) {
        console.error("Error joining or publishing:", error);
      }

      // Handle remote streams
      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        console.log("Subscribed to remote user:", user.uid);
        if (mediaType === "video") {
          setRemoteStreams((prev) => {
            if (!prev.some((s) => s.uid === user.uid)) {
              return [...prev, { uid: user.uid, video: user.videoTrack }];
            }
            return prev;
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.current.on("user-unpublished", (user) => {
        setRemoteStreams((prev) => prev.filter((stream) => stream.uid !== user.uid));
        console.log("Remote user unpublished:", user.uid);
      });
    };

    initializeAgora();

    return () => {
      console.log("Cleaning up Agora...");
      if (client.current) {
        client.current.leave();
        client.current = null;
      }
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
      if (localStream) {
        localStream.audio?.close();
        localStream.video?.close();
        setLocalStream(null);
      }
      setRemoteStreams([]);
    };
  }, [roomId]);

  const endCall = () => {
    console.log("Ending call...");
    if (client.current) {
      client.current.leave();
      client.current = null;
    }
    if (socket.current) {
      socket.current.emit("call-end", roomId);
      socket.current.disconnect();
      socket.current = null;
    }
    if (localStream) {
      localStream.audio?.close();
      localStream.video?.close();
      setLocalStream(null);
    }
    setRemoteStreams([]);
  };

  return { localStream, remoteStreams, endCall, isHost, participantCount };
};

export default useAgora;
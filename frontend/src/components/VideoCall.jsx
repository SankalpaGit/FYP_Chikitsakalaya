import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming React Router for meetingId
import useWebRTC from "../hooks/useWebRTC"; // Adjust path to your hook

const VideoCall = ({ userId, isHost }) => {
  const { meetingId } = useParams(); // Extract meetingId from URL (e.g., /meeting/:meetingId)
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { stream, remoteStream, endCall } = useWebRTC(meetingId, userId, isHost);

  // Attach local stream to video element
  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <h2>Video Call - Meeting ID: {meetingId}</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: "300px", border: "1px solid #ccc" }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px", border: "1px solid #ccc" }} />
      </div>
      <button onClick={endCall} style={{ marginTop: "10px" }}>
        End Call
      </button>
    </div>
  );
};

export default VideoCall;
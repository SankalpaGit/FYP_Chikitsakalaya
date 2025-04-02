import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useWebRTC from "../hook/useWebRTC"; // Adjust path

const VideoCall = () => {
  const { meetingId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { stream, remoteStream, endCall, isHost, participantCount } = useWebRTC(meetingId);

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <p>Host: {isHost ? "Yes" : "No"} | Participants: {participantCount}</p>
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
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import useWebRTC from "../hook/useWebRTC"; // Adjust path

const VideoCall = () => {
  const { meetingId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { stream, remoteStream, endCall, isHost, participantCount } = useWebRTC(meetingId);

  useEffect(() => {
    if (stream && localVideoRef.current) {
      console.log("Setting local video stream:", stream);
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log("Setting remote video stream:", remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
    } else {
      console.log("No remote stream yet");
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
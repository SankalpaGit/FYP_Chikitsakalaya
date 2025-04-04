import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import useWebRTC from "../hook/useWebRTC";

const VideoCall = () => {
  const { meetingId } = useParams(); // Get meetingId from URL
  const roomId = meetingId || "test123"; // Fallback to "test123" if undefined
  const { stream, remoteStream, endCall, isHost, participantCount } = useWebRTC(roomId);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    console.log("VideoCall mounted - roomId:", roomId, "isHost:", isHost, "participantCount:", participantCount);
    return () => console.log("VideoCall unmounting...");
  }, [roomId, isHost, participantCount]);

  useEffect(() => {
    if (localVideoRef.current && stream) {
      console.log("Setting local video stream:", stream);
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log("Setting remote video stream:", remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
    } else {
      console.log("No remote stream yet");
    }
  }, [remoteStream]);

  return (
    <div>
      <h3>{isHost ? "Host" : "Participant"} - Count: {participantCount}</h3>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
      {remoteStream ? (
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
      ) : (
        <p>Waiting for remote stream...</p>
      )}
      <button onClick={endCall}>End Call</button>
    </div>
  );
};

export default VideoCall;
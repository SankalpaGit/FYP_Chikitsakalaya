import React, { useRef, useEffect } from "react";
import useWebRTC from "../hooks/useWebRTC";

const VideoCall = ({ roomId, isHost }) => {
  const { stream, remoteStream } = useWebRTC(roomId, isHost);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (stream) localVideoRef.current.srcObject = stream;
    if (remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [stream, remoteStream]);

  return (
    <div>
      <h2>WebRTC Video Call</h2>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoCall;

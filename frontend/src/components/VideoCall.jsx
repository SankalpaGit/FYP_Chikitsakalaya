import React, { useRef, useEffect, useState } from "react";
import useWebRTC from "../hook/useWebRTC";

const VideoCall = ({ roomId, isHost, onEndCall }) => {
  const { stream, remoteStream } = useWebRTC(roomId, isHost);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (stream) localVideoRef.current.srcObject = stream;
    if (remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [stream, remoteStream]);

  // Toggle microphone
  const toggleMic = () => {
    const enabled = !micEnabled;
    setMicEnabled(enabled);
    stream.getAudioTracks()[0].enabled = enabled;
  };

  // Toggle video
  const toggleVideo = () => {
    const enabled = !videoEnabled;
    setVideoEnabled(enabled);
    stream.getVideoTracks()[0].enabled = enabled;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">WebRTC Video Call</h2>
      
      <div className="flex space-x-4 mb-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-40 h-40 border rounded-md" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-40 h-40 border rounded-md" />
      </div>

      <div className="flex space-x-4">
        <button onClick={toggleMic} className={`px-4 py-2 rounded ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
          {micEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>
        
        <button onClick={toggleVideo} className={`px-4 py-2 rounded ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
          {videoEnabled ? "Turn Off Video" : "Turn On Video"}
        </button>

        <button onClick={onEndCall} className="px-4 py-2 bg-gray-700 text-white rounded">
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;

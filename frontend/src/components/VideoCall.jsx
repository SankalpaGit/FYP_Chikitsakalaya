import React, { useRef, useEffect, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa"; // Import from react-icons
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

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    stream.getAudioTracks()[0].enabled = !micEnabled;
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    stream.getVideoTracks()[0].enabled = !videoEnabled;
  };

  return (
    <div className="flex flex-col items-center h-screen bg-white">
      <h2 className="text-2xl bg-gray-700 text font-bold my-4">You are in call with your doctor</h2>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-3/4 px-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg border border-gray-700" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg border border-gray-700" />
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-6 mt-6 bg-gray-800 p-4 rounded-lg">
        <button onClick={toggleMic} className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-xl">
          {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash className="text-red-500" />}
        </button>

        <button onClick={toggleVideo} className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-xl">
          {videoEnabled ? <FaVideo /> : <FaVideoSlash className="text-red-500" />}
        </button>

        <button onClick={onEndCall} className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-xl">
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;

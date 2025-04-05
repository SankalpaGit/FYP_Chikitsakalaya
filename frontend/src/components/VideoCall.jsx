import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAgora from "../hook/useAgora";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaSpinner } from "react-icons/fa";

const VideoCall = () => {
  const { meetingId } = useParams();
  const roomId = meetingId || "test123";
  const { localStream, remoteStreams, endCall, isHost, participantCount } = useAgora(roomId);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    console.log("VideoCall mounted - roomId:", roomId, "isHost:", isHost, "participantCount:", participantCount);
    return () => console.log("VideoCall unmounting...");
  }, [roomId, isHost, participantCount]);

  useEffect(() => {
    if (localVideoRef.current && localStream?.video) {
      console.log("Setting local video stream");
      localVideoRef.current.srcObject = isVideoOff
        ? null
        : new MediaStream([localStream.video.getMediaStreamTrack()]);
    }
    if (localStream?.audio) {
      localStream.audio.setEnabled(!isMuted);
    }
  }, [localStream, isMuted, isVideoOff]);

  useEffect(() => {
    remoteStreams.forEach((stream) => {
      const ref = remoteVideoRefs.current[stream.uid];
      if (ref && stream.video) {
        console.log("Setting remote video stream for UID:", stream.uid);
        ref.srcObject = new MediaStream([stream.video.getMediaStreamTrack()]);
      }
    });
  }, [remoteStreams]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    setIsVideoOff((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
     
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-4xl w-full">
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
          {localStream ? (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-72 object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                  <FaVideoSlash className="text-4xl" />
                  <span className="ml-2">Video Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                You {isMuted && "(Muted)"}
              </div>
            </>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-300">
              <FaSpinner className="text-4xl text-gray-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Remote Video */}
        {participantCount === 1 ? (
          <div className="w-full h-72 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
            <FaSpinner className="text-4xl text-teal-600 animate-spin mr-2" />
            <span className="text-lg text-gray-700">Waiting for other person to join...</span>
          </div>
        ) : remoteStreams.length > 0 ? (
          remoteStreams.map((stream) => (
            <div key={stream.uid} className="relative bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={(el) => (remoteVideoRefs.current[stream.uid] = el)}
                autoPlay
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Participant {stream.uid}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
            <span className="text-lg text-gray-700">Conneting now..</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full text-white ${isMuted ? "bg-teal-600" : "bg-teal-500"} hover:bg-teal-700 transition`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full text-white ${isVideoOff ? "bg-teal-600" : "bg-teal-500"} hover:bg-teal-700 transition`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
        </button>
        <button
          onClick={endCall}
          className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          title="End Call"
        >
          <FaPhoneSlash size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
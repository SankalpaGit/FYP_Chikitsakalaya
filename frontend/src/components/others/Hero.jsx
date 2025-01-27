import React from 'react'

const Hero = () => {
  return (
    <section className="relative w-full h-screen flex justify-center items-center overflow-hidden">
    {/* Video Background */}
    <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
    >
        <source src="https://videocdn.cdnpk.net/videos/47ad7623-8ea4-4f29-a1b1-8147f25122e4/horizontal/previews/clear/large.mp4?token=exp=1737957956~hmac=bd95942da35bc215e4bfa193ae06be4fe66a57dd6030f2475595e0081fede651" type="video/mp4" />
        Your browser does not support the video tag.
    </video>

    {/* Black Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>

    {/* Overlay and Content */}
    <div className="relative z-10 p-8 rounded-lg text-center px-4 animate-fadeInUp">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-100 animate-slideInLeft">
            Welcome to Chikitsakalaya
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-100 hover:font-semibold animate-slideInRight">
            Nepal's most trusted platform for seamless doctor appointments and consultations.
        </p>
        <a
            href="#about"
            className="mt-6 inline-block px-8 py-3 bg-teal-700 text-gray-100 rounded-md hover:bg-teal-600 transition duration-500 ease-in-out transform hover:scale-105 animate-bounceIn"
        >
            Learn More
        </a>
    </div>
</section>
  )
}

export default Hero

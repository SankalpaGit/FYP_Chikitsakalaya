import React from "react";
import { Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import Signup from "./pages/doctors/Signup";
import Login from "./pages/doctors/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Credential from "./pages/admin/Credential";
import DoctorDashboard from "./pages/doctors/DoctorDashboard";
import ProtectedRoute from "./secure/ProtectedRoute";
import DoctorApproval from "./pages/admin/DoctorApproval";
import DoctorUser from "./pages/admin/DoctorUser";
import PatientUser from "./pages/admin/PatientUser";
import LoginForm from "./pages/patients/LoginForm";
import RegisterForm from "./pages/patients/RegisterForm";
import HomePage from "./pages/patients/HomePage";
import SetFreeTime from "./pages/doctors/SetFreeTime";
import ToDoList from "./pages/doctors/ToDoList";
import PatientProfile from "./pages/patients/PatientProfile";
import DoctorProfile from "./pages/doctors/DoctorProfile";
import DoctorEditProfile from "./pages/doctors/DoctorEditProfile";
import About from "./pages/others/About";
import AppointmentForm from "./pages/patients/AppointmentForm";
import DisplayAppointment from "./pages/patients/DisplayAppointment";
import PaymentHome from "./pages/patients/PaymentHome";
import AppointmentList from "./pages/doctors/AppointmentList";
import PostAppointment from "./pages/patients/PostAppointment";
import ChatHome from "./pages/patients/ChatHome";
import VideoCall from "./components/VideoCall";
import AdminBlog from "./pages/admin/AdminBlog";
import CreateBlog from "./pages/admin/CreateBlog";
import Blog from "./pages/others/Blog";
import BlogDetail from "./pages/others/BlogDetail";

console.log("App Component Loaded");

function App() {


  return (
    <Routes>

      {/* route setup for doctor user */}
      <Route path="/doctor" element={<Signup />} />
      <Route path="/doctor/login" element={<Login />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/schedule" element={<SetFreeTime />} />
      <Route path="/doctor/tasks" element={<ToDoList />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/profile/edit" element={<DoctorEditProfile />} />
      <Route path="/doctor/view/appointment" element={<AppointmentList />} />


      {/* route setup for admin user */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
      <Route path="/admin/request" element={
        <ProtectedRoute>
          <DoctorApproval />
        </ProtectedRoute>} />
      <Route path="/admin" element={<Credential />} />
      < Route path="/admin/user/doctor" element={<DoctorUser />} />
      < Route path="/admin/user/patient" element={<PatientUser />} />
      < Route path="/admin/blog" element={<AdminBlog />} />
      < Route path="/admin/blog/create" element={<CreateBlog />} />
      <Route path="/admin/blog/edit/:blogID" element={<CreateBlog />} />



      {/* route setup for patient user */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path='/' element={<HomePage />} />
      < Route path='/profile' element={<PatientProfile />} />
      <Route path='/appointment/:doctorId' element={<AppointmentForm />} />
      <Route path='/appointments' element={<DisplayAppointment />} />
      <Route path='/payment/:appointmentID' element={<PaymentHome />} />
      <Route path="/post-appointments" element={<PostAppointment />} />
      <Route path="/chat" element={<ChatHome />} />
      <Route path="/meeting/:roomId" element={<VideoCallWrapper />} />


      {/* Project Related*/}
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:blogID" element={<BlogDetail />} />
      <Route path="*" element={<NotFound />} />

    </Routes>

  );
}

const VideoCallWrapper = () => {
  const { roomId } = useParams();
  return <VideoCall roomId={roomId} isHost={false} onEndCall={() => console.log("Call ended")} />;
};

export default App;

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
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
import ChatBox from "./pages/patients/ChatBox";
import VideoCall from "./components/VideoCall";
import AdminBlog from "./pages/admin/AdminBlog";
import CreateBlog from "./pages/admin/CreateBlog";
import Blog from "./pages/others/Blog";
import BlogDetail from "./pages/others/BlogDetail";
import ChatLayout from "./layouts/ChatLayout";
import ChatBoxDoctor from "./pages/doctors/ChatBoxDoctor";
import DoctorChatLayout from "./layouts/DoctorChatLayout";
import FAQ from "./pages/others/FAQ";
import PrescriptionMain from "./pages/doctors/PrescriptionMain";
import Prescription from "./pages/patients/Prescription";
import ReportUpload from "./pages/patients/ReportUpload";
import Privacy from "./pages/others/Privacy";
import TermsOfService from "./pages/others/TermsOfService";
import CheckedPatient from "./pages/doctors/CheckedPatient";
console.log("App Component Loaded");

function App() {

  const [user, setUser] = useState(null);

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
      <Route path="/doctor/chat" element={<DoctorChatLayout />}>
        <Route path=":patientId" element={<ChatBoxDoctor />} />
      </Route>
      <Route path="/doctor/prescription" element={<PrescriptionMain />} />
      <Route path="/doctor/appointment/history" element={<CheckedPatient/>} />


      {/* route setup for admin user */}
      <Route path="/admin/dashboard" element={
        
          <Dashboard />
        } />
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

      <Route path="/meeting/:meetingId" element={<VideoCall />} />


      {/* route setup for patient user */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<HomePageWrapper user={user} setUser={setUser} />} />
      < Route path='/profile' element={<PatientProfile />} />
      <Route path="/upload" element={<ReportUpload />} />
      <Route path='/appointment/:doctorId' element={<AppointmentForm />} />
      <Route path='/appointments' element={<DisplayAppointment />} />
      <Route path='/payment/:appointmentID' element={<PaymentHome />} />
      <Route path="/post-appointments" element={<PostAppointment />} />
      <Route path="/chat" element={<ChatLayout />}>
        <Route path=":doctorId" element={<ChatBox />} />
      </Route>
      <Route path="/prescription" element={<Prescription />} />


      {/* Project Related*/}
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:blogID" element={<BlogDetail />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function HomePageWrapper({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      console.log('OAuth flow detected, validating token:', token);
      localStorage.setItem('token', token);
      axios
        .get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('User fetched:', response.data);
          setUser(response.data);
          navigate('/'); // Clean up URL
        })
        .catch((error) => {
          console.error('API error:', error.message, error.response?.status);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            console.log('Token removed due to 401 Unauthorized');
            setUser(null);
            navigate('/login');
          } else {
            console.log('API failed, keeping token for now');
          }
        });
    }
  }, [location.search, navigate, setUser]);

  return <HomePage user={user} setUser={setUser} />;
}

export default App;

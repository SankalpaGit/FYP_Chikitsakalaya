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
import ChatHome from "./pages/patients/ChatHome";


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



      {/* route setup for patient user */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path='/' element={<HomePage />} />
      < Route path='/profile' element={<PatientProfile />} />
      <Route path='/appointment/:doctorId' element={<AppointmentForm />} />
      <Route path='/appointments' element={<DisplayAppointment/>} />
      <Route path='/payment/:appointmentID' element={<PaymentHome />} />
      <Route path="/chat" element={<ChatHome />} />
      

      {/* Project Related*/}
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

  );
}

export default App;

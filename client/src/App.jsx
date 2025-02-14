import { createContext, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SessionExpiredModal from "./components/SessionExpiredModal"
import Layout from "./components/Layout"
import AdminDashBoard from "./pages/AdminDashBoard"
import Users from "./pages/user/Users"
import AddUser from "./pages/user/AddUser"
import Profile from "./pages/user/Profile"
import Login from "./pages/Login"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"
import FullCalender from "./pages/FullCalender"

export const ImagePreviewContext = createContext({
  previewImages: [],
  setPreviewImages: () => { }
})

const App = () => {
  const [previewImages, setPreviewImages] = useState([])

  return <>
    <ImagePreviewContext.Provider value={{ previewImages, setPreviewImages }}>
      <BrowserRouter>
        <SessionExpiredModal />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AdminDashBoard />} />
            {/* user */}
            <Route path="/users" element={<Users />} />
            <Route path="/calender" element={<FullCalender />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/update-user/:id" element={<AddUser />} />
            <Route path="/profile/:id" element={<Profile />} />

          </Route>

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </BrowserRouter >
    </ImagePreviewContext.Provider >
  </>
}


export default App
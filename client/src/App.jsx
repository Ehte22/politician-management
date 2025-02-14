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
import AddBooth from "./pages/booth/AddBooth"
import Booths from "./pages/booth/Booths"
import AddVisitor from "./pages/visitor/AddVisitor"
import Visitor from "./pages/visitor/Visitor"
import Wish from "./pages/Wish"
import WishTable from "./table/wishTable"
import GoogleTranslate from "./components/GoogleTranslate"
import Protected from "./components/Protected"

export const ImagePreviewContext = createContext({
  previewImages: [],
  setPreviewImages: () => { }
})

const App = () => {
  const [previewImages, setPreviewImages] = useState([])

  // return <GoogleTranslate />

  return <>
    <ImagePreviewContext.Provider value={{ previewImages, setPreviewImages }}>
      <BrowserRouter>
        <SessionExpiredModal />
        <Routes>

          <Route element={<Protected />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<AdminDashBoard />} />
              {/* user */}
              <Route path="/users" element={<Users />} />
              <Route path="/calender" element={<FullCalender />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/update-user/:id" element={<AddUser />} />
              <Route path="/profile/:id" element={<Profile />} />

              {/* booth */}
              <Route path="/booths" element={<Booths />} />
              <Route path="/add-booth" element={<AddBooth />} />
              <Route path="/update-booth/:id" element={<AddBooth />} />

              {/* Visitor */}
              <Route path="/add-visitor" element={<AddVisitor />} />
              <Route path="/update-visitor/:id" element={<AddVisitor />} />
              <Route path="/visitor" element={<Visitor />} />

              {/* wish */}
              <Route path="/wish" element={<Wish />} />
              <Route path="/wish/:id" element={<Wish />} />
              <Route path="/wish-table" element={<WishTable />} />
            </Route>
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
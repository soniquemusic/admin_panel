import './App.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminHome from './pages/Admin/AdminHome';
import AdminLogin from './pages/Admin/AdminLogin';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Routes>
        <Route path="/*" element={<AdminHome />} />
        <Route path="/sonique/user/login" element={<AdminLogin />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

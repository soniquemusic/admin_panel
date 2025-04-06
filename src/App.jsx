import './App.css'
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminHome from './pages/Admin/AdminHome';
import AdminLogin from './pages/Admin/AdminLogin';

function App() {

  return (
    <>
      <Routes>
        <Route path="/*" element={<AdminHome />} />
        <Route path="/sonique/user/login" element={<AdminLogin />} />
        
      </Routes>
    </>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Services from './Pages/Services'
import Contact from './Pages/Contact'
import Booking from './Pages/Booking'
import Admin from './Pages/Admin'
import Employee from './Pages/Employee'
import Profile from './Pages/Profile'
import AdminLogin from './Pages/adminLogin'
import EmployeeLogin from './Pages/employeeLogin'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'

const App = () => {
  return (
   <div>
    <Router>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/login" element = {<Login/>}/>        
        <Route path="/services" element = {<Services/>}/>
        <Route path="/contact" element = {<Contact/>}/>
        <Route path="/booking" element = {<Booking/>}/>
        <Route path="/Admin" element = {<Admin/>}/>
        <Route path="/Employee" element = {<Employee/>}/>
        <Route path="/Profile" element = {<Profile/>}/>
        <Route path="/adminLogin" element = {<AdminLogin/>}/>
        <Route path="/employeeLogin" element = {<EmployeeLogin/>}/>
      </Routes>
    </Router>
   </div> 
  )
}

export default App
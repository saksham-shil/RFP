import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import Login from '../pages/Login'
import RegisterAdmin from '../pages/RegisterAdmin'
import RegisterVendor from '../pages/RegisterVendor/index'
import Dashboard from '../pages/AdminPanel/Dashboard'
import ProtectedRoutes from './ProtectedRoutes'
import Vendors from '../pages/AdminPanel/Vendors'
import RFP from '../pages/AdminPanel/RFP'
import RFPQuotes from '../pages/AdminPanel/RFPQuotes'
import Categories from '../pages/AdminPanel/Categories'
import CreateRFP from '../pages/AdminPanel/CreateRFP'
import CreateCategory from '../pages/AdminPanel/CreateCategory'
import NotFound from '../pages/NotFound'
import VendorDashboard from '../pages/VendorPanel/VendorDashboard'
import RFPForQuotes from '../pages/VendorPanel/RFPForQuotes'
import Quote from '../pages/VendorPanel/Quote'
import ChangePassword from '../pages/ChangePassword'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPasswordOTP from '../pages/ResetPasswordOTP'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element = {<Navigate replace to = "/login" />} />
      <Route path='/login' element = {<Login />} />
      <Route path='/changepass' element = {<ChangePassword />} />
      <Route path='/registervendor' element = {<RegisterVendor />} />
      <Route path='/registeradmin' element = {<RegisterAdmin />} />
      <Route path='/forgot-password' element = {<ForgotPassword />} />
      <Route path='/reset-password-otp' element = {<ResetPasswordOTP />} />
      <Route element = {<ProtectedRoutes allowed='admin'/>}>
        <Route path='/admin' element = {<Dashboard />} />
        <Route path='/admin/vendors' element = {<Vendors />} />
        <Route path='/admin/rfp-lists' element = {<RFP />} />  
        <Route path='/admin/rfp/create' element = {<CreateRFP />} />  
        <Route path='/admin/rfp/quotes/:rfp_id' element = {<RFPQuotes />} />
        <Route path='/admin/categories' element = {<Categories />} />
        <Route path='/admin/categories/create' element = {<CreateCategory />} />
      </Route>
      <Route element = {<ProtectedRoutes allowed='vendor' />}>
        <Route path='/vendor' element = {<VendorDashboard />} />
        <Route path='/vendor/rfp-for-quote' element = {<RFPForQuotes />} /> 
        <Route path='/vendor/rfp-for-quote/quote/:rfp_id' element = {<Quote />} /> 
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes

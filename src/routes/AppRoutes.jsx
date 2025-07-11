import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import Login from '../pages/Login'
import RegisterAdmin from '../pages/RegisterAdmin'
import RegisterVendor from '../pages/RegisterVendor'
import Dashboard from '../pages/AdminPanel/Dashboard'
import ProtectedRoutes from './ProtectedRoutes'
import Vendors from '../pages/AdminPanel/Vendors'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element = {<Navigate replace to = "/login" />} />
      <Route path='/login' element = {<Login />} />
      <Route path='/registervendor' element = {<RegisterVendor />} />
      <Route path='/registeradmin' element = {<RegisterAdmin />} />

      <Route element = {<ProtectedRoutes allowed='admin'/>}>
        <Route path='/admin' element = {<Dashboard />} />
        <Route path='/admin/vendors' element = {<Vendors />} />
      </Route>
      {/* 
      <Route path='/admin/categories' element = {<RegisterVendor />} />
      <Route path='/admin/rfp' element = {<RegisterVendor />} />
      <Route path='/admin/rfpquotes' element = {<RegisterVendor />} />
      <Route path='/vendor/dashboard' element = {<RegisterVendor />} />
      <Route path='/vendor/rfpforquotes' element = {<RegisterVendor />} /> */}
    </Routes>
  )
}

export default AppRoutes

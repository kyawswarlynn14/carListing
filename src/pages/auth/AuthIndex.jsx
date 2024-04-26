import React from 'react'
import { Navigate } from 'react-router-dom'

const AuthIndex = () => {
  return <Navigate to={'/auth/login'} />
}

export default AuthIndex
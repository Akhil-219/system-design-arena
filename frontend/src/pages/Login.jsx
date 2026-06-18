import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const {login}= useAuth()
  const navigate =useNavigate()
  return (
    <></>
  )
}

export default Login
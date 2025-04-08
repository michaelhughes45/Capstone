import React from 'react'
import { useState, useEffect } from 'react'
import { setLogin } from '../redux/state'
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import '../styles/Login.scss'

const LoginPage = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {   
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const loggedIn = await response.json()

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token
          })
        )
        navigate('/')
      }

    } catch (error) {
      console.log("Login failed", error.message)
      
    }
  }
  return (
    <div className='login'>
      <div className='login_content'>
        <form className='login_content_form' onSubmit={handleSubmit}>
          <input 
            type='email' 
            placeholder='Email' 
            name='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type='password' 
            placeholder='Password' 
            name='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type='submit'>LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
  )
}

export default LoginPage
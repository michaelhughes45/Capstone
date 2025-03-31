import React, { useState } from 'react'
import { setLogin } from '../redux/state'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div
      className="w-screen h-screen flex justify-center items-center flex-col bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/login.jpg")' }}
    >
      <div className="flex flex-col gap-4 w-[40%] lg:w-[60%] md:w-[80%] p-10 bg-black bg-opacity-80 rounded-2xl">
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-transparent border-b border-white border-opacity-30 text-white text-center focus:outline-none placeholder-white"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-transparent border-b border-white border-opacity-30 text-white text-center focus:outline-none placeholder-white"
          />
          <button
            type="submit"
            className="mt-4 w-1/2 px-4 py-2 bg-white text-black font-semibold rounded-md transition hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.8)]"
          >
            LOG IN
          </button>
        </form>
        <a
          href="/register"
          className="text-white text-[17px] font-semibold text-center hover:underline"
        >
          Don't have an account? Sign In Here
        </a>
      </div>
    </div>
  )
}

export default LoginPage

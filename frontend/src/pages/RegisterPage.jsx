import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import '../styles/Register.scss'

const RegisterPage = () => {
  // Initialize state for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  })

  // Handle input changes and file selection
  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: name === 'profileImage' ? files[0] : value
    })
  }

  // State to validate if passwords match
  const [passwordMatch, setPasswordMatch] = useState(true)

  // Effect to check if the passwords match in real-time
  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword || formData.confirmPassword === ''
    )
  })

  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Use FormData to allow file uploads
      const register_form = new FormData()
      for (var key in formData) {
        register_form.append(key, formData[key])
      }

      // Send form data to backend
      const respone = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        body: register_form
      })

      // Redirect to login on success
      if (respone.ok) {
        navigate('/login')
      }
    } catch (error) {
      console.log("Registration failed", error.message)
    }
  }

  return (
    <div className='register'>
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          {/* First Name input */}
          <input
            type='text'
            placeholder='First Name'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {/* Last Name input */}
          <input
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {/* Email input */}
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          {/* Password input */}
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Confirm Password input */}
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {/* Show error if passwords don't match */}
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched</p>
          )}
          {/* Hidden file input for profile image */}
          <input
            type="file"
            id='image'
            name='profileImage'
            accept='image/*'
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          {/* Custom label for file input */}
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>
          {/* Preview selected profile image */}
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          {/* Submit button */}
          <button type='submit' disabled={!passwordMatch}>REGISTER</button>
        </form>
        {/* Link to login page */}
        <a href="login">already have an account? Log In Here</a>
      </div>
    </div>
  )
}

export default RegisterPage

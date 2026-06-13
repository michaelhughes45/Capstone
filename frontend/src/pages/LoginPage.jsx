// Importing necessary libraries and styles
import React from 'react';
import { setLogin } from '../redux/state'; // Redux action to set login state
import { useDispatch } from 'react-redux'; // Redux hook for dispatching actions
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import '../styles/Login.scss'; // Importing styles for the login page

// Main component for the login page
const LoginPage = () => {
  // State for storing user input (email and password)
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // React Router hook for navigation
  const navigate = useNavigate();

  // Redux hook for dispatching actions
  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({ email, password }), // Send email and password in the request body
      });

      const loggedIn = await response.json(); // Parse the response JSON

      // If login is successful, update the Redux state and navigate to the homepage
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user, // Set the logged-in user data
            token: loggedIn.token, // Set the authentication token
          })
        );
        navigate('/'); // Redirect to the homepage
      }
    } catch (error) {
      console.log("Login failed", error.message); // Log any errors
    }
  };

  // Render the login page
  return (
    <div className='login'>
      <div className='login_content'>
        {/* Login form */}
        <form className='login_content_form' onSubmit={handleSubmit}>
          {/* Email input field */}
          <input 
            type='email' 
            placeholder='Email' 
            name='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
            required 
          />
          {/* Password input field */}
          <input 
            type='password' 
            placeholder='Password' 
            name='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            required 
          />
          {/* Submit button */}
          <button type='submit'>LOG IN</button>
        </form>
        {/* Link to the registration page */}
        <a href="/register">Dont have an account? Sign In Here</a>
      </div>
    </div>
  );
};

export default LoginPage;
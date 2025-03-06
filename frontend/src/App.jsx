import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState()

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api")
    setValue(response.data.value)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
      <p>{value}</p>
    </>
  )
}

export default App

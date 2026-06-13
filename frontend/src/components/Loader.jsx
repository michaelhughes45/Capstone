import "../styles/Loader.scss"

// Loader component to show a spinning indicator during async data loads
const Loader = () => {
  return (
    // Outer wrapper for loader styling
    <div className='loader'>
      {/* Inner element styled to create the spinning animation */}
      <div className='loader-inner'></div>
    </div>
  )
}

export default Loader

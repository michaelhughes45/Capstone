import '../styles/Slide.scss' // Import the associated SCSS styles for the slide

// Slide component to display a welcome message or hero banner
const Slide = () => {
  return (
    <div className='slide'>
      {/* Heading text shown on the hero banner */}
      <h1>
        Welcome Home! Anywhere you roam <br /> 
        Stay in the moment. Make your memories
      </h1>
    </div>
  )
}

export default Slide

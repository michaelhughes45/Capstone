// Importing the category data and styles
import { categories } from '../data.jsx'
import '../styles/Categories.scss'
// React Router for linking to category pages
import { Link } from 'react-router-dom'

// Component to display a list of top categories on the homepage
const Categories = () => {
  return (
    <div className='categories'>
        {/* Header section */}
        <h1>Explore Top Categories</h1>
        <p>
            Explore our wide range of vacation rentals that cater to all types of
            travelers. Immerse yourself in the local culture, enjoy the comforts of
            home, and create unforgettable memories in your dream destination.
        </p>

        {/* Displaying a subset of categories (excluding "All" and limiting to 6 total) */}
        <div className='categories_list'>
            {categories?.slice(1, 7).map((category, index) => (
                // Each category is wrapped in a link that navigates to its corresponding property list
                <Link to={`/properties/category/${category.label}`} key={index}>
                    <div className='category'>
                        {/* Category image with an overlay */}
                        <img src={category.img} alt={category.label} />
                        <div className='overlay'></div>

                        {/* Text and icon representing the category */}
                        <div className='category_text'>
                            <div className='category_text_icon'>{category.icon}</div>
                            <p>{category.label}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default Categories
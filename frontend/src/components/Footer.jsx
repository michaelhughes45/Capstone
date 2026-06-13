// Importing styles specific to the Footer component
import "../styles/Footer.scss"
// Importing Material UI icons
import { LocalPhone, Email } from "@mui/icons-material"

// Footer component used site-wide to display company info and links
const Footer = () => {
  return (
    <div className="footer">
      {/* Left section with the logo */}
      <div className="footer_left">
        <a href="/"><img src="/assets/logo.png" alt="logo" /></a>
      </div>

      {/* Center section with informational links */}
      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Return and Refund Policy</li>
        </ul>
      </div>

      {/* Right section with contact details and payment options */}
      <div className="footer_right">
        <h3>Contact</h3>

        {/* Phone contact */}
        <div className="footer_right_info">
          <LocalPhone />
          <p>+1 234 567 890</p>
        </div>

        {/* Email contact */}
        <div className="footer_right_info">
          <Email />
          <p>ezrentals@support.com</p>
        </div>

        {/* Payment method icons */}
        <img src="/assets/payment.png" alt="payment" />
      </div>
    </div>
  )
}

export default Footer

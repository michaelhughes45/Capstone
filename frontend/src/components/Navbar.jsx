import { IconButton } from "@mui/material";
import { Search, Menu } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";


const Navbar = () => {
  // Controls visibility of dropdown menu
  const [dropdownMenu, setDropdownMenu] = useState(false);

  // Get user state from Redux store
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // Search input state
  const [search, setSearch] = useState("")

  const navigate = useNavigate();

  // Used to delay navigation until after logout state is updated
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Navigate to login page after logout is complete
  useEffect(() => {
    if (isLoggingOut && !user) {
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, user, navigate]);

  return (
    <div className="navbar">
      {/* Logo that links to home */}
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      {/* Search input field with icon */}
      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: "var(--pinkred)" }}
            onClick={() => { navigate(`/properties/search/${search}`) }}
          />
        </IconButton>
      </div>

      {/* Right side of navbar: account and host actions */}
      <div className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">
            Become A Host
          </Link>
        ) : (
          <Link to="/login" className="host">
            Become A Host
          </Link>
        )}

        {/* Account dropdown toggle */}
        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: "var(--darkgrey)" }} />
          {/* Display user profile photo or default image */}
          {!user || !user.profileImagePath ? (
            <img
              src="/default_user.png"
              alt="default profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_API_URL}${user.profileImagePath}`}
              alt="profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {/* Dropdown menu for non-authenticated users */}
        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {/* Dropdown menu for authenticated users */}
        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/create-listing">Become A Host</Link>

            {/* Logout option triggers Redux logout and navigation */}
            <Link
              to="#"
              onClick={() => {
                dispatch(setLogout());
                setIsLoggingOut(true);
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

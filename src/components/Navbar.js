import React from 'react'
import logo from '../trustneat_logo.png'
import { Link } from 'react-router-dom'

/**
 * This function has the account address as parameter and renders 
 * the navbar at the top of each page
 */
function Navbar ({ account }) {
	return (
		<nav className="navbar navbar-dark fixed-top bg-dark p-2 shadow mb-3">
			{
			// It includes the logo, a link to the restaurants page, as well as a link for adding a new restaurant and the address
			// The rest of the web application can be reached using buttons and dedicated buttons are not required
			// to keep the application simple
			}
			<Link to="/">
				<img src={logo} width="150" height="30" className="d-inline-block align-top" alt="" />
			</Link>
			<Link to="/" className="link">
				Restaurants
			</Link>
			<Link to="/add-restaurant" className="link">
				Add restaurant 
			</Link>
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
					<small className="text-secondary">
						<small id="account">{account}</small>
					</small>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;

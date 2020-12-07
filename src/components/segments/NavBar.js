import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import '../../styles/navbar.scss';

function NavBar(){
  const [open, setOpen] = useState(false);

  return(
    <div className="nav-wrap">
      <nav>
        <div className="logo">Repitise</div>
        <ul className="nav-links" style={{transform: open ? "translateX(0px)" : ""}}>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
        <i onClick={() => setOpen(!open)} className="fas fa-bars burger"></i>
      </nav>
    </div>
  )
}

export default NavBar;

import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import '../index.css';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, useClerk, UserButton } from "@clerk/clerk-react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [showMenu, setShowMenu] = useState(false);
  const [showDefaultMenu, setDefaultMenu] = useState(false);
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (windowWidth < 1200) {
      document.body.classList.toggle('no-scroll');
      document.querySelector('.blur-overlay').classList.toggle('active'); 
    }
  };
  const toggleDefaultMenu = () => {
    setDefaultMenu(!showDefaultMenu);
    if (windowWidth >= 1200) {
      document.body.classList.toggle('no-scroll');
      document.querySelector('.blur-overlay').classList.toggle('active'); 
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1200) {
        setShowMenu(false); 
        setDefaultMenu(false); 
        document.body.classList.remove('no-scroll'); 
        document.querySelector('.blur-overlay').classList.remove('active'); 
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='navbar'>
      {windowWidth < 1200 && (
        <button className="hamburger-menu" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </button>
      )}

      <div className="blur-overlay"></div>

      {(showMenu || windowWidth >= 1200) && (
        <div className='nav-icons' style={{ display: windowWidth >= 1200 || showMenu ? 'flex' : 'none' }}>
          <Link to='/discovercat' style={{ display: 'flex', alignItems: 'center' }}>
            <motion.button whileHover={{scale:1.1}}>Discover</motion.button>
          </Link>
          <Link to='/creators' style={{ display: 'flex', alignItems: 'center' }}>
          <motion.button whileHover={{scale:1.1}}>Creators</motion.button>
          </Link>
          <Link to='/testimonials' style={{ display: 'flex', alignItems: 'center' }}>
          <motion.button whileHover={{scale:1.1}}>Testimonials</motion.button>
          </Link>
        </div>
      )}

      <div className='logo-div'>
        <Link to='/'>
          <img src={logo} alt="" className='logopic' />
        </Link>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'10vw'}}>
        <div>

        <Menu>
          <MenuButton background='none' border='none' >
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </MenuButton>
          <MenuList>
            <MenuItem fontFamily='Helvetica' fontWeight='bold' fontSize='15px' height='5vh' background='black' color='white' border='none'><Link style={{textDecoration:'none',color:'white'}} to='/profile'>Profile</Link></MenuItem>
            <MenuItem fontFamily='Helvetica' fontWeight='bold' fontSize='15px' height='5vh' background='black' color='white' border='none'><Link style={{textDecoration:'none',color:'white'}} to='/forums'>Forums</Link></MenuItem>
            <MenuItem fontFamily='Helvetica' fontWeight='bold' fontSize='15px' height='5vh' background='black' color='white' border='none'><Link style={{textDecoration:'none',color:'white'}} to='/discover'>Discover</Link></MenuItem>
          </MenuList>
        </Menu>
        </div>
        
        <div className='space' style={{ display: 'flex', alignItems: 'center' }}>
          <SignedOut>
            <SignInButton>
              <button className='clerk-btn' style={{
                margin:'0 20px',
                marginLeft: '40px',
                width: "100px",
                height: "40px",
                border: "none",
                fontSize: "1rem",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "700",
                cursor: "pointer",
                background: "none",
                color: "white",
                border: "1px solid white",
                borderRadius: "50px"
              }}>Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}

export default Navbar;

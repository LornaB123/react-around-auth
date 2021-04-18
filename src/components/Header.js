import React from 'react';
import logoPic from '../images/logo.svg';
import { Link } from 'react-router-dom';

function Header(props) {
    const {loggedIn, logout, userEmail} = props;
    return (
      <header className="header">
        <img src={logoPic} alt="Around the US" className="logo" />
        <>
      {loggedIn && (
        <ul className='header__links'>
          <li className='header__email'>{userEmail}</li>
          <li>
            <Link className='header__link' onClick={logout} to='/signin'>
              Log out
            </Link>
          </li>
        </ul>)}
    </>
      </header>
    );
}

export default Header;
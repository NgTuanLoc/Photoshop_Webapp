import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../images/logo.png'

const Header = () => {
    return (
        <div className="header">
            <div className="header__logo">
                <img src={Logo} alt="" />
            </div>
            <ul className="header__infor-list">
                <li className="header__infor-item">
                    <Link to="/" className="header__infor-item-link">
                        Home
                    </Link>
                </li>
                <li className="header__infor-item">
                    <Link to="/detect" className="header__infor-item-link">
                        Detection
                    </Link>
                </li>
                <li className="header__infor-item">
                    <Link to="/" className="header__infor-item-link">
                        Contact
                    </Link>
                </li>
                <li className="header__infor-item">
                    <Link to="/" className="header__infor-item-link">
                        Information
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Header;

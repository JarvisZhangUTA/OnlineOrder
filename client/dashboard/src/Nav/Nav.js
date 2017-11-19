import React from 'react';
import Auth from '../auth';
import './Nav.css';

class Nav extends React.Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo" href="/dashboard"> 
                        &nbsp;&nbsp;Dashboard 
                    </a>
                    {this.customerContent()}
                </div>
            </nav>
        );
    }

    customerContent() {
        if(Auth.isSignedIn())
            // Logged In show menu
            return (
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <a href="/dashboard/Account">Account</a>
                    </li>
                    <li>
                        <a href="/dashboard/Info">Info</a>
                    </li>
                    <li>
                        <a href="/dashboard/Items">Items</a>
                    </li>
                    <li>
                        <a href="/dashboard/History">History</a>
                    </li>
                    <li>
                        <a href="/dashboard/About">About</a>
                    </li>
                    <li>
                        <a href="/dashboard/signout">Sign Out</a>
                    </li>
                </ul>
            );
        else 
            // Not Logged In show signIn
            return (
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <a href="/dashboard/signin">Sign In</a>
                    </li>
                    <li>
                        <a  href="/dashboard/signup">Sign Up</a>
                    </li>
                </ul>
            );
    }
}

export default Nav;
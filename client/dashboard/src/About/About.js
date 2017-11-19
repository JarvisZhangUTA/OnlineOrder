import React from 'react';
import $ from 'jquery';
import './About.css';
import {MdAccountCircle, MdMenu, MdLocalRestaurant} from 'react-icons/lib/md';

class About extends React.Component {
    componentDidMount() {
        $('.parallax').parallax();
    }

    render() {
        return (
            <div>
                <div className="parallax-container">
                    <div class="parallax">
                        <img 
                            src={'http://' + window.location.hostname + ':' + window.location.port + 
                               '/file/header.jpg'} 
                            alt="header"/>
                    </div>
                </div>
                <div className="container">
                    <br/>
                    <h4 className="text-red-accent-2">Here is your dashboard</h4>
                    <p className="caption">
                        Want to get more restaurant orders and butts in seats in 8 weeks without the frustration of DIY restaurant website solutions?
                        Here you can build you own restaurant website and a menu link that
                        can be put anywhere.
                    </p>
            
                    <div className="row">
                        <div className="col s12 m4">
                            <div className="promo">
                                <MdAccountCircle className="icon"/>
                                <p className="promo-caption">
                                    Sign up account
                                </p>
                                <p className="light">
                                    Sign up with your email. For now we won't charge you any fee.
                                </p>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <div className="promo">
                                <MdLocalRestaurant className="icon"/>
                                <p className="promo-caption">
                                    Fill up your information
                                </p>
                                <p className="light">
                                    Name, address, phone, description, time, special ...
                                </p>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <div className="promo">
                                <MdMenu className="icon"/>
                                <p className="promo-caption">
                                    Edit your menu
                                </p>
                                <p className="light">
                                    Menus, OpenTable reservations, event calendars, and eCommerce are just a click away from your restaurant website.
                                </p>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }
} 

export default About;
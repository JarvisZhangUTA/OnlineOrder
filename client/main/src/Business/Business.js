import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import './Business.css';

import React, { Component } from 'react';
import Map from '../Map/Map';
import $ from 'jquery';

class Business extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            business: {
                _id: '',
                index: '',
                image: '',
                phone: '',
                name: '',
                introduction: '',
                hours: '',
                addition: '',
                location: {
                    address: '',
                    lat: 0,
                    lng: 0
                }
            }
        };

        this.loadBusiness();
    }

    componentDidMount() {
        $('.parallax').parallax();
    }

    render() {

        return (
        <div>
           <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo"> 
                        &nbsp;&nbsp;{this.state.business.name} 
                    </a>
                    <ul className="right hide-on-med-and-down">
                        <li>
                            <a href={'/order/' + this.state.business.index}>OnlineOrder</a>
                        </li>
                    </ul>
                </div>
            </nav>
            
            <img className="responsive-img" src={this.state.business.image} alt="header"/>
            <br/><br/>

            <div className="container">
                <div className="row">
                    <div className="col s12 m8">
                        <div 
                            dangerouslySetInnerHTML={{ __html: this.state.business.introduction }}/>
                    </div>
                    
                    <div className="col s12 m4">
                        <div className="row">
                            <a class="col s10 offset-s1 waves-effect waves-light btn orange" 
                                href={'/order/' + this.state.business.index}>
                                Order Online
                            </a>
                        </div>
                        
                        <div className="card hoverable">
                            <div className="card-content">
                                <div className="card-title">
                                    Hours
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: this.state.business.hours }}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card hoverable">
                    <div className="card-content">
                        <div className="row">
                            <div className="col s12 m4"> 
                                <div className="card-title">
                                    Location
                                </div>
                                <p 
                                    dangerouslySetInnerHTML={{ 
                                        __html: this.state.business.location.address.replace(',', '<br/>') 
                                        }}
                                >
                                </p>
                                <p>
                                    Phone: <span className="red-text"> {this.state.business.phone} </span>
                                </p>
                            </div>
                            <div className="col s12 m8">
                                <Map 
                                    key = {this.state.business.location.lat}
                                    lat = {this.state.business.location.lat}
                                    lng = {this.state.business.location.lng}/>
                            </div>
                        </div>
                    </div>
                </div>

                <footer class="page-footer">
                    <div class="container">
                        <div class="row">
                        <div class="col l6 s12">
                            <div dangerouslySetInnerHTML={{ __html: this.state.business.addition }}/>
                        </div>
                        <div class="col l4 offset-l2 s12">
                            <h5 class="white-text">Links</h5>
                            <ul>
                            <li>
                                <a class="grey-text text-lighten-3" href={'/order/' + this.state.business.index}>
                                    OrderOnline
                                </a>
                            </li>
                            <li>
                                <a class="grey-text text-lighten-3" href="/">About Us</a>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div class="footer-copyright">
                        <div class="container">
                            © 2017 {this.state.business.name}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        );
    }

    loadBusiness() {
        const arr = window.location.href.split('/');
        const index = arr[arr.length - 1];
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/index/' + index;
        const request = new Request(url, {method: 'GET'});
  
        fetch(request)
            .then((res) => res.json())
            .then((business) => {
                if(!business.location){
                    business.location = {
                        address: '',
                        lat: 0,
                        lng: 0
                    }
                }
                this.setState({
                    business: business
                });
            });
    }
}

export default Business;

import React from 'react';
import SweetAlert from 'sweetalert-react';
import Upload from 'rc-upload';
import Map from '../Map/Map';
import SearchBox from '../Map/SearchBox';
import Textarea from "react-textarea-autosize";

import './Info.css'

class Info extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            business: {
                _id: '',
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
            },
            alert: {
                show: false,
                title: '',
                text: ''
            }
        };

        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onIntroductionChange = this.onIntroductionChange.bind(this);
        this.onAdditionChange = this.onAdditionChange.bind(this);
        this.onHoursChange = this.onHoursChange.bind(this);
        this.onAddressWillChange = this.onAddressWillChange.bind(this);
        this.onAddressChanged = this.onAddressChanged.bind(this);
        this.updateBusiness = this.updateBusiness.bind(this);
        this.uploaderProps = this.uploadProps();
        this.loadBusiness();
    }

    render() {
        let uploadSection = this.state.business.image ?
        (
            <img className="header-image-section responsive-img" 
                alt={this.state.business.image}
                src={this.state.business.image}/>
        ):(
            <div className="header-image-section">
                <br/><br/><br/>
                <h6 className="center-align">
                    +
                </h6>
                <h6 className="center-align">
                    Put your header image here.
                </h6>
                <br/><br/><br/>
            </div>
        );


        let addressSection = (
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        Address
                    </div>

                    <div className="row">
                        <div className="col s12 m4">
                            <input type="number" placeholder="Phone" className="validate"
                                onChange={this.onPhoneChange}
                                value={this.state.business.phone}/>
                            <SearchBox 
                                onAddressWillChange = {this.onAddressWillChange}
                                onAddressChanged ={this.onAddressChanged}
                                address={this.state.business.location.address}/>
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
        );

        let textareaPlaceholder = 
        `   <h5>This is a sample title</h5>
         <p>This is a sample content</p>
        `;

        let introductionSection = (
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        Introduction
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <Textarea
                                placeholder={textareaPlaceholder}
                                onChange={this.onIntroductionChange}
                                defaultValue={textareaPlaceholder}
                                value={this.state.business.introduction}/>
                            <p>
                                *We support HTML tag and 
                                <a href="http://materializecss.com"> Materialize styles </a> here
                            </p>
                        </div>
                        <div className="col s12 m6">
                            <div 
                                className="pre-section" 
                                dangerouslySetInnerHTML={{ __html: this.state.business.introduction }} />
                        </div>
                    </div>
                </div>
            </div>
        );

        let hoursSection = (
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        Hours
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <Textarea 
                                placeholder={textareaPlaceholder}
                                onChange={this.onHoursChange}
                                defaultValue={textareaPlaceholder}
                                value={this.state.business.hours}/>
                            <p>
                                *We support HTML tag and 
                                <a href="http://materializecss.com"> Materialize styles </a> here
                            </p>
                        </div>
                        <div className="col s12 m6">
                            <div
                                className="pre-section"  
                                dangerouslySetInnerHTML={{ __html: this.state.business.hours }} />
                        </div>
                    </div>
                </div>
            </div>
        );

        let additionSection = (
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        Additional Information
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <Textarea 
                                placeholder={textareaPlaceholder}
                                onChange={this.onAdditionChange}
                                defaultValue={textareaPlaceholder}
                                value={this.state.business.addition}/>
                            <p>
                                *We support HTML tag and 
                                <a href="http://materializecss.com"> Materialize styles </a> here
                            </p>
                        </div>
                        <div className="col s12 m6">
                            <div className="pre-section" 
                                dangerouslySetInnerHTML={{ __html: this.state.business.addition}} />
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="container">
                <br/>

                <div className="card">
                    <div className="card-content">
                        <div className="card-title">
                            Header Image
                        </div>

                        <div className="row">
                            <Upload {...this.uploaderProps} className="hoverable" ref="inner">
                                {uploadSection}
                            </Upload>
                            <p className="right-align">
                                *We suggest you to use an image within 100kb
                            </p>
                        </div>
                    </div>
                </div>

                {addressSection}

                {introductionSection}

                {hoursSection}

                {additionSection}

                <br/>
                <div className="row">
                    <a onClick={this.updateBusiness} 
                       className="col s10 offset-s1 waves-effect waves-light btn-large">
                        Update
                    </a>
                </div>

                <SweetAlert
                    show={this.state.alert.show}
                    title={this.state.alert.title}
                    text={this.state.alert.text}
                    onConfirm={() => this.setState({ alert:{show: false}})}
                />
            </div>
        );
    }

    onAddressChanged(location) {
        const business = this.state.business;
        business.location = location;
        this.setState({business});
    }

    onAddressWillChange(e) {
        const business = this.state.business;
        business.location.address = e.target.value;
        this.setState({business});
    }

    onPhoneChange(e) {
        const business = this.state.business;
        business.phone = e.target.value;
        this.setState({business});
    }

    onIntroductionChange(e) {
        const business = this.state.business;
        business.introduction = e.target.value;
        this.setState({business});
    }

    onHoursChange(e) {
        const business = this.state.business;
        business.hours = e.target.value;
        this.setState({business});
    }

    onAdditionChange(e) {
        const business = this.state.business;
        business.addition = e.target.value;
        this.setState({business});
    }

    alert(title, text) {
        this.setState({
            alert: {
                show: true,
                title: title,
                text: text
            }
        });
    }

    loadBusiness(){
        const id = localStorage.getItem('id');
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/info/' + id;
        const request = new Request(url, {method: 'GET'});

        fetch(request)
            .then((res) => res.json())
            .then((business) => {
                if(!business.location){
                    business.location = {
                        address: '',
                        lat: 0,
                        lng: 0
                    };
                }
                this.setState({
                    business: business
                });
            });
    }

    updateBusiness() {
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/update';
        const token = localStorage.getItem('token');

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'XXX ' + token
            },
            body: JSON.stringify(this.state.business)
        }).then(response=>{
            if(response.status === 200){
                this.alert('Success', 'Change Saved');
            } else {
                // 失败
                response.json().then((res)=>{
                    this.alert('Error Happened', res.error);
                });
            }
        });
    }

    uploadProps() {
        return {
            name: 'imageFile',
            action: 'http://' + window.location.hostname + ':' + window.location.port + '/file/upload',
            data: { _id: localStorage.getItem('id')},
            headers: {
                'Authorization': 'XXX ' + localStorage.getItem('token')
            },
            onSuccess: (file) => {
              this.alert('Image uploaded');
              const business = this.state.business;
              business.image = 'http://' + window.location.hostname + ':' + window.location.port + 
                               '/file/' + file;              
              this.setState({business});
            },
            onError: (err) => {
              this.alert(err);
            },
        };
    }
} 

export default Info;
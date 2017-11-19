import React from 'react';
import Validator from 'validator';
import FaTimes from 'react-icons/lib/fa/times-circle';
import SweetAlert from 'sweetalert-react';
import './Account.css';

class Account extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            business: {
                _id: '',
                email: '',
                name: '',
                password: '',
                notification: []
            },
            new_notify: '',
            alert: {
                show: false,
                title: '',
                text: ''
            }
        };

        this.addNotify = this.addNotify.bind(this);
        this.removeNotify = this.removeNotify.bind(this);
        this.changeNotify = this.changeNotify.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.updateBusiness = this.updateBusiness.bind(this);

        this.loadBusiness();
    }

    loadBusiness(){
        const id = localStorage.getItem('id');
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/info/' + id;
        const request = new Request(url, {method: 'GET'});

        fetch(request)
            .then((res) => res.json())
            .then((business) => {
                this.setState({
                    business: business
                });
            });
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

    changeName(event) {
        const business = this.state.business;
        business.name = event.target.value;
        this.setState({
            business: business
        });
    }

    changePassword(event) {
        const business = this.state.business;
        business.password = event.target.value;

        this.setState({
            business: business
        });
    }

    addNotify() {
        const email = this.state.new_notify;
        const business = this.state.business;

        if(Validator.isEmail(email)) {
            business.notification.push(email);
            this.setState({
                business: business,
                new_notify: ''
            });
        }
    }

    removeNotify(email) {
        const business = this.state.business;
        const index = business.notification.indexOf(email);
        if(index !== -1) {
            business.notification.splice(index, 1);
            this.setState({
                business: business
            });
        }
    }

    changeNotify(event) {
        this.setState({new_notify: event.target.value});
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

    render() {
        const url = 'http://' + window.location.hostname + ':' + window.location.port + 
                        '/order/' + this.state.business._id;

        const email_list = this.state.business.notification.map(
            (email) => {
                return (
                    <li class="collection-item" key={email}>
                        {email}

                        <a onClick={() => this.removeNotify(email)} class="waves-effect waves-teal btn-flat">
                            <FaTimes/>
                        </a>
                    </li>
                );
            }
        );

        
        return (
            <div className="container">
                <br/>
                <div className="card hoverable">
                    <div className="card-content">
                        <span class="card-title">Use this link for promotion:</span>
                        <a href={url}>{url}</a>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="card-title">
                            Account
                        </div>

                        <div className="input-field">
                            <input disabled id="email" type="email" name="email"
                                    className="validate" 
                                    value={this.state.business.email}/>
                        </div>

                        <div className="input-field">
                            <input id="name" placeholder="name" type="text" name="name"
                                    onChange={this.changeName}
                                    className="validate" value={this.state.business.name}/>
                            <label for="name">Name</label>
                        </div>

                        <div className="input-field">
                            <input id="password" placeholder="password" type="password" name="password"
                                    autocomplete="new-password"
                                    onChange={this.changePassword}
                                    value={this.state.business.password}
                                    className="validate" />
                            <label for="password">Password</label>
                        </div>
                    </div>
                </div>

                <ul className="collection with-header">
                    <li className="collection-header row">
                        <h5>&nbsp;&nbsp;Notification Emails</h5>
                    </li>
                    <li className="collection-item row">
                        <div className="input-field col m10 s12">
                            <input placeholder="email" type="text" className="validate" 
                                value={this.state.new_notify}
                                onChange={this.changeNotify}/>
                        </div>
                        <div class="input-field col m2 s12">
                            <a onClick={this.addNotify} class="btn waves-effect waves-teal">
                                Add
                            </a>
                        </div>
                    </li>
                    {email_list}
                </ul>

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
} 

export default Account;
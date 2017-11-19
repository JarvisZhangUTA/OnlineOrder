import React from 'react';
import SignUpForm from './SignUpForm';
import PropTypes from 'prop-types';
import Validator from 'validator';

class SignUp extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error : "",
            user : {
                email : "",
                password: "",
                confirm: "",
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        return (
            <SignUpForm
                onSubmit = {this.onSubmit}
                onChange = {this.onChange}
                error = {this.state.error}
                user = {this.state.user}
            />
        );
    }

    onChange(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({user});
    }

    onSubmit(event) {
        /**
         * url: http://server_host:3000/business/signup
         * {
         *  error: ""
         * }
         */

        event.preventDefault();
        
        const signup_url = 'http://' + window.location.hostname + ':' + 
                        window.location.port +'/business/signup';
        const email = this.state.user.email;
        const password = this.state.user.password;
        const confirm = this.state.user.confirm;

        if(!Validator.isEmail(email)) {
            this.setState({
                error: 'Email invalid'
            });
            return;
        }

        if(password.length < 8) {
            this.setState({
                error: 'Password should be at least 8 characters'
            });
            return;
        }

        if(password !== confirm) {
            this.setState({
                error: 'Password doesn\'t match'
            });
            return;
        }

        fetch(signup_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.user.email,
                password: this.state.user.password
            })
        }).then(response=>{
            if(response.status === 200){
                // 成功
                this.setState({error: ""});
                // 界面跳转
                this.context.router.replace('/dashboard/signin');
            } else {
                response.json().then(res => {
                    this.setState({error: res.error});
                });
            }
        });
    }
}

// 规定context必须含有router
SignUp.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SignUp;
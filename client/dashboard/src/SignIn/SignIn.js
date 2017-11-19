import React from 'react';
import Auth from '../auth';
import SignInForm from './SignInForm';
import PropTypes from 'prop-types';

class SignIn extends React.Component {

    constructor(props, context) {
        // context 交给父类处理
        super(props, context);
        this.state = {
            error : "",
            user : {
                email : "",
                password: "",
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        return (
           <SignInForm
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
         * url: http://server_host:3000/user/signin
         * {
         *  email: "",
         *  error: "",
         *  token: "",
         * }
         */
        event.preventDefault();

        const signin_url = 'http://' + window.location.hostname + ':' +
                             window.location.port + '/business/signin';
        const email = this.state.user.email;
        const password = this.state.user.password;

        fetch(signin_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response=>{
            if(response.status === 200){
                // 成功
                this.setState({error: ""});
                response.json().then((res)=>{
                    Auth.userSignIn(res.id, res.email, res.token);
                    // 界面跳转
                    this.context.router.replace('/dashboard');
                });

            } else {
                // 失败
                response.json().then((res)=>{
                   this.setState({error: res.error});
                });
            }
        });
    }
}

// 规定context必须含有router
SignIn.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SignIn;
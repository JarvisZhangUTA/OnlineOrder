import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';

import React from 'react';
import PropTypes from 'prop-types';
import './SignUpForm.css';

// decouple the UI and logical, this is the UI part for SignIn
// {} destructuring assignment, 实际上传入的是一个object, 包含了规定的参数，自动将参数赋值给对应变量
const SignUpForm =
    ({
         onSubmit,
         onChange,
         error,
         user
     }) => (
        <div className="container">
            <br/><br/>   
            <div className="card">
                <form className="card-content" onSubmit={onSubmit} action="/">
                    <h4>Sign Up</h4>

                    <div className="input-field">
                        <input id="email" type="email" name="email"
                            className="validate" onChange={onChange}/>
                        <label htmlFor="email">Email</label>
                    </div>

                    <div className="input-field">
                        <input id="password" type="password" name="password"
                            className="validate" onChange={onChange}/>
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="input-field">
                        <input id="confirm" type="password" name="confirm"
                            className="validate" onChange={onChange}/>
                        <label htmlFor="confirm">Confirm</label>
                    </div>

                    <div className="row">
                        <input type="submit" className="btn btn-submit waves-effect waves-light"/>
                        {error}
                    </div>
                </form>
            </div>
        </div>
    );

// Type Checking, 运行前校验, 规定传入的参数(是否需要，类型，默认值等)
// 不符合的话编译时就会报错, 避免运行前出现错误
SignUpForm.PropTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
    user: PropTypes.func.isRequired,
};

export default SignUpForm;
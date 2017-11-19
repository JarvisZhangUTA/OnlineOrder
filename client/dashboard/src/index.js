import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import {browserHistory, Router} from 'react-router';

ReactDOM.render(
    <Router history={browserHistory} routes={Routes}/>, 
    document.getElementById('root')
);

import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import 'react-toastify/dist/ReactToastify.min.css' 
import './sweetalert.css';

import Nav from '../Nav/Nav';
import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div>
                <Nav/>
                {this.props.children}
            </div>
        );
    }
} 

export default App;
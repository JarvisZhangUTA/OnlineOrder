import Home from './Home/Home';
import Business from './Business/Business';

const Routes = [    
    {path: '/', component: Home},
    {path: '/:index', component: Business},
];

export default Routes;
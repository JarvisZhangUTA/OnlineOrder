import App from './App/App';
import Auth from './auth';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import Account from './Account/Account';
import History from './History/History';
import Items from './Items/Items';
import Info from './Info/Info';
import About from './About/About';

const Routes = {
    component: App,
    childRoutes: [
        {path: '/dashboard', component: About},
        {path: '/dashboard/Account', component: Account},
        {path: '/dashboard/Info', component: Info},
        {path: '/dashboard/Items', component: Items},
        {path: '/dashboard/History', component: History},
        {path: '/dashboard/About', component: About},
        {path: '/dashboard/signin', component: SignIn},
        {path: '/dashboard/signup', component: SignUp},
        {path: '/dashboard/signout', onEnter: (nextState, replace)=>signOut(replace)}
    ]
};

const signOut = (replace) => {
    Auth.userSignOut();
    replace('/dashboard');
};

export default Routes;
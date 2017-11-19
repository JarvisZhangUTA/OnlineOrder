
class Auth {
    static userSignIn(id, email, token) {
        localStorage.setItem('id', id);
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
    }

    static isSignedIn() {
        return localStorage.getItem('token') !== null;
    }

    static userSignOut() {
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
    }
}

export default Auth;
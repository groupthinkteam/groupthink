const auth = {
  isAuthenticated: localStorage.getItem("login") ? true : false ,
  authenticate(cb) {
    localStorage.setItem('login', "1")
    auth.isAuthenticated = true;
    setTimeout(cb, 100); 
  },
  signout(cb) {
    localStorage.removeItem('login')
    auth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export default auth;
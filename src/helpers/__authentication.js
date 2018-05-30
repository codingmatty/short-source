class Authentication {
  user = false;
  authToken;

  async authenticate(user) {
    console.log('authenticate!');
    console.log('user: ', user);
    this.user = user;
    this.authToken = await user.getIdToken();
  }

  isAuthenticated() {
    return !!this.user;
  }
}

export default new Authentication();

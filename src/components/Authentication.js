import React, { Component } from 'react';

const { Provider, Consumer: AuthConsumer } = React.createContext(
  'Authentication'
);

class Authentication extends Component {
  state = {
    user: null,
    authToken: null
  };

  authenticate = async (user) => {
    this.user = user;
    this.authToken = await user.getIdToken();
  };

  render() {
    const { children } = this.props;
    const { user, authToken } = this.state;

    const poop = (
      <Provider
        value={{
          user,
          authToken,
          authenticate: this.authenticate,
          isAuthenticated: () => !!user
        }}
      >
        {children}
      </Provider>
    );
    console.log('poop: ', poop);
    return poop;
  }
}

export default Authentication;
export { AuthConsumer };

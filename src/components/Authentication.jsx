import React, { Component } from 'react';

const { Provider, Consumer } = React.createContext({
  user: null,
  authToken: null
});

class Authentication extends Component {
  static Consumer = Consumer;

  state = {
    user: null,
    authToken: null
  };

  authenticate = (user, authToken) => {
    this.setState({ user, authToken });
  };

  isAuthenticated = () => {
    return !!this.state.user;
  };

  render() {
    const { children } = this.props;

    return (
      <Provider
        value={{
          ...this.state,
          authenticate: this.authenticate,
          isAuthenticated: this.isAuthenticated
        }}
      >
        {children}
      </Provider>
    );
  }
}

export default Authentication;

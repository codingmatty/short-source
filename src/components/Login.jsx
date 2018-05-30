import get from 'lodash/get';
import React, { Component } from 'react';
import { Route, Link, Redirect, withRouter } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import firbaseConfig from '../firebaseConfig';

import Authentication from './Authentication';

const firebaseApp = firebase.initializeApp(firbaseConfig);

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

class Login extends Component {
  state = {
    isSignedIn: false
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user) => {
        user.getIdToken().then((authToken) => {
          this.props.onAuthenticate(user, authToken);
          this.setState({ isSignedIn: !!user });
        });
      });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const { location } = this.props;
    const { isSignedIn } = this.state;

    if (isSignedIn) {
      const pathname = get(location, 'state.from.pathname', '/');
      return <Redirect to={{ pathname }} />;
    }

    return (
      <div style={{ marginTop: 80 }}>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebaseApp.auth()}
        />
      </div>
    );
  }
}

const LoginContainer = (props) => (
  <Authentication.Consumer>
    {({ authenticate }) => <Login {...props} onAuthenticate={authenticate} />}
  </Authentication.Consumer>
);

export default LoginContainer;

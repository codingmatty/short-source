// import React, { Component } from 'react';
import { Route, Link, Redirect, withRouter } from 'react-router-dom';

// import authentication from '../helpers/authentication';

// class Login extends Component {
//   state = {
//     redirectToReferrer: false
//   };

//   login = () => {
//     authentication.authenticate(() => {
//       this.setState({ redirectToReferrer: true });
//     });
//   };

//   render() {
//     const { location } = this.props;
//     const { from = {} } = location.state;
//     const { pathname = '/' } = from;
//     const { redirectToReferrer } = this.state;

//     if (redirectToReferrer) {
//       return <Redirect to={{ pathname }} />;
//     }

//     return (
//       <div>
//         <p>You must log in to view the page at {pathname}</p>
//         <button onClick={this.login}>Log in</button>
//       </div>
//     );
//   }
// }

// export default Login;

import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import './firebaseui-styling.global.css'; // Import globally.

import { AuthConsumer } from './Authentication';

// Instantiate a Firebase app.
const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAMq6Y6hYG3rIEsRG6U8SY2qwT3dE0bBl8',
  authDomain: 'moniker-app.firebaseapp.com',
  // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  projectId: 'moniker-app'
  // storageBucket: "<BUCKET>.appspot.com",
  // messagingSenderId: "<SENDER_ID>",
});

/**
 * The Splash Page containing the login UI.
 */
class Login extends Component {
  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

  state = {
    isSignedIn: undefined
  };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged(async (user) => {
        await this.props.onAuthenticate(user);
        this.setState({ isSignedIn: !!user });
      });
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  /**
   * @inheritDoc
   */
  render() {
    const { location } = this.props;
    const { from = {} } = location.state || {};
    const { pathname = '/' } = from;
    const { isSignedIn } = this.state;

    if (isSignedIn) {
      return <Redirect to={{ pathname }} />;
    }

    return (
      <div style={{ marginTop: 80 }}>
        <StyledFirebaseAuth
          // className={styles.firebaseUi}
          uiConfig={this.uiConfig}
          firebaseAuth={firebaseApp.auth()}
        />
      </div>
    );
  }
}

export default (props) => (
  <AuthConsumer>
    {({ authenticate }) => <Login {...props} onAuthenticate={authenticate} />}
  </AuthConsumer>
);

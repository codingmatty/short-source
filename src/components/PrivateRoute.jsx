import React, { Component } from 'react';
import { Route, Link, Redirect, withRouter } from 'react-router-dom';

// import authentication from '../helpers/authentication';

import { AuthConsumer } from './Authentication';

class PrivateRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props;
    console.log('poop');
    return (
      <AuthConsumer>
        {({ isAuthenticated }) => (
          <Route
            {...rest}
            render={(props) =>
              isAuthenticated() ? (
                <Component {...props} />
              ) : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }}
                />
              )
            }
          />
        )}
      </AuthConsumer>
    );
  }
}

export default PrivateRoute;

import React, { Component } from 'react';
import { Route, Link, Redirect, withRouter } from 'react-router-dom';

import Authentication from './Authentication';

class PrivateRoute extends Component {
  renderRoute = (renderProps) => {
    const { component: Component, isAuthenticated } = this.props;

    if (isAuthenticated()) {
      return <Component {...renderProps} />;
    }

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: renderProps.location }
        }}
      />
    );
  };

  render() {
    const { component: Component, ...props } = this.props;

    return <Route {...props} render={this.renderRoute} />;
  }
}

const PrivateRouteContainer = (props) => (
  <Authentication.Consumer>
    {({ isAuthenticated }) => (
      <PrivateRoute {...props} isAuthenticated={isAuthenticated} />
    )}
  </Authentication.Consumer>
);

export default PrivateRouteContainer;

import React, { Component } from 'react';
import qs from 'qs';

import Authentication from './Authentication';

class Fetch extends Component {
  static defaultProps = {
    onLoad: () => {},
    onSuccess: () => {},
    onError: () => {},
    renderError: () => null,
    renderLoading: () => null,
    render: () => null
  };

  state = {
    loading: false
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentWillReceiveProps(newProps) {
    const { refetchKey } = this.props;

    if (refetchKey !== newProps.refetchKey) {
      this.shouldFetch = true;
    }
  }

  componentDidMount() {
    this.unmounted = false;
    this.shouldFetch = true;
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  fetch = () => {
    const {
      body,
      headers = {},
      method,
      onError,
      onLoad,
      onSuccess,
      query,
      url,
      authToken
    } = this.props;

    if (!this.shouldFetch) {
      return;
    }
    this.shouldFetch = false;

    this.setState({ loading: true }, () => onLoad());

    const fullUrl = url.includes('?') ? url : `${url}?${qs.stringify(query)}`;

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    fetch(fullUrl, {
      method,
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
        ...headers
      })
    })
      // Is The Response Okay? Is so continue with data
      .then(
        (response) =>
          !response.ok
            ? response.json().then((error) => Promise.reject(error))
            : response.json()
      )
      // On Success, if the Component is not unmounted, set state and call onSuccess callback
      .then(
        (data) =>
          !this.unmounted &&
          this.setState({ data, loading: false }, () => onSuccess(data))
      )
      // On Error, if the Component is not unmounted, set state and call onError callback
      .catch(
        (error) =>
          !this.unmounted &&
          this.setState({ error, loading: false }, () => onError(error))
      );
  };

  render() {
    const { render, renderError, renderLoading } = this.props;
    const { data, error, loading } = this.state;

    if (error) {
      return renderError(error);
    } else if (loading) {
      return renderLoading();
    }
    return render(data);
  }
}

const FetchContainer = (props) => (
  <Authentication.Consumer>
    {({ isAuthenticated, authToken }) => (
      <Fetch {...props} authToken={isAuthenticated() && authToken} />
    )}
  </Authentication.Consumer>
);

export default FetchContainer;

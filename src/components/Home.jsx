import React, { Component, Fragment } from 'react';

// import './home.css';
import ShortenForm from './ShortenForm';
import LinksList from './LinksList';

class Home extends Component {
  render() {
    console.log('poop');
    return (
      <Fragment>
        <ShortenForm />
        <LinksList />
      </Fragment>
    );
  }
}

export default Home;

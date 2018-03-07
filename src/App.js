import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import ShortenForm from './components/ShortenForm';
import SlugStats from './components/SlugStats';

import './app.css';

class App extends Component {
  render() {
    return (
      <Router basename="/app">
        <div className="app">
          <Route exact path="/" render={() => 'home'} />
          <Route path="/shorten" component={ShortenForm} />
          <Route path="/stats/:slug" component={SlugStats} />
        </div>
      </Router>
    );
  }
}

export default App;

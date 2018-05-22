import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Home from './components/Home';
import SlugStats from './components/SlugStats';

import './app.css';

class App extends Component {
  render() {
    return (
      <Router basename="/app">
        <div className="app">
          <AppBar>
            <Toolbar>Moniker</Toolbar>
          </AppBar>
          <Route exact strict path="/" component={Home} />
          <Route path="/stats/:slug" component={SlugStats} />
        </div>
      </Router>
    );
  }
}

export default App;

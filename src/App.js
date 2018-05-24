import { create } from 'jss';
import React, { Component } from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Home from './components/Home';
import SlugStats from './components/SlugStats';

import './app.css';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = 'jss-insertion-point';

class App extends Component {
  render() {
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <Router basename="/app">
          <div className="app">
            <AppBar>
              <Toolbar>
                <Typography variant="headline">Moniker</Typography>
              </Toolbar>
            </AppBar>
            <Route exact strict path="/" component={Home} />
            <Route path="/stats/:slug" component={SlugStats} />
          </div>
        </Router>
      </JssProvider>
    );
  }
}

export default App;

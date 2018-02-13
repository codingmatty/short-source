import React, { Component } from 'react';
import autobind from 'react-autobind';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { url: '' };

  constructor() {
    super();
    autobind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { url } = this.state;

    fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then(({ url }) => this.setState({ message: url }))
      .catch(() => this.setState({ message: 'ERROR!' }));
  }

  render() {
    const { message } = this.state;

    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">Url to Shrink</label>
          <input
            id="url"
            type="text"
            onChange={({ target }) => this.setState({ url: target.value })}
          />
        </form>
        <div>{message}</div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import autobind from 'react-autobind';
import './app.css';

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
          return res.json().then((err) => Promise.reject(err));
        }
        return res.json();
      })
      .then(({ url }) => this.setState({ shortUrl: url, error: null }))
      .catch(({ error }) => this.setState({ shortUrl: null, error }));
  }

  render() {
    const { shortUrl, error } = this.state;

    return (
      <div className="app">
        <form className="url-form" onSubmit={this.onSubmit} autoComplete="off">
          <label htmlFor="url" className="url-label">
            Url to Shrink
          </label>
          <input
            id="url"
            type="text"
            className="url-input"
            onChange={({ target }) => this.setState({ url: target.value })}
          />
          <button className="url-submit">Submit</button>
          {shortUrl && (
            <p className="url-result">
              The resulting URL is:{' '}
              <a href={shortUrl} rel="noopener noreferrer" target="_blank">
                {shortUrl}
              </a>
            </p>
          )}
          {error && <p className="url-error">{error}</p>}
        </form>
      </div>
    );
  }
}

export default App;

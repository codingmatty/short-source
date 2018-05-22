import React, { Component } from 'react';
import autobind from 'react-autobind';

// import './links-list.css';

class LinksList extends Component {
  state = { links: [], error: null };

  constructor() {
    super();
    autobind(this);
  }

  componentDidMount() {
    this.fetchLinks();
  }

  fetchLinks() {
    fetch('/api/links')
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => Promise.reject(err));
        }
        return res.json();
      })
      .then(({ links }) => this.setState({ links, error: null }))
      .catch(({ error }) => this.setState({ error }));
  }

  render() {
    const { links } = this.state;
    return (
      <ul>
        {links.map((link) => (
          <li>
            {link.slug}: {link.url}
          </li>
        ))}
      </ul>
    );
  }
}

export default LinksList;

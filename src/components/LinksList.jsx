import React, { Component, Fragment } from 'react';
import autobind from 'react-autobind';

import Loading from './Loading';
import Fetch from './Fetch';

// import './links-list.css';

class LinksList extends Component {
  static defaultProps = {
    onListUpdate: () => {}
  };

  state = { links: [], refetchKey: Date.now() };

  componentWillReceiveProps({ shouldRefetch }) {
    if (shouldRefetch) {
      this.setState({ refetchKey: Date.now() });
    }
  }

  onSuccess = ({ links }) => {
    const { onListUpdate } = this.props;
    this.setState({ links });
    onListUpdate();
  };

  render() {
    const { links, refetchKey } = this.state;

    return (
      <div className="links-list">
        <Fetch
          url="/api/links"
          refetchKey={refetchKey}
          onSuccess={this.onSuccess}
          renderLoading={() => <Loading />}
        />
        {!!links.length && (
          <ul>
            {links.map((link) => (
              <li key={link.slug}>
                {link.createdAt}: {link.slug}: {link.url}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default LinksList;

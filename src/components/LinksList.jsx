import React, { Component, Fragment } from 'react';
import autobind from 'react-autobind';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Loading from './Loading';
import Fetch from './Fetch';

import './links-list.css';

const styles = {
  listItem: {
    paddingBottom: 0,
    paddingTop: 3
  }
};

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
    const { classes } = this.props;
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
          <List>
            {links.map((link) => (
              <ListItem key={link.slug} className="links-list__item">
                <Card className="links-list__item__card">
                  <CardContent>
                    <ListItemText
                      primary={link.shortUrl}
                      secondary={link.url}
                    />
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(LinksList);

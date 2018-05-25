import classnames from 'classnames';
import React, { Component, Fragment } from 'react';
import autobind from 'react-autobind';

import {
  ResponsiveContainer,
  Label,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from 'recharts';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Loading from './Loading';
import Fetch from './Fetch';

import './links-list.css';

function LinkChart({ link }) {
  const data = Array.from(Array(7)).map((_, i) => {
    const day = moment()
      .startOf('day')
      .subtract(6 - i, 'd');
    return {
      date: day.format('ddd'),
      count: link.data.date[day.toLocaleString()] || 0
    };
  });
  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey="date" tick={() => null} height={3} tickLine={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

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
    const { newUrl } = this.props;
    const { links, refetchKey } = this.state;

    return (
      <div className="links-list">
        <Fetch
          url="/api/links"
          query={{ utcOffset: new Date().getTimezoneOffset() }}
          refetchKey={refetchKey}
          onSuccess={this.onSuccess}
          renderLoading={() => <Loading />}
        />
        {!!links.length && (
          <List>
            {links.map((link) => (
              <ListItem key={link.slug} className="links-list__item">
                <Card
                  className={classnames('links-list__item__card', {
                    new: newUrl === link.shortUrl
                  })}
                >
                  <ListItemText primary={link.shortUrl} secondary={link.url} />
                  <div className="chart-container">
                    <div>Weekly Activity</div>
                    <div className="chart-container__chart">
                      <LinkChart link={link} />
                    </div>
                  </div>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    );
  }
}

export default LinksList;

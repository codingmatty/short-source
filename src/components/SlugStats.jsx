import moment from 'moment';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import {
  ResponsiveContainer,
  BarChart,
  linearGradient,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar
} from 'recharts';

import './slug-stats.css';

class SlugStats extends Component {
  state = {};

  constructor() {
    super();
    autobind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { slug } = params;
    fetch(`/api/stats?slug=${slug}`)
      .then((res) => res.json())
      .then((stats) => {
        const { ['date.date']: visitCountByDate } = stats;
        const data = Array.from(Array(7)).map((x, i) => ({
          date: moment
            .utc()
            .startOf('day')
            .subtract(7 - 1 - i, 'day')
        }));
        data.forEach((dataItem) => {
          if (visitCountByDate[dataItem.date.toString()]) {
            dataItem.count = visitCountByDate[dataItem.date.toString()] * 100;
          }
          dataItem.date = dataItem.date.format('M/D');
        });
        this.setState({ data });
      });
  }

  render() {
    const { match, location } = this.props;
    const { data } = this.state;

    return (
      <div className="slug-stats">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default SlugStats;

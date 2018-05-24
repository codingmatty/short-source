import React, { Component, Fragment } from 'react';
import { withStatechart } from 'react-automata';

// import './home.css';
import ShortenForm from './ShortenForm';
import LinksList from './LinksList';

class Home extends Component {
  state = { shouldUpdateList: false };

  componentWillTransition(event) {
    this.setState({ shouldUpdateList: event === 'SHORTEN' });
  }

  render() {
    const { transition } = this.props;
    const { shouldUpdateList } = this.state;

    return (
      <Fragment>
        <ShortenForm onShorten={() => transition('SHORTEN')} />
        <LinksList
          shouldRefetch={shouldUpdateList}
          onListUpdate={() => transition('LIST_UPDATED')}
        />
      </Fragment>
    );
  }
}

const statechart = {
  initial: 'initial',
  states: {
    initial: {
      on: {
        SHORTEN: 'updateList'
      }
    },
    updateList: {
      on: {
        LIST_UPDATED: 'initial'
      }
    }
  }
};

export default withStatechart(statechart)(Home);

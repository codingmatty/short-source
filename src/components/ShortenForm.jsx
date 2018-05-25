import React, { Component, Fragment } from 'react';
import { Action, withStatechart } from 'react-automata';

import Paper from '@material-ui/core/Paper';

import Fetch from './Fetch';

import './shorten-form.css';

class ShortenForm extends Component {
  static defaultProps = {
    onShorten: () => {}
  };

  state = { url: '' };

  render() {
    const { onShorten, transition, error } = this.props;

    return (
      <Paper className="shorten-form">
        <form
          className="shorten-form__form"
          onSubmit={(e) => {
            e.preventDefault();
            transition('SUBMIT');
          }}
          autoComplete="off"
        >
          <label htmlFor="url" className="shorten-form__label">
            Url to Shrink
          </label>
          <input
            id="url"
            type="text"
            className="shorten-form__input"
            onChange={({ target }) => this.setState({ url: target.value })}
          />
          {error && <p className="shorten-form__error">{error}</p>}
          <button className="shorten-form__submit">Submit</button>
        </form>
        <Action show="submit">
          <Fetch
            url="/api/shorten"
            method="POST"
            body={{ url: this.state.url }}
            onLoad={() => console.log('loading...')}
            onError={({ error }) => transition('COMPLETE', { error })}
            onSuccess={({ url }) => {
              transition('COMPLETE', { error: null });
              onShorten(url);
            }}
          />
        </Action>
      </Paper>
    );
  }
}

const stateChart = {
  initial: 'emptyForm',
  states: {
    emptyForm: {
      on: {
        SUBMIT: 'submitting'
      }
    },
    submitting: {
      on: {
        COMPLETE: 'emptyForm',
        SUBMIT: 'submitting'
      },
      onEntry: 'submit'
    }
  }
};

export default withStatechart(stateChart)(ShortenForm);

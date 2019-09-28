import React, { Component } from 'react';
import { initialState, getGameScore, setScore } from '../scoreboard';

class Scoreboard extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handleScore(playerNumber) {
    this.setState(setScore(playerNumber, this.state));
  }

  render() {
    return (
      <div>
        <h1>Tennis Scoreboard</h1>
        <h2 id="score">Score: {getGameScore(this.state).scoreCall}</h2>
        <button onClick={() => this.handleScore(1)} className="player1-scores" type="button">
          Player 1 scores
        </button>
        <button onClick={() => this.handleScore(2)} className="player2-scores" type="button">
          Player 2 scores
        </button>
      </div>
    );
  }
}

export default Scoreboard;

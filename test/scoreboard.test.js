import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { initialState, getGameScore, setScore } from '../src/scoreboard';
import Scoreboard from '../src/components/Scoreboard';

configure({ adapter: new Adapter() });

describe('initialState', () => {
  context('gamePoints', () => {
    it('each player starts with 0 points', () => {
      expect(initialState.gamePoints.player1).to.equal(0);
      expect(initialState.gamePoints.player2).to.equal(0);
    });
  });
});

describe('getGameScore', () => {
  it('love-all', () => {
    const state = {
      gamePoints: { player1: 0, player2: 0 },
      gameState: {
        state: 'PLAYING',
        advantage: null,
        winningPlayer: null,
      },
    };

    const gameScore = getGameScore(state);

    expect(gameScore.scoreCall).to.equal('love-all');
  });

  it('15-love', () => {
    const state = {
      gamePoints: { player1: 1, player2: 0 },
      gameState: {
        state: 'PLAYING',
        advantage: null,
        winningPlayer: null,
      },
    };

    const gameScore = getGameScore(state);

    expect(gameScore.scoreCall).to.equal('15-love', 'Implement player scored logic');
  });

  it('Game, player1 (after 40-0)', () => {
    const state = {
      gamePoints: { player1: 4, player2: 0 },
      gameState: {
        state: 'WON',
        advantage: null,
        winningPlayer: 'player1',
      },
    };

    const { scoreCall, winningPlayer } = getGameScore(state);

    expect(scoreCall).to.equal('Game, player1', 'Implement player win logic after 40-0');
    expect(winningPlayer).to.equal('player1', 'Implement player win logic after 40-0');
  });
});

describe('setScore', () => {
  it('Player 1 scores a point', () => {
    let state = initialState;

    state = setScore(1, state);

    expect(state.gamePoints.player1).to.equal(1);
    expect(state.gamePoints.player2).to.equal(0);
  });

  it('Player 1 wins game', () => {
    let state = initialState;

    state = setScore(1, state); // 15 - 0
    state = setScore(1, state); // 30 - 0
    state = setScore(1, state); // 40 - 0
    state = setScore(1, state); // Game

    expect(state.gamePoints.player1).to.equal(4);
    expect(state.gamePoints.player2).to.equal(0);
  });

  it('Players deuce', () => {
    let state = initialState;

    state = setScore(1, state); // 15 - 0
    state = setScore(1, state); // 30 - 0
    state = setScore(1, state); // 40 - 0
    state = setScore(2, state); // 40 - 15
    state = setScore(2, state); // 40 - 30
    state = setScore(2, state); // 40 - 40 (Deuce)

    expect(state.gamePoints.player1).to.equal(3);
    expect(state.gamePoints.player2).to.equal(3);
  });

  it('Player 1 advantage', () => {
    let state = initialState;

    state = setScore(1, state); // 15 - 0
    state = setScore(1, state); // 30 - 0
    state = setScore(1, state); // 40 - 0
    state = setScore(2, state); // 40 - 15
    state = setScore(2, state); // 40 - 30
    state = setScore(2, state); // 40 - 40 (Deuce)
    state = setScore(1, state); // AD - 40

    expect(state.gamePoints.player1).to.equal(4);
    expect(state.gamePoints.player2).to.equal(3);
  });

  it('Players double deuce', () => {
    let state = initialState;

    state = setScore(1, state); // 15 - 0
    state = setScore(1, state); // 30 - 0
    state = setScore(1, state); // 40 - 0
    state = setScore(2, state); // 40 - 15
    state = setScore(2, state); // 40 - 30
    state = setScore(2, state); // 40 - 40 (Deuce)
    state = setScore(1, state); // AD - 40
    state = setScore(2, state); // 40 - 40 (Deuce)

    expect(state.gamePoints.player1).to.equal(3, 'Implement deuce logic');
    expect(state.gamePoints.player2).to.equal(3, 'Implement deuce logic');
  });
});

describe('<Scoreboard />', () => {
  it('love-all', () => {
    const wrapper = shallow(<Scoreboard />);

    expect(wrapper.find('h2#score').text()).to.equal('Score: love-all');
  });

  it('15-love', () => {
    const wrapper = shallow(<Scoreboard />);

    wrapper.find('button.player1-scores').simulate('click');

    expect(wrapper.find('h2#score').text()).to.equal(
      'Score: 15-love',
      'Implement game scoring UI interaction',
    );
  });
});

const GAME_STATES = {
  PLAYING: 'PLAYING',
  DEUCE: 'DEUCE',
  WON: 'WON',
};

export const initialState = {
  gamePoints: {
    player1: 0,
    player2: 0,
  },
  gameState: {
    state: GAME_STATES.PLAYING,
    advantage: null,
    winningPlayer: null,
  },
};

const scores = [0, 15, 30, 40];

function getScore(points) {
  return scores[points];
}

function getOpponent(playerNumber) {
  return `player${playerNumber === 1 ? 2 : 1}`;
}

function getPlayingGameState(playerNumber, prevState) {
  const { gamePoints } = prevState;
  const player = `player${playerNumber}`;
  const currScore = getScore(gamePoints[player]);
  const nextPoints = getScore(gamePoints[player] + 1);
  const opponent = getOpponent(playerNumber);
  const opponentScore = getScore(gamePoints[opponent]);

  if (currScore === 40 && opponentScore < 40) {
    return {
      state: GAME_STATES.WON,
      advantage: null,
      winningPlayer: player,
    };
  }

  if (nextPoints === 40 && opponentScore === 40) {
    return {
      state: GAME_STATES.DEUCE,
      advantage: null,
      winningPlayer: null,
    };
  }

  return prevState.gameState;
}

function getDeuceGameState(playerNumber, prevState) {
  const currAdvantage = prevState.gameState.advantage;
  const player = `player${playerNumber}`;

  if (currAdvantage === null) {
    return {
      state: GAME_STATES.DEUCE,
      advantage: player,
      winningPlayer: null,
    };
  } else if (currAdvantage === player) {
    return {
      state: GAME_STATES.WON,
      advantage: null,
      winningPlayer: player,
    };
  } else {
    // The opponent had the advantage
    return {
      state: GAME_STATES.DEUCE,
      advantage: null,
      winningPlayer: null,
    };
  }
}

export function setScore(playerNumber, prevState) {
  const { gamePoints: prevGamePoints, gameState: prevGameState } = prevState;
  const player = `player${playerNumber}`;

  switch (prevGameState.state) {
    case GAME_STATES.PLAYING: {
      const gameState = getPlayingGameState(playerNumber, prevState);
      return {
        gamePoints: Object.assign({}, prevGamePoints, {
          [player]: prevGamePoints[player] + 1,
        }),
        gameState,
      };
    }
    case GAME_STATES.DEUCE: {
      const gameState = getDeuceGameState(playerNumber, prevState);

      return {
        gamePoints: Object.assign({}, prevGamePoints, {
          player1:
            gameState.advantage === 'player1' || gameState.winningPlayer === 'player1' ? 4 : 3,
          player2:
            gameState.advantage === 'player2' || gameState.winningPlayer === 'player2' ? 4 : 3,
        }),
        gameState,
      };
    }
    case GAME_STATES.WON: {
      return prevState;
    }
    default:
      // I miss you TypeScript
      console.error(`Unknown game state ${prevGameState.state}`);
      return prevState;
  }
}

function getPointsName(points) {
  return points === 0 ? 'love' : String(getScore(points));
}

export function getGameScore(state) {
  const { gamePoints, gameState } = state;
  const { player1, player2 } = gamePoints;

  let scoreCall = '';

  if (player1 === player2) scoreCall = `${getPointsName(player1)}-all`;
  else if (gameState.advantage !== null) scoreCall = `Advantage, ${gameState.advantage}`;
  else if (gameState.state === GAME_STATES.WON) scoreCall = `Game, ${gameState.winningPlayer}`;
  else scoreCall = `${getPointsName(player1)}-${getPointsName(player2)}`;

  return {
    scoreCall,
    winningPlayer: gameState.winningPlayer,
  };
}

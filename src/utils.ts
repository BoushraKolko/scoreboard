import { Game } from "./Game";
import { ScoreBoard } from "./ScoreBoard";

export const YesArray = ["y", "yes", ""];
export const QuitArray = ["q", "quit"];

export const getFormattedGames = (): Array<string> => {
  const data: Array<Game> = ScoreBoard.getGames();
  return formatGames(data);
};

export const sortGames = (games: Array<Game>): Array<Game> => {
  return games.sort((firstGame, secondGame) => {
    if (
      secondGame.score[secondGame.homeTeam.name] +
        secondGame.score[secondGame.awayTeam.name] -
        firstGame.score[firstGame.homeTeam.name] -
        firstGame.score[firstGame.awayTeam.name] ===
      0
    ) {
      return secondGame.startDate - firstGame.startDate;
    }
    return (
      secondGame.score[secondGame.homeTeam.name] +
      secondGame.score[secondGame.awayTeam.name] -
      firstGame.score[firstGame.homeTeam.name] -
      firstGame.score[firstGame.awayTeam.name]
    );
  });
};

export const printGames = (games: Array<string>): void => {
  let i = 1;
  games.forEach((game) => {
    console.log(`${i}   ${game} `);
    i++;
  });
};

export const printSummary = (games: Array<Game>): void => {
  games.forEach((game, index) =>
    console.log(
      `${index + 1} . ${game.homeTeam.name} ${
        game.score[game.homeTeam.name]
      } -  ${game.awayTeam.name} ${game.score[game.awayTeam.name]}`
    )
  );
};

const formatGames = (games: Array<Game>): Array<string> => {
  return games.map((game: Game) => {
    return `${game.homeTeam.name} - ${game.awayTeam.name}: ${
      game.score[game.homeTeam.name]
    } - ${game.score[game.awayTeam.name]}`;
  });
};

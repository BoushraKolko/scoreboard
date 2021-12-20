import { Team } from "./Team";
import prompt from "prompt-sync";
import { Game } from "./Game";
import {
  getGames,
  printGames,
  printSummary,
  QuitArray,
  YesArray,
} from "./utils";
import { ScoreBoard } from "./ScoreBoard";

const readLine: prompt.Prompt = prompt({ sigint: true });
export const main = (): void => {
  let play = true;
  while (play) {
    const command = readLine(
      "What do you want to do:  s: start a game, f: finish a game, u: update a game, sum: show summary, q:quit "
    );

    switch (command.toLowerCase()) {
      case "s" || "start": {
        startGame();
        break;
      }

      case "f" || "finish": {
        const chosenGame = getChosenGame();
        if (chosenGame) chosenGame.finish();

        break;
      }

      case "u" || "update": {
        const chosenGame = getChosenGame();
        if (chosenGame) {
          const homeTeamScore = parseInt(
            readLine(`Enter the score of ${chosenGame.homeTeam.name}: `)
          );
          const awayTeamScore = parseInt(
            readLine(`Enter the score of ${chosenGame.awayTeam.name}: `)
          );
          let score: Record<string, number> = {};
          score[chosenGame.homeTeam.name] = homeTeamScore;
          score[chosenGame.awayTeam.name] = awayTeamScore;
          chosenGame.update(score);
        }
        break;
      }

      case "sum" || "summary": {
        const formattedGames = Game.getSummary();
        if (formattedGames && formattedGames?.length > 0) {
          printSummary(formattedGames);
          break;
        }
        console.log("No game has started yet!");

        break;
      }

      case "q" || "quit": {
        play = false;
        console.log("Thank you for using our product!");
        break;
      }
    }
  }
};

const startGame = (): void => {
  let [cont, startGame, homeTeam, awayTeam] = [true, true, "", ""];
  while (cont) {
    homeTeam = readLine("Enter home team name: ");
    if (homeTeam === "") continue;
    awayTeam = readLine("Enter away team name: ");
    if (awayTeam === "") continue;
    const startingGame = readLine(
      `Starting a game between ${homeTeam} and ${awayTeam}, (Y, n) q to quit `
    )
      .toLowerCase()
      .trim();
    cont = !YesArray.includes(startingGame);
    if (QuitArray.includes(startingGame)) {
      startGame = false;
      break;
    }
  }
  if (startGame) {
    const game = new Game(new Team(homeTeam), new Team(awayTeam));
    console.log(game.start());
  }
};

const getChosenGame = (): Game | undefined => {
  const games: Array<string> = getGames();

  if (games.length === 0) {
    console.log("No game has started yet!");
    return;
  }
  printGames(games);
  const int = parseInt(readLine("Enter the game number: ")) - 1;
  if (Number.isNaN(int) || int < 0 || int > games.length) {
    console.log("You didn't enter a valid number, exiting...");
    return;
  }
  return ScoreBoard.getGames()[int];
};

main();

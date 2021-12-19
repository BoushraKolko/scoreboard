import { Team } from "./Team";
import prompt from "prompt-sync";
import { Game } from "./Game";
import { getGames } from "./utils";

const readLine = prompt({ sigint: true });

let play = true;
while (play) {
  const command = readLine(
    "What do you want to do:  s: start a game, f: finish a game, u: update a game, sum: show summary, q:quit "
  );
  switch (command.toLowerCase()) {
    case "s" || "start": {
      let cont = true;
      let startGame = true;
      let homeTeam = "";
      let awayTeam = "";
      while (cont) {
        homeTeam = readLine("Enter home team name: ");
        if (homeTeam === "") continue;
        if (homeTeam.includes("-")) {
          console.log("Please avoid using '-' when naming teams");
          continue;
        }
        awayTeam = readLine("Enter away team name: ");
        if (awayTeam === "") continue;
        if (awayTeam.includes("-")) {
          console.log("Please avoid using '-' when naming teams");
          continue;
        }
        const x = readLine(
          `Starting a game between ${homeTeam} and ${awayTeam}, (Y, n) q to quit `
        )
          .toLowerCase()
          .trim();
        cont = !["y", "yes", ""].includes(x);
        if (["q", "quit"].includes(x)) {
          startGame = false;
          break;
        }
      }
      if (startGame) {
        const game = new Game(new Team(homeTeam), new Team(awayTeam));
        console.log(game.start());
      }
      break;
    }

    case "f" || "finish": {
      const games: Array<string> = getGames();
      if (games.length === 0) {
        console.log("No game has started yet!");
        break;
      }
      let i = 1;
      games.forEach((game) => {
        console.log(`${i}   ${game} `);
        i++;
      });
      const int = parseInt(readLine("Enter the game number: ")) - 1;
      if (Number.isNaN(int) || int < 0 || int > games.length) {
        console.log("You didn't enter a valid number, exiting...");
        break;
      }
      const teamNames = games[int].split(":")[0];
      const homeTeam = teamNames.split("-")[0].trim();
      const awayTeam = teamNames.split("-")[1].trim();

      const game = new Game(new Team(homeTeam), new Team(awayTeam));
      game.finish();
      break;
    }
    case "u" || "update": {
      const games: Array<string> = getGames();
      if (games.length === 0) {
        console.log("No game has started yet!");
        break;
      }
      let i = 1;
      games.forEach((game) => {
        console.log(`${i}   ${game} `);
        i++;
      });
      const int = parseInt(readLine("Enter the game number: ")) - 1;
      if (Number.isNaN(int) || int < 0 || int > games.length) {
        console.log("You didn't enter a valid number, exiting...");
        break;
      }

      const teamNames = games[int].split(":")[0];
      const homeTeam = teamNames.split("-")[0].trim();
      const awayTeam = teamNames.split("-")[1].trim();
      const homeTeamScore = parseInt(
        readLine(`Enter the score of ${homeTeam}: `)
      );
      const awayTeamScore = parseInt(
        readLine(`Enter the score of ${awayTeam}: `)
      );
      let score: Record<string, number> = {};
      score[homeTeam] = homeTeamScore;
      score[awayTeam] = awayTeamScore;
      const game = new Game(new Team(homeTeam), new Team(awayTeam));
      game.update(score);

      break;
    }
    case "sum" || "summary": {
      const formattedGames = Game.getSummary();
      if (formattedGames.length === 0) {
        console.log("No game has started yet!");
        break;
      }
      formattedGames.forEach((game, index) =>
        console.log(
          `${index} . ${game.homeTeam.name} ${
            game.score[game.homeTeam.name]
          } -  ${game.awayTeam.name} ${game.score[game.awayTeam.name]}`
        )
      );
      break;
    }
    case "q": {
      play = false;
      break;
    }
  }
}

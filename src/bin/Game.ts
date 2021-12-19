import fs from "fs";
import { Team } from "./Team";
import { GameInterface } from "./interfaces";
export class Game {
  private homeTeam: Team;
  private awayTeam: Team;
  private score: Record<string, number> = {};
  private startDate: number;
  private updatedDate: number;

  constructor(homeTeam: Team, awayTeam: Team) {
    this.awayTeam = awayTeam;
    this.homeTeam = homeTeam;
    this.score[homeTeam.name] = 0;
    this.score[awayTeam.name] = 0;
    this.startDate = Date.now();
    this.updatedDate = Date.now();
  }

  public start() {
    //move all interaction with the json file(DB) to a seperate class
    const games: Array<GameInterface> = JSON.parse(
      fs.readFileSync(`${__dirname}/data/games.json`, "utf-8")
    );
    const existingGame = games.find(
      (game) =>
        game.awayTeam.name === this.awayTeam.name &&
        game.homeTeam.name === this.homeTeam.name
    );
    if (existingGame) return "A game with the same teams is already running";
    games.push({
      score: this.score,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      startDate: this.startDate,
      updatedDate: this.updatedDate,
    });
    //  todo try catch
    fs.writeFileSync(`${__dirname}/data/games.json`, JSON.stringify(games));
    return "Game started successfully";
  }

  public finish() {
    let games: Array<GameInterface> = JSON.parse(
      fs.readFileSync(`${__dirname}/data/games.json`, "utf-8")
    );
    games = games.filter(
      (game) =>
        !(
          game.awayTeam.name === this.awayTeam.name &&
          game.homeTeam.name === this.homeTeam.name
        )
    );
    fs.writeFileSync(`${__dirname}/data/games.json`, JSON.stringify(games));
    console.log(
      `Game between ${this.homeTeam.name} and ${this.awayTeam.name} finished`
    );
    return games;
  }

  public update(newScore: Record<string, number>) {
    let games: Array<GameInterface> = JSON.parse(
      fs.readFileSync(`${__dirname}/data/games.json`, "utf-8")
    );
    const game = games.find(
      (game) =>
        game.awayTeam.name === this.awayTeam.name &&
        game.homeTeam.name === this.homeTeam.name
    );
    //Todo remove this
    games = this.finish();
    if (game) {
      game.score = newScore;
      game.updatedDate = Date.now();
      games.push(game);
    }
    fs.writeFileSync(`${__dirname}/data/games.json`, JSON.stringify(games));
  }

  public static getSummary() {
    let games: Array<GameInterface> = JSON.parse(
      fs.readFileSync(`${__dirname}/data/games.json`, "utf-8")
    );
    games.sort((firstGame, secondGame) => {
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

    return games;
  }
}

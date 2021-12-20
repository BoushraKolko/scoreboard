import { Team } from "./Team";
import { ScoreBoard } from "./ScoreBoard";
import { sortGames } from "./utils";
export class Game {
  homeTeam: Team;
  awayTeam: Team;
  score: Record<string, number> = {};
  startDate: number;
  updatedDate: number;

  constructor(homeTeam: Team, awayTeam: Team) {
    this.awayTeam = awayTeam;
    this.homeTeam = homeTeam;
    this.score[homeTeam.name] = 0;
    this.score[awayTeam.name] = 0;
    this.startDate = Date.now();
    this.updatedDate = Date.now();
  }

  public start(): string {
    const games: Array<Game> = ScoreBoard.getGames();
    const existingGame = games.find(
      (game) =>
        game.awayTeam.name === this.awayTeam.name &&
        game.homeTeam.name === this.homeTeam.name
    );

    if (existingGame) return "A game with the same teams is already running";
    games.push(this);
    ScoreBoard.setGames(games);
    return "Game started successfully";
  }

  public finish(): Array<Game> {
    const games: Array<Game> = ScoreBoard.getGames();
    games.splice(games.indexOf(this), 1);
    ScoreBoard.setGames(games);
    console.log(
      `Game between ${this.homeTeam.name} and ${this.awayTeam.name} finished`
    );
    return games;
  }

  public update(newScore: Record<string, number>): void {
    this.updatedDate = Date.now();
    this.score = newScore;
  }

  public static getSummary(): Array<Game> {
    const games: Array<Game> = ScoreBoard.getGames();
    return sortGames(games);
  }
}

import { Game } from "./Game";

export class ScoreBoard {
  private static games: Array<Game> = [];
  public static getGames(): Array<Game> {
    return this.games;
  }

  public static setGames(games: Array<Game>): void {
    this.games = games;
  }
}

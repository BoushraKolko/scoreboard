import { Team } from "./Team";

export interface GameInterface {
  homeTeam: Team;
  awayTeam: Team;
  score: Record<string, number>;
  startDate: number;
  updatedDate: number;
}

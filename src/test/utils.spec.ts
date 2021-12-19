import fs from "fs";
import { mocked } from "jest-mock";
import { Game } from "../bin/Game";
import { Team } from "../bin/Team";
import { getGames } from "../bin/utils";
jest.mock("fs");

describe("utils", () => {
  const mockedGamesData = `[{"score":{"team1":0,"team2":0},"homeTeam":{"name":"team1"},"awayTeam":{"name":"team2"},"startDate":1639911696037,"updatedDate":1639911696037}]`;

  it("should format returned games", () => {
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    const result = getGames();
    expect(result).toEqual(["team1 - team2: 0 - 0"]);
  });
});

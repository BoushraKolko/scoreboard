import fs from "fs";
import { mocked } from "jest-mock";
import { Game } from "../bin/Game";
import { Team } from "../bin/Team";
jest.mock("fs");

describe("Game logic", () => {
  const mockedoriginalGamesData = `[{"score":{"team1":0,"team2":0},"homeTeam":{"name":"team1"},"awayTeam":{"name":"team2"},"startDate":1639911696037,"updatedDate":1639911696037}]`;
  let mockedGamesData = `[{"score":{"team1":0,"team2":0},"homeTeam":{"name":"team1"},"awayTeam":{"name":"team2"},"startDate":1639911696037,"updatedDate":1639911696037}]`;

  it("should start a game successfully", () => {
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    const game = new Game(new Team("team3"), new Team("team4"));
    const newGameData = `{"score":{"team3":0,"team4":0},"homeTeam":{"name":"team3"},
    "awayTeam":{"name":"team4"},"startDate":${Date.now()},"updatedDate":${Date.now()}}`;
    mocked(fs.writeFileSync).mockImplementationOnce(() => {
      mockedGamesData = mockedGamesData
        .substr(0, mockedGamesData.length - 1)
        .concat(",", newGameData, "]");
    });
    const result = game.start();
    expect(result).toMatch("Game started successfully");
  });

  it("should return that a game with these teams is already running", () => {
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    const game = new Game(new Team("team1"), new Team("team2"));
    const result = game.start();
    expect(result).toMatch("A game with the same teams is already running");
  });

  it("should finish a game successfully", () => {
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    mocked(fs.writeFileSync).mockImplementationOnce(() => {
      mockedGamesData = mockedoriginalGamesData;
    });
    const game = new Game(new Team("team3"), new Team("team4"));
    const result = game.finish();
    expect(JSON.stringify(result)).toMatch(mockedoriginalGamesData);
  });

  it("should update a game successfully", () => {
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    const game = new Game(new Team("team1"), new Team("team2"));
    game.update({ team1: 1, team2: 0 } as Record<string, number>);
    expect(mocked(fs.writeFileSync)).toBeCalled();
  });

  it("should get the summary of games", () => {
    const expectedSummary =
      `[{"score":{"team3":0,"team4":0},"homeTeam":{"name":"team3"},"awayTeam":{"name":"team4"},"startDate":${Date.now()},"updatedDate":${Date.now()}},`.concat(
        mockedGamesData.substring(1)
      );
    mockedGamesData = mockedGamesData
      .substr(0, mockedGamesData.length - 1)
      .concat(
        ",",
        `{"score":{"team3":0,"team4":0},"homeTeam":{"name":"team3"},
    "awayTeam":{"name":"team4"},"startDate":${Date.now()},"updatedDate":${Date.now()}}`,
        "]"
      );
    mocked(fs.readFileSync).mockReturnValue(mockedGamesData);
    const result = Game.getSummary();
    expect(JSON.stringify(result)).toEqual(expectedSummary);
  });
});

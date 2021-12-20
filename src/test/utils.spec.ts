import { mocked } from "jest-mock";
import {
  getFormattedGames,
  printGames,
  printSummary,
  sortGames,
} from "../utils";
import { ScoreBoard } from "../ScoreBoard";
import { Game } from "../Game";
jest.mock("../ScoreBoard");
global.console.log = jest.fn();
describe("utils", () => {
  const mockedGames = [
    {
      score: { team1: 0, team2: 0 },
      homeTeam: { name: "team1" },
      awayTeam: { name: "team2" },
      startDate: 1639911696037,
      updatedDate: 1639911696037,
    },
  ] as unknown as Array<Game>;
  beforeEach(() => {
    mocked(console.log).mockClear();
  });
  it("should format returned games", () => {
    mocked(ScoreBoard.getGames).mockReturnValue(mockedGames);
    const result = getFormattedGames();
    expect(result).toEqual(["team1 - team2: 0 - 0"]);
  });

  it("should sort the running games", () => {
    const mockedGames = [
      {
        score: { team1: 0, team2: 0 },
        homeTeam: { name: "team1" },
        awayTeam: { name: "team2" },
        startDate: 1639911696037,
        updatedDate: 1639911696037,
      },
      {
        score: { team3: 2, team4: 0 },
        homeTeam: { name: "team3" },
        awayTeam: { name: "team4" },
        startDate: 1639911697037,
        updatedDate: 1639911697037,
      },
    ] as unknown as Array<Game>;

    const expectedResult = [
      {
        score: { team3: 2, team4: 0 },
        homeTeam: { name: "team3" },
        awayTeam: { name: "team4" },
        startDate: 1639911697037,
        updatedDate: 1639911697037,
      },
      {
        score: { team1: 0, team2: 0 },
        homeTeam: { name: "team1" },
        awayTeam: { name: "team2" },
        startDate: 1639911696037,
        updatedDate: 1639911696037,
      },
    ];

    const result = sortGames(mockedGames);
    expect(result).toEqual(expectedResult);
  });

  it("should sort games of the same score sum", () => {
    const mockedGames = [
      {
        score: { team1: 0, team2: 2 },
        homeTeam: { name: "team1" },
        awayTeam: { name: "team2" },
        startDate: 1639911696037,
        updatedDate: 1639911696037,
      },
      {
        score: { team3: 2, team4: 0 },
        homeTeam: { name: "team3" },
        awayTeam: { name: "team4" },
        startDate: 1639911697037,
        updatedDate: 1639911697037,
      },
    ] as unknown as Array<Game>;
    const expectedResult = [
      {
        score: { team3: 2, team4: 0 },
        homeTeam: { name: "team3" },
        awayTeam: { name: "team4" },
        startDate: 1639911697037,
        updatedDate: 1639911697037,
      },
      {
        score: { team1: 0, team2: 2 },
        homeTeam: { name: "team1" },
        awayTeam: { name: "team2" },
        startDate: 1639911696037,
        updatedDate: 1639911696037,
      },
    ];

    const result = sortGames(mockedGames);
    expect(result).toEqual(expectedResult);
  });

  it("should print games", () => {
    printGames(mockedGames.map((game) => JSON.stringify(game)));
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith(
      '1   {"score":{"team1":0,"team2":0},"homeTeam":{"name":"team1"},"awayTeam":{"name":"team2"},"startDate":1639911696037,"updatedDate":1639911696037} '
    );
  });

  it("should print summary of games", () => {
    printSummary(mockedGames);
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith("1 . team1 0 -  team2 0");
  });
});

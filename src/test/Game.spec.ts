import { mocked } from "jest-mock";
import { Game } from "../Game";
import { ScoreBoard } from "../ScoreBoard";
import { Team } from "../Team";
jest.mock("../ScoreBoard");
describe("Game logic", () => {
  const mockedGames = [
    {
      score: { team1: 0, team2: 0 },
      homeTeam: { name: "team1" },
      awayTeam: { name: "team2" },
      startDate: 1639911696037,
      updatedDate: 1639911696037,
      finish: jest.fn(() => {
        const games: Array<Game> = ScoreBoard.getGames();
        games.splice(0, 1);
        ScoreBoard.setGames(games);
        console.log(`Game between team1 and team2 finished`);
        return games;
      }),
      update: jest.fn((newScore) => {
        mockedGames[0].score = newScore;
      }),
    },
  ] as unknown as Array<Game>;

  beforeEach(() => {
    mocked(ScoreBoard.getGames).mockReturnValue(mockedGames);
    mocked(ScoreBoard.setGames).mockImplementation(() => {});
    mocked(ScoreBoard.setGames).mockReset();
  });
  it("should start a game successfully", () => {
    const game = new Game(new Team("team3"), new Team("team4"));
    const result = game.start();
    expect(result).toMatch("Game started successfully");
    expect(ScoreBoard.getGames).toBeCalled();
    expect(ScoreBoard.setGames).toBeCalled();
  });

  it("should return that a game with these teams is already running", () => {
    const game = new Game(new Team("team1"), new Team("team2"));
    const result = game.start();
    expect(result).toMatch("A game with the same teams is already running");
    expect(ScoreBoard.getGames).toBeCalled();
    expect(ScoreBoard.setGames).not.toBeCalled();
  });

  it("should finish a game successfully", () => {
    mockedGames[0].finish();
    expect(ScoreBoard.getGames).toBeCalled();
    expect(ScoreBoard.setGames).toBeCalled();
  });

  it("should update a game successfully", () => {
    mockedGames[0].update({ team1: 1, team2: 0 } as Record<string, number>);
    expect(mockedGames[0].score).toEqual({ team1: 1, team2: 0 } as Record<
      string,
      number
    >);
  });

  it("should get the summary of games", () => {
    mocked(ScoreBoard.getGames).mockReturnValue([
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
    ] as unknown as Array<Game>);
    const expectedSummary = [
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

    const result = Game.getSummary();
    expect(ScoreBoard.getGames).toBeCalled();
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedSummary));
  });
});

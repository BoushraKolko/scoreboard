import { GameInterface } from "./interfaces";
import fs from "fs";

export const getGames = () => {
  const data: Array<GameInterface> = JSON.parse(
    fs.readFileSync(`${__dirname}/data/games.json`, "utf-8")
  );
  const mappedData = formatGames(data);
  return mappedData;
};

const formatGames = (games: GameInterface[]) => {
  return games.map((game: GameInterface) => {
    return `${game.homeTeam.name} - ${game.awayTeam.name}: ${
      game.score[game.homeTeam.name]
    } - ${game.score[game.awayTeam.name]}`;
  });
};

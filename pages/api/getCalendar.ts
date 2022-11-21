import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { parseMatches } from "../../utils/parseMatches";

type Data = {
  id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url =
    "https://app.sportdataapi.com/api/v1/soccer/matches?apikey=9245d6e0-6434-11ed-a8a5-63b79274d72f&season_id=3072";
  const result = await axios.get(url);

  let headersList = {
    Accept: "*/*",
    "X-Auth-Token": "e9455102ee1341c28b0eba756a3831c5",
  };

  let reqOptions = {
    url: "https://api.football-data.org/v4/competitions/2000/matches?season=2022",
    method: "GET",
    headers: headersList,
  };

  let response = await axios.request(reqOptions);
  console.log("AAAAAAAAAAAAAA", Object.keys(response.data));

  const updatedResult = parseMatches(response.data)

  res.status(200).json(updatedResult);
}

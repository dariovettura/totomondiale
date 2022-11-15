import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  id?:number
}

export default  async   function handler(
  
  req:NextApiRequest,
  res: NextApiResponse
) { 

  const url =
  'https://app.sportdataapi.com/api/v1/soccer/matches?apikey=9245d6e0-6434-11ed-a8a5-63b79274d72f&season_id=3072'

  const result = await  axios.get(url);
res.status(200).json(result.data) 

}

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

// type Data = {
//   data?:any
// }

export default  async   function handler(
  
  req:NextApiRequest,
  res: NextApiResponse
) { 
  const CK = "ck_c6180d6359806585390a5b0fbaa4bf95200cb467";
  const CS = "cs_3d1ee5ffdd87b0ee55ff646aa3ff39ffe105f1c4";
  const url =
  `https://portfoli.altervista.org/wp-json/wc/v2/orders/?consumer_key=` +
  CK +
  "&consumer_secret=" +
  CS;



  const result = await 



//   req.body.data.line_items.map((el: { product_id: any; })=>
//     axios.get(
//         `https://portfoli.altervista.org/wp-json/wc/v2/products/${el.product_id}?consumer_key=` +
//         CK +
//         "&consumer_secret=" +
//         CS ) )
  
  axios.post(url,req.body.data);
res.status(200).json(result.data) 

}

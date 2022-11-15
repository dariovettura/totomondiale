
import { Divider } from '@mui/material'
import axios from 'axios'

import { GetStaticPaths, GetStaticPropsResult, NextPage } from 'next'
import { imageOptimizer } from 'next/dist/server/image-optimizer'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'


interface Props {

  posts?: any[],
  infos?: any[]

}

const Player: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter()
  const { id } = router.query


   const [item,setItem] = React.useState<any>([])
   const [name,setName] = React.useState<any>([])



  async function navigate() {
    router.push({
      pathname: "/",

    }, undefined, { scroll: false });
  }

  const getMyResults = () => {
    return axios.post("/api/getMyResults", { data: id }).then(
      res =>
        {console.log(res)
          setName(res.data.billing.first_name)
        setItem(JSON.parse(res.data.customer_note))}
    );}


  React.useEffect(() => {
   getMyResults()
  }, [])

 

  return<>
  <div className="root">
  <div style={{ marginTop: "60px", marginBottom: "60px", width: "100vw", height: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", justifyContent: "center" }}>
    <span style={{fontSize:"30px",fontWeight:"bold"}}>{name}</span>
    
{item.map((el: { home_team: { logo: string | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }; away_team: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; logo: string | undefined }; result: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined })=>
  <div style={{ display: "flex", flexDirection: "column" }}>
 
  <div>
    <img style={{ width: "30px", height: "30px" }} src={el?.home_team?.logo} alt="" /> {el?.home_team?.name} - {el?.away_team?.name} <img style={{ width: "30px", height: "30px" }} src={el?.away_team?.logo} alt="" /> 
    <span style={{fontSize:"30px",fontWeight:"bold",marginLeft:"20px"}}>{el.result}</span>
    
    </div>

</div>
  )
  
  }
 </div>
 
  </div>
  
 </> 
}
export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const infourl =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/informazioni?_embed&per_page=100";

  const url =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/posts?_embed&per_page=100";

  //const result = await Axios.get(url);
  //const menu =  result.data
  const infores = await fetch(infourl, { method: 'GET' });
  const res = await fetch(url, {
    method: 'GET',

    credentials: "same-origin", //include, same-origin
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
  });

  const posts = await res.json();
  const infos = await infores.json()

  //  const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
      infos

    },
    revalidate: 10,
  };
}
export default Player;
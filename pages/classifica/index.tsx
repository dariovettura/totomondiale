import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'antd/dist/antd.css';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from 'antd';
import { spawn } from 'child_process';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



export default function Classifica() {

  const [allPlayer, setAllPlayer] = React.useState<any[]>([])
  const [loader, setLoader] = useState<any>(false)

  const getClassifica = () => {
    setLoader(true)
    return axios.get("/api/getAllSchedine").then(

      res => { setAllPlayer(res.data) ;setLoader(false)}
    ).catch(err=>setLoader(false))
  }

  React.useEffect(() => {

    getClassifica()
  }, [])

  console.log()

  return (
    <>
     <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" /></Backdrop>
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", justifyContent: "center" ,marginTop:"20px",fontSize:"30px" }}>
      <span style={{fontSize:"30px",fontWeight:"bold"}}>Classifica</span>
      <span style={{fontSize:"15px",fontWeight:"bold" ,marginBottom:"40px"}}>Clicca sul nome per vedere la sua scedina</span>
        {allPlayer?.map((el,i) => {
          return <Link key={i} href={`/player/${+el.number}`}>
         
            {el.billing.first_name} = {JSON.parse(el?.customer_note)[0]?.totScore}

          </Link>
        })}

        {/* <Link href={"/insertResult"} >
          <Button >Inserisci la tua schedina</Button>
        </Link>
        <Link href={"/insertResult"}>
          <Button >I tuoi risultati</Button>
        </Link>
        <Link href={"/insertResult"}>
          <Button >Classifica</Button>
        </Link> */}
      </div>

    </>
  )
}

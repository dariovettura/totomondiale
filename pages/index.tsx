import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'antd/dist/antd.css';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from 'antd';



export default function Home() {


  return (
    <>
     <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",gap:20,alignItems:"center",justifyContent:"center"}}>
     <Link  href={"/insertResult"} >
               <Button >Inserisci la tua schedina</Button>
            </Link>
            <Link  href={"/insertResult"}>
            <Button >I tuoi risultati</Button>
            </Link>
            <Link   href={"/insertResult"}>
            <Button >Classifica</Button>
            </Link>
     </div>

    </>
  )
}

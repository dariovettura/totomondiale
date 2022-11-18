import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "antd/dist/antd.css";


import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>TOTOMONDIALE</h1>
        <p>Benvenuto ludopatico</p>

        <Link href={"/insertResult"}>
          <Button variant="contained" style={{ marginBottom: "20px", marginTop: "20px" }}>
            Inserisci la tua schedina
          </Button>
        </Link>

        <Link href={"/lemiescommesse"}>
          <Button variant="contained"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Le tue scommesse
          </Button>
        </Link>

        {/* <Link href={"/classifica"}>
          <Button style={{ marginBottom: "20px", marginTop: "20px" }}>
            Classifica
          </Button>
        </Link> */}
      </div>
    </>
  );
}

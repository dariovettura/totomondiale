import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ResultsArr from "../../calendar/fake_result";
import { parsePlayers } from "../../utils/parsePlayers";

export default function Classifica() {
  const [allPlayer, setAllPlayer] = React.useState<any[]>([]);
  const [loader, setLoader] = useState<any>(false);

  const players = parsePlayers(allPlayer, ResultsArr)
  
  function comparePlayers(a: any, b: any) {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    return 0;
  }

  const getClassifica = () => {
    setLoader(true);
    return axios
      .get("/api/getAllSchedine")
      .then((res) => {
        setAllPlayer(res.data);
        setLoader(false);
      })
      .catch((err) => setLoader(false));
  };

  React.useMemo(() => {
    getClassifica();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        style={{
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "40px",
          fontSize: "30px",
        }}
      >
        <span style={{ fontSize: "30px", fontWeight: "bold" }}>Classifica</span>
        <span
          style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "40px" }}
        >
          Clicca sul nome per vedere la sua schedina
        </span>
        {players.sort(comparePlayers)?.map((el: { id: string | number; name: any; score: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
          return (
            <Link key={i} href={`/player/${+el?.id}`}>
              {el.name || `Player${el.id}`} = {el.score}
            </Link>
          );
        })}
      </div>
    </>
  );
}

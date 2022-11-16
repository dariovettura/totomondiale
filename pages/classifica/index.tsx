import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "antd/dist/antd.css";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "antd";
import { spawn } from "child_process";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ResultsArr from "../../calendar/fake_result";

export default function Classifica() {
  const [allPlayer, setAllPlayer] = React.useState<any[]>([]);
  const [results, setResults] = React.useState<any[]>([]);
  const [loader, setLoader] = useState<any>(false);

  const getFinishedMatchs = (array: any[]) => {
    let finishedMatch = [];
    finishedMatch = array.filter((el) => el.status == "finished");
    return finishedMatch;
  };

  const getFinalResult = () => {
    const finishedMatchs = getFinishedMatchs(ResultsArr);
    if (finishedMatchs.length > 0)
      setResults(
        finishedMatchs.map((el) => {
          if (el.stats.home_score - el.stats.away_score > 0) {
            return { ...el, risultatoFinale: "1" };
          }
          if (el.stats.home_score - el.stats.away_score < 0) {
            return { ...el, risultatoFinale: "2" };
          }
          if (el.stats.home_score - el.stats.away_score == 0) {
            return { ...el, risultatoFinale: "x" };
          }
        })
      );
  };

  const getOurFinishedMatch = () => {
    var myMatch = allPlayer.map((el) =>
      JSON.parse(el?.customer_note).map((e: any) => {
        return { ...e, id: el.number, name: el.billing.first_name };
      })
    );
    var finishedMatch = getFinishedMatchs(ResultsArr);
    var filteredArray = myMatch.map((el: any) =>
      el.filter((els: any) => {
        return (
          finishedMatch.filter((anotherOne_el) => {
            return anotherOne_el.match_id == els.match_id;
          }).length !== 0
        );
      })
    );

    console.log({ filteredArray });
    return filteredArray;
  };

  function comparePlayers(a: any, b: any) {
    if(a.score > b.score) {
      return -1;
    }
    if(a.score < b.score) {
      return 1;
    }
    return 0;
  }

  const getChart = () => {
    let playersResults: any[] = [];
    const playedMatches = getOurFinishedMatch();
    const resultObject: any = {};
    results.forEach((el) => {
      resultObject[el.match_id] = el.risultatoFinale;
    });
    playedMatches.forEach((el) => {
      let player = {
        id: el[0].id,
        name: el[0].name,
        score: 0,
      };
      el.forEach((e: any) => {
        if (e.result == resultObject[e.match_id]) {
          player.score += 1;
        }
      });
      playersResults.push(player);

    });
    return playersResults.sort(comparePlayers);
  };

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
    console.log("init");
    getClassifica();
    getFinalResult();
  }, []);

  // React.useEffect(() => {
  //   if (allPlayer.length > 0) getFinalResuls();
  // }, [allPlayer]);

  React.useEffect(() => {
    console.log({ results });
  }, [results]);

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
        {getChart()?.map((el, i) => {
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

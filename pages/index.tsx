/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ResultsArr from "../calendar/fake_result";
import { parsePlayers } from "../utils/parsePlayers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, ButtonGroup } from "reactstrap";
import flags from "../flags/flags";
import Image from "next/image";

export default function Classifica() {
  const [allPlayer, setAllPlayer] = React.useState<any[]>([]);
  const [loader, setLoader] = useState<any>(false);
  const [results, setResults] = useState<any[]>([]);
  let lastPlayed = 2;
  results.forEach((r, i) => {
    if (r.status === "finished") {
      lastPlayed = i;
    }
  });
  const [visibleColumns, setVisibleColumns] = useState<any[]>([
    lastPlayed,
    lastPlayed + 1,
    lastPlayed + 2,
  ]);

  const players = parsePlayers(allPlayer, results);
  console.log("players", players);
  console.log("results", results);

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
        axios.post("/api/getMyResults", { data: 303 }).then((res) => {
          setResults(JSON.parse(res.data.customer_note));
        });
        setAllPlayer(
          res.data.filter((el: { number: string }) => el.number !== "303")
        );
        setLoader(false);
      })
      .catch((err) => setLoader(false));
  };

  // React.useEffect(() => {
  //   getClassifica();
  //   return;
  // }, []);

  const pageRef = React.useCallback((node: null) => {
    if (node !== null) getClassifica();
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
        ref={pageRef}
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
        <span
          style={{ fontSize: "30px", fontWeight: "bold", marginTop: "30px" }}
        >
          Classifica
        </span>
        <span
          style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "40px" }}
        >
          Clicca sul nome per vedere la sua schedina
        </span>
        <ButtonGroup>
          <Button
            disabled={visibleColumns.includes(0)}
            onClick={() => setVisibleColumns(visibleColumns.map((e) => e - 1))}
          >
            {" < "}
          </Button>
          <Button
            onClick={() => setVisibleColumns(visibleColumns.map((e) => e + 1))}
          >
            {" > "}
          </Button>
        </ButtonGroup>
        <Table size="sm" style={{ fontSize: "12px" }} responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              {visibleColumns.map((col) => {
                const homeTeamId = results[col]?.home_team?.team_id as string;
                const awayTeamId = results[col]?.away_team?.team_id as string;
                return (
                  <th key={col}>
                    <span>{results[col]?.home_team?.short_code}</span>
                    <img
                      style={{ width: "12px", height: "12px" }}
                      src={flags[homeTeamId as keyof typeof flags]}
                      alt="flag"
                    />
                    {results[col]?.away_team?.short_code}
                    <img
                      style={{ width: "12px", height: "12px" }}
                      src={flags[awayTeamId as keyof typeof flags]}
                      alt="flag"
                    />
                  </th>
                );
              })}
              {/* {results.map((r, i) => (
                <th
                  key={r.match_id}
                  className={visibleColumns.includes(i) ? "d-inline" : "d-none"}
                >
                  {r.home_team?.short_code}-{r.away_team?.short_code}
                </th>
              ))} */}
              <th>Punti</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 &&
              players.sort(comparePlayers)?.map((el: any, i: number) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td className="h6">
                      <Link href={`/player/${+el?.id}`}>
                        {el.name || `Player${el.id}`}
                      </Link>
                    </td>
                    {visibleColumns.map((col) => (
                      <td key={col}>
                        <span
                          className={`text-${
                            el?.groupsBetsResults[
                              Object.keys(el?.groupsBetsResults)[col]
                            ]
                          }`}
                        >
                          {el?.groupsBets[Object.keys(el?.groupsBets)[col]]}
                        </span>
                      </td>
                    ))}
                    {/* {Object.values(el.groupsBets).map((bet: any, i) => (
                      <td
                        key={i}
                        className={
                          visibleColumns.includes(i) ? "d-inline" : "d-none"
                        }
                      >
                        {bet}
                      </td>
                    ))} */}
                    <td>
                      <b>{el.score}</b>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        {/* { results.length > 0 &&
          players
            .sort(comparePlayers)
            ?.map(
              (
                el: {
                  id: string | number;
                  name: any;
                  score:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                i: React.Key | null | undefined
              ) => {
                return (
                  <div key={i} className="nomiClassifica">
                    <Link href={`/player/${+el?.id}`}>
                      {el.name || `Player${el.id}`} = {el.score}
                    </Link>
                  </div>
                );
              }
            )} */}
      </div>
    </>
  );
}

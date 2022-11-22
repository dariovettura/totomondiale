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

  const [visibleColumns, setVisibleColumns] = useState<any[]>([0, 1, 2]);

  const players = parsePlayers(allPlayer, results);
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
          const _results = JSON.parse(res.data.customer_note);
          setResults(_results);
          let lastPlayed = 2;
          _results.forEach((r: any, i: any) => {
            if (r.status === "finished") {
              lastPlayed = i;
            }
          });
          setVisibleColumns([lastPlayed, lastPlayed + 1, lastPlayed + 2]);
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
        <div
          style={{
            width: "100vw",
            marginBottom: "-5vw",
          }}
          className="d-flex justify-content-between"
        >
          <div className="">
            <Button
              disabled={visibleColumns.includes(0)}
              color="primary"
              onClick={() =>
                setVisibleColumns(visibleColumns.map((e) => e - 1))
              }
            >
              {" < "}
            </Button>
          </div>
          <div className="">
            <Button
              disabled={visibleColumns.includes(results?.length - 1)}
              color="primary"
              onClick={() =>
                setVisibleColumns(visibleColumns.map((e) => e + 1))
              }
            >
              {" > "}
            </Button>
          </div>
        </div>
        <Table size="sm" style={{ fontSize: "10px" }} responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              {visibleColumns.map((col) => {
                const homeTeamId = results[col]?.home_team?.team_id as string;
                const awayTeamId = results[col]?.away_team?.team_id as string;
                return (
                  <th key={col}>
                    <div>
                      <img
                        style={{ width: "10px", height: "10px" }}
                        src={flags[homeTeamId as keyof typeof flags]}
                        alt="flag"
                      />
                      <span>{results[col]?.home_team?.short_code}</span>
                    </div>
                    <div>
                      <img
                        style={{ width: "10px", height: "10px" }}
                        src={flags[awayTeamId as keyof typeof flags]}
                        alt="flag"
                      />
                      <span>{results[col]?.away_team?.short_code}</span>
                    </div>
                    <div>
                      {"("}
                      {results[col]?.status == "finished" && (
                        <b>{results[col]?.stats?.home_score}</b>
                      )}
                      {"-"}
                      {results[col]?.status == "finished" && (
                        <b>{results[col]?.stats?.away_score}</b>
                      )}
                      {")"}
                    </div>
                  </th>
                );
              })}
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
                      <Link href={`/player/${+el?.id}`} style={{textDecoration: "none"}}>
                        {el.name || `Player${el.id}`}
                      </Link>
                    </td>
                    {visibleColumns.map((col) => (
                      <td className="h6" key={col}>
                        <span
                          className={`text-${
                            el?.groupsBetsResults[
                              Object.keys(el?.groupsBetsResults)[col]
                            ]
                          } text-uppercase`}
                        >
                          {el?.groupsBets[Object.keys(el?.groupsBets)[col]]}
                        </span>
                      </td>
                    ))}
                    <td>
                      <b className="h5">{el.score}</b>
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

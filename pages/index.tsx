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
import { parseMatches } from "../utils/parseMatches";
import { parsePlayoffResults } from "../utils/parsePlayoffResults";

export default function Classifica() {
  const [allPlayer, setAllPlayer] = React.useState<any[]>([]);
  const [loader, setLoader] = useState<any>(false);
  const [results, setResults] = useState<any[]>([]);
  const [grResults, setGrResults] = useState<any[]>([]);
  const [poResults, setPoResults] = useState<any[]>([]);
  const colGroup: any = {
    48: "A",
    49: "B",
    50: "C",
    51: "D",
    52: "E",
    53: "F",
    54: "G",
    55: "H",
  };
  const GROUPS = 6;
  // round_ids
  const EIGHTS = 46854;
  const QUARTERS = 46850;
  const SEMIS = 46849;
  const THIRDS = 46848;
  const FINAL = 46852;
  // match id
  const WINNER = 429770;
  // id bomber
  const BOMBER = "bomber";

  const [visibleColumns, setVisibleColumns] = useState<any[]>([0, 1, 2]);

  const players = parsePlayers(allPlayer, results);

  console.log("players", players);

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
    /// rimuovi
    // const parsedMatches = parseMatches();
    // console.log("parsedMatches", parsedMatches);
    return axios
      .get("/api/getAllSchedine")
      .then((res) => {
        axios.post("/api/getMyResults", { data: 303 }).then((res) => {
          let _results = JSON.parse(res.data.customer_note); // parsedMatches; 
          setResults(_results);
          let _poResults: any = parsePlayoffResults(_results);
          setPoResults(_poResults);
          let _grResults: any = _results.slice(0, 48);
          setGrResults(_grResults);

          let lastPlayed = 2;
          _grResults.forEach((r: any, i: any) => {
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
              disabled={visibleColumns.includes(61)}
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
                if (col < 48) {
                  const homeTeamId = grResults[col]?.home_team
                    ?.team_id as string;
                  const awayTeamId = grResults[col]?.away_team
                    ?.team_id as string;
                  return (
                    <th key={col}>
                      <div>
                        <img
                          style={{ width: "10px", height: "10px" }}
                          src={flags[homeTeamId as keyof typeof flags]}
                          alt="flag"
                        />
                        <span>{grResults[col]?.home_team?.short_code}</span>
                      </div>
                      <div>
                        <img
                          style={{ width: "10px", height: "10px" }}
                          src={flags[awayTeamId as keyof typeof flags]}
                          alt="flag"
                        />
                        <span>{grResults[col]?.away_team?.short_code}</span>
                      </div>
                      <div>
                        {"("}
                        {grResults[col]?.status == "finished" && (
                          <b>{grResults[col]?.stats?.home_score}</b>
                        )}
                        {"-"}
                        {grResults[col]?.status == "finished" && (
                          <b>{grResults[col]?.stats?.away_score}</b>
                        )}
                        {")"}
                      </div>
                    </th>
                  );
                } else if (col >= 48 && col < 56) {
                  let colLetter: any = colGroup[col];
                  let groupColumn: any = poResults[colLetter];
                  console.log("groupColumn", groupColumn);
                  return (
                    <th key={col}>
                      <div>
                        <img
                          style={{ width: "16px", height: "16px" }}
                          src={flags[groupColumn[0] as keyof typeof flags]}
                          alt="flag"
                        />
                        {"-"}
                        <img
                          style={{ width: "16px", height: "16px" }}
                          src={flags[groupColumn[1] as keyof typeof flags]}
                          alt="flag"
                          className="ml-2"
                        />
                      </div>
                      <div>{"Group " + colLetter}</div>
                    </th>
                  );
                } else if (col === 56) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[QUARTERS].slice(0, 4).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "12px", height: "12px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>
                        {poResults[QUARTERS].slice(4, 8).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "12px", height: "12px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>{"Quarti"}</div>
                    </th>
                  );
                } else if (col === 57) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[SEMIS].slice(0, 2).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "14px", height: "14px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>
                        {poResults[SEMIS].slice(2, 4).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "14px", height: "14px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>{"Semi"}</div>
                    </th>
                  );
                } else if (col === 58) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[THIRDS].slice(0, 2).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "14px", height: "14px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>{"Terzo"}</div>
                    </th>
                  );
                } else if (col === 59) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[FINAL].slice(0, 2).map((tid: any) => (
                          <img
                            key={tid}
                            style={{ width: "14px", height: "14px" }}
                            src={flags[tid as keyof typeof flags]}
                            alt="flag"
                          />
                        ))}
                      </div>
                      <div>{"Finale"}</div>
                    </th>
                  );
                } else if (col === 60) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[WINNER] && (
                          <img
                            style={{ width: "18px", height: "18px" }}
                            src={flags[poResults[WINNER] as keyof typeof flags]}
                            alt="flag"
                          />
                        )}
                      </div>
                      <div>{"Winner"}</div>
                    </th>
                  );
                } else if (col === 61) {
                  return (
                    <th key={col}>
                      <div>
                        {poResults[BOMBER as keyof typeof poResults] && (
                          <img
                            style={{ width: "18px", height: "18px" }}
                            src={flags[poResults[BOMBER as keyof typeof poResults] as keyof typeof flags]}
                            alt="flag"
                          />
                        )}
                      </div>
                      <div>{"Bomber"}</div>
                    </th>
                  );
                }
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
                      <Link
                        href={`/player/${+el?.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {el.name || `Player${el.id}`}
                      </Link>
                    </td>
                    {visibleColumns.map((col) => {
                      if (col < 48) {
                        return (
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
                        );
                      } else if (col >= 48 && col < 56) {
                        let colLetter: any = colGroup[col];
                        let groupColumn: any = el?.gironi[colLetter];
                        let groupPoints: any = el?.gironiResults[colLetter];
                        return (
                          <td className="h6" key={col}>
                            <div>{groupPoints || 0}</div>
                            <div>
                              {groupColumn[0] && (
                                <img
                                  style={{ width: "16px", height: "16px" }}
                                  src={
                                    flags[groupColumn[0] as keyof typeof flags]
                                  }
                                  alt="flag"
                                />
                              )}
                              {"-"}
                              {groupColumn[1] && (
                                <img
                                  style={{ width: "16px", height: "16px" }}
                                  src={
                                    flags[groupColumn[1] as keyof typeof flags]
                                  }
                                  alt="flag"
                                />
                              )}
                            </div>
                          </td>
                        );
                      } else if (col === 56) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[QUARTERS] || 0}</div>
                            <div>
                              {el?.poBets[QUARTERS].slice(0, 4).map(
                                (tid: any) => (
                                  <img
                                    key={tid}
                                    style={{ width: "12px", height: "12px" }}
                                    src={flags[tid as keyof typeof flags]}
                                    alt="flag"
                                  />
                                )
                              )}
                            </div>
                            <div>
                              {el?.poBets[QUARTERS].slice(4, 8).map(
                                (tid: any) => (
                                  <img
                                    key={tid}
                                    style={{ width: "12px", height: "12px" }}
                                    src={flags[tid as keyof typeof flags]}
                                    alt="flag"
                                  />
                                )
                              )}
                            </div>
                          </th>
                        );
                      } else if (col === 57) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[SEMIS] || 0}</div>
                            <div>
                              {el?.poBets[SEMIS].slice(0, 2).map((tid: any) => (
                                <img
                                  key={tid}
                                  style={{ width: "14px", height: "14px" }}
                                  src={flags[tid as keyof typeof flags]}
                                  alt="flag"
                                />
                              ))}
                            </div>
                            <div>
                              {el?.poBets[SEMIS].slice(2, 4).map((tid: any) => (
                                <img
                                  key={tid}
                                  style={{ width: "14px", height: "14px" }}
                                  src={flags[tid as keyof typeof flags]}
                                  alt="flag"
                                />
                              ))}
                            </div>
                          </th>
                        );
                      } else if (col === 58) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[THIRDS] || 0}</div>
                            <div>
                              {el?.poBets[THIRDS].slice(0, 2).map(
                                (tid: any) => (
                                  <img
                                    key={tid}
                                    style={{ width: "14px", height: "14px" }}
                                    src={flags[tid as keyof typeof flags]}
                                    alt="flag"
                                  />
                                )
                              )}
                            </div>
                          </th>
                        );
                      } else if (col === 59) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[FINAL] || 0}</div>
                            <div>
                              {el?.poBets[FINAL].slice(0, 2).map((tid: any) => (
                                <img
                                  key={tid}
                                  style={{ width: "14px", height: "14px" }}
                                  src={flags[tid as keyof typeof flags]}
                                  alt="flag"
                                />
                              ))}
                            </div>
                          </th>
                        );
                      } else if (col === 60) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[WINNER] || 0}</div>
                            <div>
                              {el?.poBets[WINNER] && (
                                <img
                                  style={{ width: "18px", height: "18px" }}
                                  src={flags[el?.poBets[WINNER] as keyof typeof flags]}
                                  alt="flag"
                                />
                              )}
                            </div>
                          </th>
                        );
                      } else if (col === 61) {
                        return (
                          <th key={col}>
                            <div>{el?.poScores[BOMBER] || 0}</div>
                            <div>
                              {el?.poBets[BOMBER] && (
                                <img
                                  style={{ width: "18px", height: "18px" }}
                                  src={flags[el?.poBets[BOMBER] as keyof typeof flags]}
                                  alt="flag"
                                />
                              )}
                            </div>
                          </th>
                        );
                      }
                    })}
                    <td>
                      <b className="h5">{el.score}</b>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

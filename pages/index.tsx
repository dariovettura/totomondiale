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
import teams from "../teams/teams";
import Image from "next/image";
import { parseMatches } from "../utils/parseMatches";
import { parsePlayoffResults } from "../utils/parsePlayoffResults";

export default function Classifica() {
  const [allPlayer, setAllPlayer] = React.useState<any[]>([]);
  const [loader, setLoader] = useState<any>(false);
  const [results, setResults] = useState<any[]>([]);
  const [grResults, setGrResults] = useState<any[]>([]);
  const [poResults, setPoResults] = useState<any[]>([]);
  const [manualResults, setManualResults] = useState<any>({});

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

  const pointValues = {
    [GROUPS]: 1,
    [EIGHTS]: 2,
    [QUARTERS]: 2,
    [SEMIS]: 2,
    [THIRDS]: 6,
    [FINAL]: 8,
    [WINNER]: 12,
    [BOMBER]: 5,
  };

  const [visibleColumns, setVisibleColumns] = useState<any[]>([0, 1, 2]);

  const players = parsePlayers(allPlayer, results, manualResults);

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
          console.log("results", _results);
          setResults(_results);
          let manual = {};
          if(_results.length > 0 && _results[0].hasOwnProperty("manualResults")) {
            manual = _results[0].manualResults;
            setManualResults(manual);
          }
          let _poResults: any = parsePlayoffResults(_results, manual);
          setPoResults(_poResults);
          let _grResults: any = _results.slice(0, 48);
          setGrResults(_grResults);

          let lastPlayed = 57;

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

  const renderTeams = (
    rows: any,
    cols: any,
    round: any,
    teamIds: any,
    isRes: boolean,
    imgSize: string,
    fontSize: number
  ) => {
    return rows.map((ind: any) => (
      <div style={{ marginTop: "-4px", marginBottom: "-4px" }} key={ind}>
        {teamIds.slice(ind * cols, (ind + 1) * cols).map((tid: any) => (
          <span key={tid}>
            <img
              style={{ width: imgSize, height: imgSize }}
              src={flags[tid as keyof typeof flags]}
              alt="flag"
            />
            {/* {create a span with font-size 8} */}
            <span
              className={
                isRes && poResults[round].includes(tid) ? "text-success" : ""
              }
              style={{ fontSize }}
            >
              {teams.find((team) => team.team_id == tid)?.short_code}
            </span>
          </span>
        ))}
      </div>
    ));
  };

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
            padding: "10px",
            position: "sticky",
            top: "30px",
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
                  return (
                    <th key={col}>
                      {groupColumn[0] && (
                        <div>
                          <img
                            style={{ width: "16px", height: "16px" }}
                            src={flags[groupColumn[0] as keyof typeof flags]}
                            alt="flag"
                          />
                          <span>
                            {
                              teams.find(
                                (team) => team.team_id == groupColumn[0]
                              )?.short_code
                            }
                          </span>
                        </div>
                      )}
                      {groupColumn[1] && (
                        <div>
                          <img
                            style={{ width: "16px", height: "16px" }}
                            src={flags[groupColumn[1] as keyof typeof flags]}
                            alt="flag"
                            className="ml-2"
                          />
                          <span>
                            {
                              teams.find(
                                (team) => team.team_id == groupColumn[1]
                              )?.short_code
                            }
                          </span>
                        </div>
                      )}
                      <div>{"Group " + colLetter}</div>
                    </th>
                  );
                } else if (col === 56) {
                  return (
                    <th key={col}>
                      <>
                        {renderTeams(
                          [0, 1, 2, 3, 4, 5, 6, 7, 8],
                          1,
                          QUARTERS,
                          poResults[QUARTERS],
                          false,
                          "12px",
                          9
                        )}
                      </>
                      <div>{`Quarti(${pointValues[QUARTERS]}pt)`} </div>
                    </th>
                  );
                } else if (col === 57) {
                  return (
                    <th key={col}>
                      <>
                        {renderTeams(
                          [0, 1, 2, 3],
                          1,
                          SEMIS,
                          poResults[SEMIS],
                          false,
                          "14px",
                          10
                        )}
                      </>
                      <div>{`Semi(${pointValues[SEMIS]}pt)`} </div>
                    </th>
                  );
                } else if (col === 58) {
                  return (
                    <th key={col}>
                      <>
                        {renderTeams(
                          [0, 1],
                          1,
                          THIRDS,
                          poResults[THIRDS],
                          false,
                          "16px",
                          11
                        )}
                      </>
                      <div>{`Terzo(${pointValues[THIRDS]}pt)`} </div>
                    </th>
                  );
                } else if (col === 59) {
                  return (
                    <th key={col}>
                      <>
                        {renderTeams(
                          [0, 1],
                          1,
                          FINAL,
                          poResults[FINAL],
                          false,
                          "18px",
                          12
                        )}
                      </>
                      <div>{`Finale(${pointValues[FINAL]}pt)`} </div>
                    </th>
                  );
                } else if (col === 60) {
                  return (
                    <th key={col}>
                      <div style={{ textAlign: "center" }}>
                        {poResults[WINNER] && (
                          <img
                            style={{ width: "20px", height: "20px" }}
                            src={flags[poResults[WINNER] as keyof typeof flags]}
                            alt="flag"
                          />
                        )}
                      </div>
                      <div>{`Winner(${pointValues[WINNER]}pt)`} </div>
                    </th>
                  );
                } else if (col === 61) {
                  return (
                    <th key={col}>
                      <div style={{ textAlign: "center" }}>
                        {poResults[BOMBER as keyof typeof poResults] && (
                          <img
                            style={{ width: "20px", height: "20px" }}
                            src={
                              flags[
                                poResults[
                                  BOMBER as keyof typeof poResults
                                ] as keyof typeof flags
                              ]
                            }
                            alt="flag"
                          />
                        )}
                      </div>
                      <div>{`Bomber(${pointValues[BOMBER]}pt)`} </div>
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
                            {groupColumn[0] && (
                              <div>
                                <img
                                  style={{ width: "16px", height: "16px" }}
                                  src={
                                    flags[groupColumn[0] as keyof typeof flags]
                                  }
                                  alt="flag"
                                />
                                <span
                                  className={
                                    poResults[colLetter].includes(
                                      groupColumn[0]
                                    )
                                      ? "text-success"
                                      : ""
                                  }
                                >
                                  {
                                    teams.find(
                                      (team) => team.team_id == groupColumn[0]
                                    )?.short_code
                                  }
                                </span>
                              </div>
                            )}
                            {groupColumn[1] && (
                              <div>
                                <img
                                  style={{ width: "16px", height: "16px" }}
                                  src={
                                    flags[groupColumn[1] as keyof typeof flags]
                                  }
                                  alt="flag"
                                />
                                <span
                                  className={
                                    poResults[colLetter].includes(
                                      groupColumn[1]
                                    )
                                      ? "text-success"
                                      : ""
                                  }
                                >
                                  {
                                    teams.find(
                                      (team) => team.team_id == groupColumn[1]
                                    )?.short_code
                                  }
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      } else if (col === 56) {
                        return (
                          <th key={col}>
                            <div className="h6 text-center">
                              {el?.poScores[QUARTERS] || 0}
                            </div>
                            <>
                              {renderTeams(
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                1,
                                QUARTERS,
                                el?.poBets[QUARTERS],
                                true,
                                "12px",
                                9
                              )}
                            </>
                          </th>
                        );
                      } else if (col === 57) {
                        return (
                          <th key={col}>
                            <div className="h6 text-center">
                              {el?.poScores[SEMIS] || 0}
                            </div>
                            <>
                              {renderTeams(
                                [0, 1, 2, 3],
                                1,
                                SEMIS,
                                el?.poBets[SEMIS],
                                true,
                                "14px",
                                10
                              )}
                            </>
                          </th>
                        );
                      } else if (col === 58) {
                        return (
                          <th key={col}>
                            <div className="h6 text-center">
                              {el?.poScores[THIRDS] || 0}
                            </div>
                            <>
                              {renderTeams(
                                [0, 1],
                                1,
                                THIRDS,
                                el?.poBets[THIRDS],
                                true,
                                "16px",
                                11
                              )}
                            </>
                          </th>
                        );
                      } else if (col === 59) {
                        return (
                          <th key={col}>
                            <div className="h6 text-center">
                              {el?.poScores[FINAL] || 0}
                            </div>
                            <>
                              {renderTeams(
                                [0, 1],
                                1,
                                FINAL,
                                el?.poBets[FINAL],
                                true,
                                "18px",
                                12
                              )}
                            </>
                          </th>
                        );
                      } else if (col === 60) {
                        return (
                          <th key={col}>
                            <div className="h6" style={{ textAlign: "center" }}>
                              {el?.poScores[WINNER] || 0}
                            </div>
                            <div style={{ textAlign: "center" }}>
                              {el?.poBets[WINNER] && (
                                <img
                                  style={{ width: "35px", height: "35px" }}
                                  src={
                                    flags[
                                      el?.poBets[WINNER] as keyof typeof flags
                                    ]
                                  }
                                  alt="flag"
                                />
                              )}
                              <h6
                                className={
                                  poResults[WINNER as keyof typeof poResults] === el?.poBets[WINNER]
                                    ? "text-success"
                                    : ""
                                }
                              >
                                {
                                  teams.find(
                                    (team) => team.team_id == el?.poBets[WINNER]
                                  )?.short_code
                                }
                              </h6>
                            </div>
                          </th>
                        );
                      } else if (col === 61) {
                        return (
                          <th key={col}>
                            <div className="h6" style={{ textAlign: "center" }}>
                              {el?.poScores[BOMBER] || 0}
                            </div>
                            <div style={{ textAlign: "center" }}>
                              {el?.poBets[BOMBER] && (
                                <img
                                  style={{ width: "35px", height: "35px" }}
                                  src={
                                    flags[
                                      el?.poBets[BOMBER] as keyof typeof flags
                                    ]
                                  }
                                  alt="flag"
                                />
                              )}
                              <h6
                                className={
                                  poResults[BOMBER as keyof typeof poResults] === el?.poBets[BOMBER]
                                    ? "text-success"
                                    : ""
                                }
                              >
                                {
                                  teams.find(
                                    (team) => team.team_id == el?.poBets[BOMBER]
                                  )?.short_code
                                }
                              </h6>
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

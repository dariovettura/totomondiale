import { Divider } from "@mui/material";
import axios from "axios";
import { GetStaticPaths, GetStaticPropsResult, NextPage } from "next";
import { imageOptimizer } from "next/dist/server/image-optimizer";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import teams from "../../teams/teams";
import flagss from "../../flags/flags";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import results from "../../calendar/fake_result";

interface Props {
  posts?: any[];
  infos?: any[];
}

const LeScommesse: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter();
  const { id } = router.query;

  const [myRes, setMyRes] = React.useState<any[]>([]);
  const [myOffRes, setMyOffRes] = React.useState<any|string>({});
  const [name, setName] = React.useState<any>([]);
  const [codicePers, setCodicePers] = React.useState<any>(0);
  const [loader, setLoader] = useState<any>(false);
  const [error, setError] = useState<any>(false);
 
  const flags :any = flagss


  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const quarters = [1, 2, 3, 4, 5, 6, 7, 8];
  const semifinals = [1, 2, 3, 4];
  const thirdPlace = [1, 2];
  const finals = [1, 2];

  async function navigate() {
    router.push(
      {
        pathname: "/",
      },
      undefined,
      { scroll: false }
    );
  }

  const getMyResults = () => {
    setLoader(true);
    return axios
      .post("/api/getMyResults", { data: codicePers })
      .then((res) => {
        console.log(res);
        setLoader(false);
        setName(res.data.billing.first_name);
        setMyRes(JSON.parse(res.data.customer_note).myResult);
        setMyOffRes(JSON.parse(res.data.customer_note).myPlayOffResults);
      })
      .catch((err) => {
        setError(true);
        setLoader(false);
      });
  };

  console.log("myOffRes", myOffRes);

  const getTeamName = (id: any) => {
    return teams?.find((el) => el.team_id == id)?.name;
  };

  return (
    <>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        message="Errore schedina non inviata"
        // action={action}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="root">
        <div
          style={{
            marginTop: "60px",
            marginBottom: "60px",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ marginTop: "20px", marginBottom: "20px" }}>
            Inserisci la tua password
          </span>
          <TextField
            style={{ marginTop: "20px", marginBottom: "20px" }}
            type="number"
            onChange={(e) => setCodicePers(e.target.value)}
            id="outlined-basic"
            label="password"
            variant="outlined"
          />
          <Button
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={getMyResults}
          >
            Mostra le tue scommesse
          </Button>
          <span style={{ fontSize: "30px", fontWeight: "bold" }}>{name}</span>

          {myRes.length > 0 && (
            <>
              {myRes.map((el, i) => {
                // statuses: 0 = not played 1 = won, -1 = lost
                let status = 0;
                const res = results?.find(
                  (resel) => resel.match_id == el.match_id
                );
                const matchPlayed = res?.status == "finished";
                if (matchPlayed) {
                  if (
                    res.stats.home_score > res.stats.away_score &&
                    el.result == "1"
                  )
                    status = 1;
                  else if (
                    res.stats.home_score < res.stats.away_score &&
                    el.result == "2"
                  )
                    status = 1;
                  else if (
                    res.stats.home_score == res.stats.away_score &&
                    el.result == "x"
                  )
                    status = 1;
                  else status = -1;
                }
                const resultColor = status == 1 ? "green" : status == -1 ? "red" : "black";
                return (
                  <div
                    key={i}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div>
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[el?.home_team?.team_id]}
                        alt=""
                      />{" "}
                      {el?.home_team?.name} {matchPlayed && res.stats.home_score} - {matchPlayed && res.stats.away_score} {el?.away_team?.name}{" "}
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[el?.away_team?.team_id]}
                        alt=""
                      />
                      {}
                      <span
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                          color: resultColor,
                        }}
                      >
                        {el.result}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div style={{ textAlign: "center" }}>
                {groups.map((el: any, i) => (
                  <div key={i}>
                    <h3>Girone {el} passano (2pt per squadra)</h3>
                    <div>
                      <div className="dv-d-flex dv-f-col dv-gap-10 mb-30">
                        <label htmlFor={`sq1-{el}`}>
                          Girone {el} Squadra 1
                        </label>
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                          }}
                        >
                          {getTeamName(myOffRes[`girone${el}1`])}
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={flags[myOffRes[`girone${el}1`]]}
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="dv-d-flex dv-f-col dv-gap-10 mb-30">
                        <label htmlFor={`sq2-{el}`}>
                          Girone {el} Squadra 2
                        </label>
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                          }}
                        >
                          {getTeamName(myOffRes[`girone${el}2`])}
                          <img
                            style={{ width: "30px", height: "30px" }}
                            src={flags[myOffRes[`girone${el}2`]]}
                            alt=""
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <h3>Quarti passano (2pt per squadra)</h3>
                {quarters.map((el, i) => (
                  <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                    <label htmlFor={`sq-{el}`}>Quarti Squadra {el}</label>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      {getTeamName(myOffRes[`quarti${el}`])}
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[myOffRes[`quarti${el}`]]}
                        alt=""
                      />
                    </span>
                  </div>
                ))}

                <h3>Semifinali passano (2pt per squadra)</h3>
                {semifinals.map((el, i) => (
                  <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                    <label htmlFor={`sq-{el}`}>Semi Squadra {el}</label>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      {getTeamName(myOffRes[`semi${el}`])}
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[myOffRes[`semi${el}`]]}
                        alt=""
                      />
                    </span>
                  </div>
                ))}

                <h3>Finale 3zo posto (6pt per squadra)</h3>
                {thirdPlace.map((el, i) => (
                  <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                    <label htmlFor={`sq-{el}`}>Finale 3/4 Squadra {el}</label>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      {getTeamName(myOffRes[`terzo${el}`])}
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[myOffRes[`terzo${el}`]]}
                        alt=""
                      />
                    </span>
                  </div>
                ))}

                <h3>Finale (8pt per squadra)</h3>
                {finals.map((el, i) => (
                  <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                    <label htmlFor={`sq-{el}`}>Finale Squadra {el}</label>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      {getTeamName(myOffRes[`finale${el}`])}
                      <img
                        style={{ width: "30px", height: "30px" }}
                        src={flags[myOffRes[`finale${el}`]]}
                        alt=""
                      />
                    </span>
                  </div>
                ))}

                <h3>Vincitrice (12 pt)</h3>
                <label htmlFor={`winner`}>Vincitrice</label>
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  {getTeamName(myOffRes[`vincitrice`])}
                  <img
                    style={{ width: "30px", height: "30px" }}
                    src={flags[myOffRes[`vincitrice`]]}
                    alt=""
                  />
                </span>

                <h3>Squadra con capocannoniere (5pt)</h3>
                <label htmlFor={`goleador`}>Sq Capocannoniere</label>
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  {getTeamName(myOffRes[`capocannoniere`])}
                  <img
                    style={{ width: "30px", height: "30px" }}
                    src={flags[myOffRes[`capocannoniere`]]}
                    alt=""
                  />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LeScommesse;

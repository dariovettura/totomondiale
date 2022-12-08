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
import allTeams from "../../teams/teams";
import flagss from "../../flags/flags";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import results from "../../calendar/fake_result";
const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
const quarters = [1, 2, 3, 4, 5, 6, 7, 8];
const semifinals = [1, 2, 3, 4];
const thirdPlace = [1, 2];
const finals = [1, 2];
const QUARTERS = 46850;
  const SEMIS = 46849;
  const THIRDS = 46848;
  const FINAL = 46852;
  // match id
  const WINNER = 429770;
  // id bomber
  const BOMBER = "bomber";
const qualified = [3080, 7850, 12518, 747, 12508, 3011, 12506, 56, 12397, 3026, 12556, 755, 52, 3024, 12507, 3064]

const teams = allTeams.filter((team) => qualified.includes(team.team_id));
interface Props {
  posts?: any[];
  infos?: any[];
}



const Amministrazione: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter();
  const { id } = router.query;
  const [myPlayOffResults, setMyPlayoffResults] = useState<any>({
    [QUARTERS]: [],
    [SEMIS]: [],
    [THIRDS]: [],
    [FINAL]: [],
  });
  console.log("myPlayOffResults", myPlayOffResults);
  const [myRes, setMyRes] = React.useState<any[]>([]);
  const [myOffRes, setMyOffRes] = React.useState<any | string>({});
  const [name, setName] = React.useState<any>([]);
  const [codicePers, setCodicePers] = React.useState<any>(0);
  const [loader, setLoader] = useState<any>(false);
  const [error, setError] = useState<any>(false);

  const isAdmin = codicePers == "303";
  const addPlayoffResult = (teamId: any, stage: any) => {
    const stageIsArray = Array.isArray(myPlayOffResults[stage]);
    let currentPlayoffResults = { ...myPlayOffResults };
    if (stageIsArray) {
      currentPlayoffResults[stage].push(+teamId);
    } else {
      currentPlayoffResults[stage] = +teamId;
    }
    setMyPlayoffResults(currentPlayoffResults);
  };
  let order = {
    status: "completed",
    set_paid: "false",
    payment_method: "Contanti",
    payment_method_title: "Pagamento alla consegna",

    billing: {
      first_name: "Risultati",
      last_name: "Doe",
      address_1: "969 Market",
      address_2: "",
      city: "San Francisco",
      state: "CA",
      postcode: "94103",
      country: "US",
      email: "d.vettura.wd@gmail.com",
      phone: "(555) 555-5555",
    },
    shipping: {
      first_name: "Risultati",
      last_name: "Doe",
      address_1: "969 Market",
      address_2: "",
      city: "San Francisco",
      state: "CA",
      postcode: "94103",
      country: "US",
    },
    line_items: [
      {
        product_id: 225,
        quantity: 1,
        name: "result",
      },
    ],
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: "0.00",
      },
    ],
    customer_note:
      "JSON.stringify({ myResult: myResult, myPlayOffResults: myPlayOffResults })",

    // `[${myResult.map(el => {
    //   return `{match_id:${el?.match_id},away_team:"${el.away_team?.name}",home_team:"${el.home_team?.name}",result:"${el.result}",name:"${myName}"}`
    // })}]`
  };

  const updateResults = () => {
    if (isAdmin) {
      // setLoader(true);

      return axios
        .get("/api/getCalendar")
        .then((res) => {
          let customerNote = [...res.data];
          if (customerNote[0]){
            customerNote[0].manualResults = myPlayOffResults;
          }
          console.log("customerNote", customerNote);
          order.customer_note = JSON.stringify(customerNote);
          axios
            .post("/api/updateMyResults", { id: 303, data: order })
            .then((res) => {
              setLoader(false);
              console.log(res);
            })
            .catch((err) => {
              setLoader(false);
              setError(true);
            });
        })
        .catch((err) => {
          setLoader(false);
          setError(true);
        });
    }
    return;
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
            Pagina per amministratori
          </span>
          <span style={{ marginTop: "20px", marginBottom: "20px" }}>
            Qui si aggiornano i risultati, se non sei amministratore non mettere
            numeri a cazzo
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
            onClick={updateResults}
          >
            Aggiorna risultati
          </Button>
          <span style={{ fontSize: "30px", fontWeight: "bold" }}>{name}</span>
          {isAdmin && (
            <div>
              <h3>Quarti passano (2pt per squadra)</h3>
              {quarters.map((el, i) => (
                <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                  <label htmlFor={`sq-{el}`}>Quarti Squadra {el}</label>
                  <select
                    value={myPlayOffResults[`quarti${el}`]}
                    onChange={(e) =>
                      addPlayoffResult(e.target.value, QUARTERS)
                    }
                  >
                    <option>scegli</option>
                    {teams.map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}

              <h3>Semifinali passano (2pt per squadra)</h3>
              {semifinals.map((el, i) => (
                <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                  <label htmlFor={`sq-{el}`}>Semi Squadra {el}</label>
                  <select
                    value={myPlayOffResults[`semi${el}`]}
                    onChange={(e) =>
                      addPlayoffResult(e.target.value, SEMIS)
                    }
                  >
                    <option>scegli</option>
                    {teams.map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}

              <h3>Finale 3zo posto (6pt per squadra)</h3>
              {thirdPlace.map((el, i) => (
                <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                  <label htmlFor={`sq-{el}`}>Finale 3/4 Squadra {el}</label>
                  <select
                    value={myPlayOffResults[`terzo${el}`]}
                    onChange={(e) =>
                      addPlayoffResult(e.target.value, THIRDS)
                    }
                  >
                    <option>scegli</option>
                    {teams.map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}

              <h3>Finale (8pt per squadra)</h3>
              {finals.map((el, i) => (
                <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
                  <label htmlFor={`sq-{el}`}>Finale Squadra {el}</label>
                  <select
                    value={myPlayOffResults[`finale${el}`]}
                    onChange={(e) =>
                      addPlayoffResult(e.target.value, FINAL)
                    }
                  >
                    <option>scegli</option>
                    {teams.map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}

              <h3>Vincitrice (12 pt)</h3>
              <label htmlFor={`winner`}>Vincitrice</label>
              <select
                value={myPlayOffResults[WINNER]}
                onChange={(e) => addPlayoffResult(e.target.value, WINNER)}
              >
                <option>scegli</option>
                {teams.map((el, i) => {
                  return (
                    <option key={i} value={el.team_id}>
                      {el.name}
                    </option>
                  );
                })}
              </select>

              <h3>Squadra con capocannoniere (5pt)</h3>
              <label htmlFor={`goleador`}>Sq Capocannoniere</label>
              <select
                value={myPlayOffResults[BOMBER]}
                onChange={(e) =>
                  addPlayoffResult(e.target.value, BOMBER)
                }
              >
                <option>scegli</option>
                {teams.map((el, i) => {
                  return (
                    <option key={i} value={el.team_id}>
                      {el.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Amministrazione;

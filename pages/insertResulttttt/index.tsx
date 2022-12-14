import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import InputLabel from '@mui/material/InputLabel';
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Calendar from "../../calendar/calendar";
import FormControl from '@mui/material/FormControl';
import React, { useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import flagss from "../../flags/flags";
import teams from "../../teams/teams";

const flags : any = flagss

export default function Insert() {
  const afterSendDialog = React.useRef(null);
  const afterUpdateDialog = React.useRef(null);

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const quarters = [1, 2, 3, 4, 5, 6, 7, 8];
  const semifinals = [1, 2, 3, 4];
  const thirdPlace = [1, 2];
  const finals = [1, 2];

  let groupsCal = Calendar.filter((el) => {
    return el.stage.name === "Group stage";
  });



  const [myName, setMyName] = useState<string>("");

  let my_results: any = groupsCal.map((el) => {
    return {
      match_id: el.match_id,
      away_team: el.away_team,
      home_team: el.home_team,
      result: "1",
      name: myName,
      totScore: 0,
    };
  });

  const [myResult, setMyResult] = useState<any[]>(my_results);
  const [myPlayOffResults, setMyPlayoffResults] = useState<any>({});

  const [openDialogSend, setOpenDialogSend] = useState<any>(false);
  const [openDialogUp, setOpenDialogup] = useState<any>(false);
  const [codicePers, setCodicePers] = useState<any>(0);
  const [loader, setLoader] = useState<any>(false);
  const [error, setError] = useState<any>(false);



  let order = {
    status: "completed",
    set_paid: "false",
    payment_method: "Contanti",
    payment_method_title: "Pagamento alla consegna",

    billing: {
      first_name: myName,
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
      first_name: myName,
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
    customer_note: JSON.stringify({ myResult: myResult, myPlayOffResults: myPlayOffResults }),

    // `[${myResult.map(el => {
    //   return `{match_id:${el?.match_id},away_team:"${el.away_team?.name}",home_team:"${el.home_team?.name}",result:"${el.result}",name:"${myName}"}`
    // })}]`
  };


  React.useEffect(() => {
    console.log("ciao")
    if (localStorage.getItem('myRes')) {
      const res: any = localStorage.getItem('myRes');
      setMyResult(JSON.parse(res));
    }
    else { localStorage.setItem('myRes', JSON.stringify(myResult)); };

    if (localStorage.getItem('myOffRes')) {
      const res: any = localStorage.getItem('myOffRes');
      setMyPlayoffResults(JSON.parse(res));
    }
    else { localStorage.setItem('myOffRes', JSON.stringify(myPlayOffResults)); };


  }, []);



  const onInputResult = (result: any, match: number) => {
    console.log("ONINPUTRESULT", result, match);
    return setMyResult((prev) =>
      prev.map((el) => {
        if (el.match_id == match) {
          return { ...el, result: result };
        } else {
          return el;
        }
      })
    );
  };

  const onLocalSaveRes = (result: any, match: number) => {

    var saved: any = localStorage.getItem('myRes')
    return localStorage.setItem(
      'myRes', JSON.stringify(
        JSON.parse(saved).map((el: { match_id: number; }) => {
          if (el.match_id == match) {
            return { ...el, result: result };
          } else {
            return el;
          }
        })
      ));
  };

  const addPlayoffResult = (teamId: any, stage: any) => {
    let currentPlayoffResults = { ...myPlayOffResults };
    currentPlayoffResults[stage] = +teamId;
    setMyPlayoffResults(currentPlayoffResults);
    localStorage.setItem('myOffRes', JSON.stringify(currentPlayoffResults))
  };



  // console.log("myPlayOffResults", myPlayOffResults);


  const inviaResults = () => {
    if (myName !== "") {
      setLoader(true);

      return axios
        .get("/api/getAllSchedine")
        .then((res) => {
          const alreadyExist = res.data.find(
            (el: { billing: { first_name: string } }) =>
              el.billing.first_name == myName
          );
          // res.data.map(
          //   (el: { customer_note: any; }) => newRes(el.customer_note).find(
          //     (e: { name: string; }) => e.name === myName));

          if (!alreadyExist) {
            return axios
              .post("/api/inviaRisultati", { data: order })
              .then((res) => {
                // setMyResultAdd(res.data.customer_note)
                setCodicePers(res.data.number);
                console.log(JSON.parse(res.data.customer_note));
                setLoader(false);
                setOpenDialogSend(true);
              })
              .catch((err) => {
                setLoader(false);
                setError(true);
              });
          } else {
            setLoader(false);
            setError(true);
          }
        })
        .catch((err) => {
          setLoader(false);
          setError(true);
        });
    }
  };
  const getMyResults = () => {
    return axios
      .post("/api/getMyResults", { data: 226 })
      .then((res) => console.log(res));
  };

  const updateMyResults = () => {
    if (codicePers !== 0 || myName !== "") {
      setLoader(true);

      return axios
        .post("/api/updateMyResults", { id: +codicePers, data: order })
        .then((res) => {
          setLoader(false);
          setOpenDialogup(false);
          setOpenDialogSend(true);
          console.log(res);
        })
        .catch((err) => {
          setLoader(false);
          setOpenDialogup(false);
          setError(true);
        });
    }
  };

  return (
    <>
      {/* <Snackbar
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
     
      <div
        style={{
          marginTop: "60px",
          marginBottom: "60px",
          width: "100vw",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      {groupsCal.map((el, i) => {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <div className="dv-d-flex dv-f-col dv-gap-0 dv-ai-center">
                <span> GRUPPO {el.group.group_name} </span>
                <span> DATA {el.match_start}</span>
              </div>
              <div className="dv-d-flex dv-ai-center" style={{fontWeight:"600"}}>
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={flags[el?.home_team?.team_id ? el?.home_team?.team_id : "0"]}
                  alt=""
                />{" "}
                {el?.home_team?.name} - {el?.away_team?.name}{" "} 
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={flags[el?.away_team?.team_id ? el?.away_team?.team_id : "0" ]}
                  alt=""
                />{" "}

             </div>
              <div className="dv-d-flex gap-10 dv-ai-center dv-jc-center">
                <div className="radio-btn">
                  <input checked={myResult[i]?.result.toString() == "1"} value="1" type="radio" name={i.toString()}
                    onChange={(e) => { onInputResult(e.target.value, el.match_id); onLocalSaveRes(e.target.value, el.match_id) }} />
                  <label >1</label>
                </div>
                <div className="radio-btn">
                  <input checked={myResult[i]?.result.toString() == "x"} value="x" type="radio" name={i.toString()}
                    onChange={(e) => { onInputResult(e.target.value, el.match_id); onLocalSaveRes(e.target.value, el.match_id) }} />
                  <label >x</label>
                </div>
                <div className="radio-btn">
                  <input checked={myResult[i]?.result.toString() == "2"} value="2" type="radio" name={i.toString()}
                    onChange={(e) => { onInputResult(e.target.value, el.match_id); onLocalSaveRes(e.target.value, el.match_id) }} />
                  <label >2</label>
                </div>

              </div>
            </div>
          );
        })} 

        <div className="dv-d-flex dv-ai-center dv-f-col mb-100 mt-40" style={{textAlign:"center"}}>

        {groups.map((el, i) => (
          <div key={i}>
            <h3>Girone {el} passano (2pt per squadra)</h3>
            <div>
              <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" >
                <label htmlFor={`sq1-{el}`}>Girone {el} Squadra 1</label>
                <select value={myPlayOffResults[`girone${el}1`]} onChange={(e) => addPlayoffResult(e.target.value, `girone${el}1`)}>
                  <option>scegli</option>
                  {teams
                    .filter((te, i) => te.group_name == el)
                    .map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="dv-d-flex dv-f-col dv-gap-10 mb-30">
                <label htmlFor={`sq2-{el}`}>Girone {el} Squadra 2</label>
                <select value={myPlayOffResults[`girone${el}2`]} onChange={(e) => addPlayoffResult(e.target.value, `girone${el}2`)}>
                  <option>scegli</option>
                  {teams
                    .filter((te, i) => te.group_name == el)
                    .map((el, i) => {
                      return (
                        <option key={i} value={el.team_id}>
                          {el.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
        ))}

        <h3>Quarti passano (2pt per squadra)</h3>
        {quarters.map((el, i) => (
          <div className="dv-d-flex dv-f-col dv-gap-10 mb-30" key={i}>
            <label htmlFor={`sq-{el}`}>Quarti Squadra {el}</label>
            <select value={myPlayOffResults[`quarti${el}`]} onChange={(e) => addPlayoffResult(e.target.value, `quarti${el}`)}>
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
            <select value={myPlayOffResults[`semi${el}`]} onChange={(e) => addPlayoffResult(e.target.value, `semi${el}`)}>
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
            <select value={myPlayOffResults[`terzo${el}`]} onChange={(e) => addPlayoffResult(e.target.value, `terzo${el}`)}>
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
            <select value={myPlayOffResults[`finale${el}`]}  onChange={(e) => addPlayoffResult(e.target.value, `finale${el}`)}>
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
        <select value={myPlayOffResults[`vincitrice`]}  onChange={(e) => addPlayoffResult(e.target.value, `vincitrice`)}>
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
        <select value={myPlayOffResults[`capocannoniere`]} onChange={(e) => addPlayoffResult(e.target.value, `capocannoniere`)}>
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

        <div className="dv-d-flex dv-ai-center dv-f-col mb-100 mt-40">
          <span>Inserisci il tuo nomecognome senza spazi</span>
          <TextField
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onChange={(e) => setMyName(e.target.value.replace(" ", ""))}
            id="outlined-basic"
            label="nomecognome"
            variant="outlined"
          />
          <Button
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={inviaResults}
          >
            Invia schedina
          </Button>
          <span style={{ marginTop: "20px", marginBottom: "20px" ,textAlign:"center"}}>
            Hai gi?? inviato la tua schedina e vuoi modificarla?
          </span>
          <Button
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={() => setOpenDialogup(true)}
          >
            Modifica schedina
          </Button>
        </div>
      </div>

      <Dialog
        ref={afterSendDialog}
        onClose={() => setOpenDialogSend(false)}
        open={openDialogSend}
      >
        <div
          style={{
            position:"relative",
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span  onClick={() => setOpenDialogSend(false)} style={{position:"absolute",fontSize:"30px",top:"10px",right:"10px",fontWeight:"900"}}>X</span>
          <span>Schedina inviata</span>
          <span>Questa ?? la tua password</span>
          <span style={{ fontSize: "40px", fontWeight: "bold" }}>
            {codicePers}
          </span>
          <span>
            Salvatela che servir?? per modificare la tua schedina o altre cose
          </span>
        </div>
      </Dialog>
      <Dialog
        ref={afterUpdateDialog}
        onClose={() => setOpenDialogup(false)}
        open={openDialogUp}
      >
        <div
          style={{
            height: "75vh",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: "10px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
           <span   onClick={() => setOpenDialogup(false)} style={{position:"absolute",fontSize:"30px",top:"10px",right:"10px",fontWeight:"900"}}>X</span>
          <span style={{ marginTop: "20px", marginBottom: "20px" }}>
            Inserisci la tua password
          </span>
          <TextField
            style={{ marginTop: "20px", marginBottom: "20px" }}
            value={codicePers}
            type="number"
            onChange={(e) => setCodicePers(e.target.value)}
            id="outlined-basic"
            label="password"
            variant="outlined"
          />

          <span style={{ marginTop: "20px", marginBottom: "20px" }}>
            Inserisci il tuo nome
          </span>
          <TextField
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onChange={(e) => setMyName(e.target.value)}
            id="outlined-basic"
            label="nomecognome"
            variant="outlined"
          />
          <Button
            style={{ marginTop: "20px", marginBottom: "20px" }}
            onClick={updateMyResults}
          >
            Invia schedina modificata
          </Button>
        </div>
      </Dialog> */}
    </>
  );
}

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'antd/dist/antd.css';
import Snackbar from '@mui/material/Snackbar';

import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Calendar from '../../calendar/calendar'
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';




export default function Insert() {
  const afterSendDialog = React.useRef(null)
  const afterUpdateDialog = React.useRef(null)

  let cal = Calendar.filter(el => { return el.away_team !== null })

  const [myName, setMyName] = useState<string>("")

  let my_results = cal.map(el => {
    return {
      match_id: el.match_id,
      away_team: el.away_team,
      home_team: el.home_team,
      result: "1",
      name: myName,
      totScore: 0
    }
  })

  const [myResult, setMyResult] = useState<any[]>(my_results)

  const [openDialogSend, setOpenDialogSend] = useState<any>(false)
  const [openDialogUp, setOpenDialogup] = useState<any>(false)
  const [codicePers, setCodicePers] = useState<any>(0)
  const [loader, setLoader] = useState<any>(false)
  const [error, setError] = useState<any>(false)



  console.log(myName)


  let order = {
    status: 'completed',
    set_paid: 'false',
    payment_method: 'Contanti',
    payment_method_title: 'Pagamento alla consegna',

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
      phone: "(555) 555-5555"
    },
    shipping: {
      first_name: myName,
      last_name: "Doe",
      address_1: "969 Market",
      address_2: "",
      city: "San Francisco",
      state: "CA",
      postcode: "94103",
      country: "US"
    },
    line_items: [{
      product_id: 225,
      quantity: 1,
      name: "result",

    }],
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: "0.00",
      },
    ],
    customer_note: JSON.stringify(myResult)

    // `[${myResult.map(el => {
    //   return `{match_id:${el?.match_id},away_team:"${el.away_team?.name}",home_team:"${el.home_team?.name}",result:"${el.result}",name:"${myName}"}`
    // })}]`
  };



  React.useEffect(() => { console.log({ myResult }) }, [myResult])


  const onInputResult = (result: any, match: number) => {
    return setMyResult(prev => prev.map(el => { if (el.match_id == match) { return { ...el, result: result } } else { return el } }))

  }

  const inviaResults = () => {
    if (myName !== "") {

      setLoader(true);


      return axios.get("/api/getAllSchedine").then(res => {

        const alreadyExist = res.data.find((el: { billing: { first_name: string; }; }) => el.billing.first_name == myName)
        // res.data.map(
        //   (el: { customer_note: any; }) => newRes(el.customer_note).find(
        //     (e: { name: string; }) => e.name === myName));

        if (!alreadyExist) {
          return axios.post("/api/inviaRisultati", { data: order, })
            .then(
              res => {
                // setMyResultAdd(res.data.customer_note)
                setCodicePers(res.data.number)
                console.log(JSON.parse(res.data.customer_note))
                setLoader(false);
                setOpenDialogSend(true)
              }
            )
            .catch(err => {
              setLoader(false);
              setError(true)
            })
        }
        else {
          setLoader(false);
          setError(true)
        }

      })
        .catch(err => {
          setLoader(false);
          setError(true)
        });

    }


  }
  const getMyResults = () => {
    return axios.post("/api/getMyResults", { data: 226 }).then(
      res =>
        console.log(res)
    );

  }

  const updateMyResults = () => {

    if (codicePers !== 0 || myName !== "") {
      setLoader(true);


      return axios.post("/api/updateMyResults", { id: +codicePers, data: order }).then(
        res => {
          setLoader(false);
          setOpenDialogup(false);
          setOpenDialogSend(true)
          console.log(res)
        }
      )
        .catch(err => {
          setLoader(false);
          setOpenDialogup(false);
          setError(true)
        })
        ;

    }


  }




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
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
        onClick={() => setLoader(false)}
      >
        <CircularProgress color="inherit" /></Backdrop>
      {/* <span onClick={() => inviaResults()}>invia </span>

      <span onClick={() => getMyResults()}>getMyResult </span>

      <span onClick={() => updateMyResults()}>updateMyResult </span> */}
      <div style={{ marginTop: "60px", marginBottom: "60px", width: "100vw", height: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", justifyContent: "center" }}>
        {cal.map((el, i) => {
          return <div key={i}  style={{ display: "flex", flexDirection: "column",marginTop:"20px",marginBottom:"20px" }}>
            <div className='dv-d-flex dv-f-col dv-gap-0 dv-ai-center'>
              <span> GRUPPO {el.group.group_name} </span>
              <span> DATA {el.match_start}</span>

            </div>
            <div>
              <img style={{ width: "30px", height: "30px" }} src={el?.home_team?.logo} alt="" /> {el?.home_team?.name} - {el?.away_team?.name} <img style={{ width: "30px", height: "30px" }} src={el?.away_team?.logo} alt="" /> -
              <select onChange={(e) => onInputResult(e.target.value, el.match_id)}  >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="x">x</option>
              </select></div>

          </div>
        })}
        <div className='dv-d-flex dv-ai-center dv-f-col mb-100 mt-40'>
          <span>
            Inserisci il tuo nomecognome senza spazi
          </span>
          <TextField style={{marginTop:"20px",marginBottom:"20px"}}  onChange={(e) => setMyName(e.target.value)} id="outlined-basic" label="nomecognome" variant="outlined" />
          <Button style={{marginTop:"20px",marginBottom:"20px"}}  onClick={inviaResults}>Invia schedina</Button>
          <span style={{marginTop:"20px",marginBottom:"20px"}} >Hai già inviato la tua schedina e vuoi modificarla?</span>
          <Button style={{marginTop:"20px",marginBottom:"20px"}}  onClick={() => setOpenDialogup(true)}>Modifica schedina</Button>

        </div>


      </div>


      <Dialog ref={afterSendDialog} onClose={() => setOpenDialogSend(false)} open={openDialogSend}>
        <div style={{ height: "75vh", display: "flex", flexDirection: "column", padding: "10px", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <span>Schedina inviata</span>
          <span>Questa è la tua password</span>
          <span style={{ fontSize: "40px", fontWeight: "bold" }}>
            {codicePers}
          </span>
          <span>Salvatela che servirà per modificare la tua schedina o altre cose</span>

        </div>
      </Dialog>
      <Dialog ref={afterUpdateDialog} onClose={() => setOpenDialogup(false)} open={openDialogUp}>
        <div style={{ height: "75vh", display: "flex", flexDirection: "column", gap: 20, padding: "10px", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <span style={{marginTop:"20px",marginBottom:"20px"}}>
            Inserisci la tua password
          </span>
          <TextField style={{marginTop:"20px",marginBottom:"20px"}} value={codicePers} type='number' onChange={(e) => setCodicePers(e.target.value)} id="outlined-basic" label="password" variant="outlined" />

          <span style={{marginTop:"20px",marginBottom:"20px"}}>
            Inserisci il tuo nome
          </span>
          <TextField  style={{marginTop:"20px",marginBottom:"20px"}}  onChange={(e) => setMyName(e.target.value)} id="outlined-basic" label="nomecognome" variant="outlined" />
          <Button style={{marginTop:"20px",marginBottom:"20px"}} onClick={updateMyResults}>Invia schedina modificata</Button>




        </div>
      </Dialog>

    </>
  )
}

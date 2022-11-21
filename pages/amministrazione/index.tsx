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

const Amministrazione: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter();
  const { id } = router.query;

  const [myRes, setMyRes] = React.useState<any[]>([]);
  const [myOffRes, setMyOffRes] = React.useState<any | string>({});
  const [name, setName] = React.useState<any>([]);
  const [codicePers, setCodicePers] = React.useState<any>(0);
  const [loader, setLoader] = useState<any>(false);
  const [error, setError] = useState<any>(false);

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
    customer_note: "JSON.stringify({ myResult: myResult, myPlayOffResults: myPlayOffResults })",

    // `[${myResult.map(el => {
    //   return `{match_id:${el?.match_id},away_team:"${el.away_team?.name}",home_team:"${el.home_team?.name}",result:"${el.result}",name:"${myName}"}`
    // })}]`
  };


  const updateResults = () => {
    if (codicePers == "303") {
      setLoader(true);

      return axios
        .get("/api/getCalendar")
        .then((res) => {
          order.customer_note = JSON.stringify(res.data);
          console.log("updatedResults", res.data);
          axios
            .post("/api/updateMyResults", { id: 303, data: order })
          .then((res) => {
            setLoader(false);
            console.log(res);
          })
          .catch((err) => {
            setLoader(false);
            setError(true);
          })
        }
        )
        .catch(err => { 
          setLoader(false); 
          setError(true); });
    }
    return;
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
            Qui si aggiornano i risultati, se non sei amministratore non mettere numeri a cazzo
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


        </div>
      </div>
    </>
  );
};

export default Amministrazione;

import { Divider } from "@mui/material";
import axios from "axios";

import { GetStaticPaths, GetStaticPropsResult, NextPage } from "next";
import { imageOptimizer } from "next/dist/server/image-optimizer";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import teams from "../../teams/teams";
import flagss from "../../flags/flags";

interface Props {
  posts?: any[];
  infos?: any[];

}


const Player: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter();
  const { id } = router.query;

const flags : any = flagss

  const [myRes, setMyRes] = React.useState<any[]>([]);
  const [myOffRes, setMyOffRes] = React.useState<any>({});
  const [name, setName] = React.useState<any>([]);

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
    return axios.post("/api/getMyResults", { data: id }).then((res) => {
      console.log(res);
      setName(res.data.billing.first_name);
      setMyRes(JSON.parse(res.data.customer_note).myResult);
      setMyOffRes(JSON.parse(res.data.customer_note).myPlayOffResults);
    });
  };

  const getTeamName = (id: any) => {
    return teams?.find((el) => el.team_id == id)?.name;
  };

  React.useEffect(() => {
    getMyResults();
  }, []);

  return (
    <>
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
          <span style={{ fontSize: "30px", fontWeight: "bold" }}>{name}</span>

          {myRes.map((el, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              <div className="dv-d-flex dv-f-row dv-gap-10">
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={flags[el?.home_team?.team_id]}
                  alt=""
                />{" "}
                {el?.home_team?.name} - {el?.away_team?.name}{" "}
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={flags[el?.away_team?.team_id]}
                  alt=""
                />
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    marginLeft: "20px",
                  }}
                >
                  {el.result}
                </span>
              </div>
            </div>
          ))}

          {groups.map((el: any, i) => (
            <div key={i}>
              <h3>Girone {el} passano (2pt per squadra)</h3>
              <div>
                <div>
                  <label htmlFor={`sq1-{el}`}>Girone {el} Squadra 1</label>
                  <span
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginLeft: "20px",
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
                <div>
                  <label htmlFor={`sq2-{el}`}>Girone {el} Squadra 2</label>
                  <span
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginLeft: "20px",
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
            <div key={i}>
              <label htmlFor={`sq-{el}`}>Quarti Squadra {el}</label>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginLeft: "20px",
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
            <div key={i}>
              <label htmlFor={`sq-{el}`}>Semi Squadra {el}</label>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginLeft: "20px",
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
            <div key={i}>
              <label htmlFor={`sq-{el}`}>Finale 3/4 Squadra {el}</label>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginLeft: "20px",
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
            <div key={i}>
              <label htmlFor={`sq-{el}`}>Finale Squadra {el}</label>
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  marginLeft: "20px",
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
              marginLeft: "20px",
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
              marginLeft: "20px",
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
      </div>
    </>
  );
};
export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const infourl =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/informazioni?_embed&per_page=100";

  const url =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/posts?_embed&per_page=100";

  //const result = await Axios.get(url);
  //const menu =  result.data
  const infores = await fetch(infourl, { method: "GET" });
  const res = await fetch(url, {
    method: "GET",

    credentials: "same-origin", //include, same-origin
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  const posts = await res.json();
  const infos = await infores.json();

  //  const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
      infos,
    },
    revalidate: 10,
  };
}
export default Player;

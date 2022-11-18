import Link from "next/link";
import SwipableMenu from "./menu/SwipableMenu";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useState } from "react";

const Header = () => {
  
  return (
    <header id="header " >
      <h1 style={{margin:"0px"}}>TOTOMONDIALE</h1>
      <SwipableMenu />
    </header>
  );
};

export default Header;

import Link from "next/link";
import SwipableMenu from "./menu/SwipableMenu";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useEffect, useState } from "react";

const Header = () => {
  
  return (
    <header id="header " >
      <SwipableMenu />
    </header>
  );
};

export default Header;

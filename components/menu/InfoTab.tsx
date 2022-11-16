import { Avatar } from "@mui/material"
import { Button } from "antd"
import Image from "next/image"
import Link from "next/link"


interface Props {
onclick?():void

}
const InfoTab: React.FC<Props> = ({ onclick}) => {


   


    return <div className="infoTab" >
      
      <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",gap:20,alignItems:"center",justifyContent:"center"}}>

            <Link  href={"/insertResult"} >
               <Button style={{paddingTop:"20px",paddingBottom:"20px"}} onClick={onclick}>Inserisci la tua schedina</Button>
            </Link>
            <Link  href={"/insertResult"}>
            <Button style={{paddingTop:"20px",paddingBottom:"20px"}} onClick={onclick}>I tuoi risultati</Button>
            </Link>
            <Link   href={"/classifica"}>
            <Button style={{paddingTop:"20px",paddingBottom:"20px"}}  onClick={onclick}>Classifica</Button>
            </Link>
        </div>


      
    </div>
}

export default InfoTab
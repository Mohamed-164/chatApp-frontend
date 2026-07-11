import { IoClose } from "react-icons/io5";
import { createPortal } from 'react-dom';
import '../css/Popup.css';
import { useContext } from "react";
import { Dataprovider } from "./App";

export default function PasswordTab({goback,submit}){

    const{DATA} = useContext(Dataprovider);


    return createPortal(
        <div className={DATA.theme === "LIGHT"?"bg_dark":"bg_white"} id="Pass_tab">
            <IoClose className={DATA.theme === "LIGHT"?"p_dark":"p_white"}  id="close" onClick={()=>{
                goback();
            }}/>
            <p className={DATA.theme === "LIGHT"?"p_dark":"p_white"} id="pass_p">Enter your password : </p>
            <input type="text" id="pass_tab"/>
            <p id="spass"></p>
            <input type="submit" value="Enter" id="Enter" onClick={()=>{

                const status = document.getElementById('spass');
                const pass = document.getElementById('pass_tab').value;

                submit(status,pass);
            }}
            />
        </div>,
        document.getElementById('pop-up')
    );

}
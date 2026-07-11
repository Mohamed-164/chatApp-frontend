
import { createPortal } from 'react-dom';
import '../css/Popup.css';
import { useContext } from "react";
import { Dataprovider } from "./App";

export default function InfoTab({setInfo}){

    const{DATA} = useContext(Dataprovider);


    return createPortal(
        <div className={DATA.theme === "LIGHT"?"bg_dark":"bg_white"} id="Pass_tab">
            <p className={DATA.theme === "LIGHT"?"p_dark":"p_white"} 
                id="pass_p"
            >
                someone tries to login your account , if you unaware of this change password to protect your account
            </p>
            <input type="submit" value="ok" id="Enter" onClick={()=>{
                setInfo(false);
            }}
            />
        </div>,
        document.getElementById('pop-up')
    );

}
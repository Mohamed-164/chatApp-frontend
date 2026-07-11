import { useContext } from 'react';
import '../css/Popup.css';
import { createPortal } from "react-dom";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { Dataprovider } from './App';

export default function Popup({msg,validated}){

    const{DATA} = useContext(Dataprovider);

    return createPortal(
    <div className={validated ? DATA.theme === "LIGHT"?"_white" : "_dark" : "_white"} id="pop-msg">
        <BsFillChatSquareDotsFill style={{color:'#0097A7'}}/>
        <p className={validated ? DATA.theme === "LIGHT"?"p_dark":"p_white" : "_white"}>{msg}</p>
    </div>,
    document.getElementById('pop-up')
    );
}
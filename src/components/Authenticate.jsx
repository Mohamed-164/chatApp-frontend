import '../css/Authenticate.css'
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

export default function Authenticate({setToken}){

    const [signup,setSignup] = useState(true);

    useEffect(()=>{
        document.body.style.background =  "linear-gradient(135deg,#0097A7,whitesmoke)";
    });


    return (
        <main id='Authen_main'>
            <div>
                <center>
                <BsFillChatSquareDotsFill id='Authen_logo'/>
                <p id='Authen_Appname'>Vibely</p>
                <h4>{signup?"Create your account":"Welcome back!"}</h4>
                <p>{signup?"Sign up to chatting with your friends":"Log in to continue chatting"}</p>
                </center>
            </div>
            {signup?<Signup signup={signup} setSignup={setSignup}/>:
            <Login setToken={setToken} signup={signup} setSignup={setSignup}/>
            }

        </main>
    );
}
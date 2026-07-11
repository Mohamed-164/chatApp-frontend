
import { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { GiAirplaneDeparture } from "react-icons/gi";
import { GiAirplaneArrival } from "react-icons/gi";
import { Dataprovider } from "./App";
import PasswordTab from "./PasswordTab";

export default function Deactivate({setDeactivate,submitRequest}){

    const{DATA,showpopup,setPopUp} = useContext(Dataprovider);

    const[passtab,setPassTab] = useState({show : false,element : ""});

    function goback(){
        passtab.element.disabled = false;
        setPassTab({show : false,element : ""});
    }


    async function submit(status,pass){
            
        if(DATA.status === "ACTIVE"){

           setPopUp({show : true , msg : "processing..."});
           const code =  await submitRequest("/deactive",{
                number : DATA.number,
                password : pass,
            });

            if(code === 403){
                status.textContent = "Invalid password";
                status.style.color = "red";
                showpopup("Invalid credentials");
            }else if(code === 200){

                const back = document.getElementById('Profile_leftarrow');

                back.style.display = "none";

                showpopup("Account deactivated restarting...");
                setPassTab({show : false,element : ""});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }else{
                showpopup("failed to update");
            }


        }else if(DATA.status === "DEACTIVE"){

           setPopUp({show : true, msg : "processing..."});
           const code =  await submitRequest("/active",{
                number : DATA.number,
                password : pass,
            });

            if(code === 403){
                status.textContent = "Invalid password";
                status.style.color = "red";

                showpopup("Invalid credentials");

            }else if(code === 200){

                const back = document.getElementById('Profile_leftarrow');

                back.style.display = "none";

                showpopup("Account activated restarting..");
                setPassTab({show : false,element : ""});
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }else{
                showpopup("failed to update");
            }



        }
    
    }


    return(
        <>
            <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">

                <div id="Profile_header" className='Profile_outerDiv'>
                    <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                        onClick={()=>{
                            setDeactivate(false);
                        }}
                    />
                    <p className='Profile_head'>
                        {DATA.status === "ACTIVE"?"Deactivate account":"Activate account"}
                    </p>
                </div>

                <div id="delete_middle">

                    <center>
                        <h3 
                            id='Settings_heading'
                            style={{fontFamily:'sans-serif',color:'#0097A7'}}
                        >
                            {DATA.status==="ACITVE"? "Deactivate your vibely account":"Activate your vibely account"}
                        </h3>
                    </center>
                    {
                        DATA.status === "ACTIVE"?
                        <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                            we extremely sorry for anything if it is disturbed you !!!, Deactivating your account is temporary and can be reversed by logging in again. While your account is deactivated, other users will not be able to contact you, send friend requests, or place calls to your account and neither you also. Your profile, friends list, messages, and account data will be preserved and remain securely stored. Reactivating your account will restore access to all of your existing data and connections
                        </article>
                        :
                        <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"}  style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                            We're glad to see you again.Your account is currently inactive. Activate it to reconnect with friends, access your conversations, and continue enjoying everything Vibely has to offer.Need help in the future? We're always here to support you.Click "Activate Account" to get started.

                        </article>
                        
                    }

                </div>

                <div id='Account_footer'>
                    {
                        DATA.status === "ACTIVE"?
                            <GiAirplaneDeparture  id='delete_icon' style={{left:'30%'}}/>
                        :
                            <GiAirplaneArrival id="delete_icon" style={{left:'30%'}}/>

                    }
                    <input id='delete' className={DATA.status === "ACTIVE"? "": "activate"}
                     type="submit" value={DATA.status ==="ACTIVE"?"Deactivate":"Activate"}
                        onClick={(e)=>{
                            e.currentTarget.disabled = true;
                            setPassTab({show : true,element : e.currentTarget});
                        }}
                    />
                </div>

            </main>
            {
                passtab.show?
                <PasswordTab goback={goback} submit={submit}/>
                :
                ""
            }
        </>
    );

}
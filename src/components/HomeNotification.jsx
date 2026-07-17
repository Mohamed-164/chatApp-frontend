
import { useContext, useEffect, useState } from "react";
import { Dataprovider } from "./App";
import { reduceName } from "../js/validatator";


export default function HomeNotification({check,search}){

    const{BASE_URL,DATA,setData,showpopup,URLsubmit} = useContext(Dataprovider);

    const list = DATA.requests;

    useEffect(()=>{

        document.getElementById('Home_middle').classList.add('empty');

        return ()=>{
            if(DATA.friends > 0){
                document.getElementById('Home_middle').classList.remove('empty');
            }
        }

    },[]);

    async function submitData(item,accept) {

        try {
                
            const res = await (accept ?

                URLsubmit("POST","/request/addfriend",{
                    myID:DATA.number,
                    friendID:item.number
                })

            :
                URLsubmit("DELETE","/request/rejectfriend",{
                    data: {
                        myID: DATA.number,
                        friendID: item.number
                    }
                })
            
            )
        
            if(res.status == 200){
                setData(prev => ({
                    ...prev,
                    friends: (accept?[...prev.friends, item] : [...prev.friends]),
                    requests: prev.requests.filter(
                        req => req.number !== item.number
                    )
                }));
            }

            return res.status;

        } catch (err) {
            return err.response !== undefined ? err.response.status : 500;
        } 
    }

    function status(code){
        if(code > 400){
            showpopup("server error");
        }
    }

    async function acceptRequest(item){
        const STATUS = await submitData(item,true);

        if(STATUS == 200){
            showpopup((reduceName(item.name,14))+" request added");
        }

        status(STATUS);
    }

    async function rejectRequest(item) {
        const STATUS = await submitData(item,false);

        if(STATUS == 200){
            showpopup((reduceName(item.name,14))+" request rejected");
        }


        status(STATUS);        
    }
    
    return(
        <>
            {
            
            list.length == 0?

              <div id="Home_chat_empty">
                <p id="Home_p_empty">No notification</p>
              </div>

                :
            
            list.filter((item)=>{
                if(search == ""){
                  return true;
                }else{
                  let Name = item.name;
                  return check(Name);
                }
              }).map((item,index)=>(
                    <div key={index} className={`Home_contact 
                  ${DATA.theme === "LIGHT" ?'contact_white':'contact_dark'}`}>
                        <div className='Home_friendprofile profile_parent'>
                        <img src={item.profile_url? item.profile_url : "./defaultProfile.png"} alt="" 
                            onError={(e)=>{
                                e.target.src = "./defaultProfile.png"
                            }}
                        />
                        </div>
                        <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>
                            {reduceName(item.name,12)}
                        </p>

                        <div 
                            className={`request_div 
                                ${DATA.theme === "LIGHT"?"cancel_white" : "cancel_dark"}`
                            } 
                            id="Home_accept" onClick={()=>{acceptRequest(item)}} 
                        >
                            <p className="request_p">Accept</p>
                        </div>
                        <div 
                                className={`request_div 
                                ${DATA.theme === "LIGHT"?"cancel_white" : "cancel_dark"}`
                            } 
                            id="Home_cancel" onClick={()=>{rejectRequest(item)}}>
                            <p className="request_p">Reject</p>
                        </div>
                    </div>
                ))
            }
        </>
    );
}
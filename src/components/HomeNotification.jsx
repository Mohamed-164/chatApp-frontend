
import axios from "axios";
import { FcCancel } from "react-icons/fc";
import { FaCheck } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { Dataprovider } from "./App";


export default function HomeNotification({check,search}){

    const{BASE_URL,DATA,setData,showpopup} = useContext(Dataprovider);

    const list = DATA.requests;

    useEffect(()=>{

        document.getElementById('Home_middle').classList.add('empty');

        return ()=>{
            if(DATA.friends > 0){
                document.getElementById('Home_middle').classList.remove('empty');
            }
        }

    },[])

    async function submitData(item,accept) {

        try {
                
            const res = await (accept ?
            axios.post(
                `${BASE_URL}/request/addfriend`
                ,{
                myID:DATA.number,
                friendID:item.number
            })

            :
            axios.delete(
                `${BASE_URL}/request/rejectfriend`
                ,{
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
            alert("There is a internal server error soon we resolve it");
        }
    }

    async function acceptRequest(item){
        const STATUS = await submitData(item,true);

        if(STATUS == 200){
            showpopup(item.name+" request added");
        }

        status(STATUS);
    }

    async function rejectRequest(item) {
        const STATUS = await submitData(item,false);

        if(STATUS == 200){
            showpopup(item.name+" request rejected")
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
                        <img src={item.profile_url? item.profile_url : "./defaultProfile.png"} alt="" />
                        </div>
                        <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{item.name}</p>
                        <FcCancel className="Home_notificon" id="Home_cancel"
                            onClick={()=>{rejectRequest(item)}} 
                        />
                        <FaCheck className="Home_notificon" id="Home_accept"
                            onClick={()=>{acceptRequest(item)}}
                        />
                    </div>
                ))
            }
        </>
    );
}
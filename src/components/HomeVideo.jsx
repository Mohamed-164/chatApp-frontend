

import { useContext } from 'react';
import '../css/Home.css';
import { LuVideo } from "react-icons/lu";
import { Dataprovider } from './App';
import { checkUserBlocked } from '../js/validatator';

export default function HomeVideo({list,setFriendprofile,check,search,setMakeCall}){

    const {DATA} = useContext(Dataprovider);
  
    return(
        <>
          { 
          
            list.length === 0?

              <div id="Home_chat_empty">
                <p id="Home_p_empty">Make friends to video call</p>
              </div>

                :

            list.filter((item)=>{
                if(checkUserBlocked(item.number,DATA.blockedlist)){
                  return false;
                }else if(search === ""){
                  return true;
                }else{
                  let Name = item.name;
                  return check(Name);
                }
              }).map((item,index)=>(
                <div key={index} className={`Home_contact 
                  ${DATA.theme === "LIGHT" ?'contact_white':'contact_dark'}`}>
                  <div className='Home_friendprofile profile_parent' onClick={()=>{setFriendprofile(item)}}>
                    <img src={item.profile_url? item.profile_url : "./defaultProfile.png"} 
                      alt=""
                      onError={(e)=>{
                        e.target.src = "./defaultProfile.png"
                      }} 
                    />
                  </div>
                  <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{item.name}</p>
                  {
                    item.status === "ACTIVE"?
                      <LuVideo className='HomeComponent_icon'
                        onClick={()=>{
                          setMakeCall({
                          call : true,
                          video : true,
                          data : item,
                          setMakeCall : setMakeCall
                        })}}
                      />
                      :
                      <></>
                  }
                </div>
            ))
          }
        </>
    );
}
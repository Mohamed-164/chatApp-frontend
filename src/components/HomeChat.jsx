import { useContext } from "react";
import { Dataprovider } from "./App";
import { checkUserBlocked, reduceName } from "../js/validatator";

export default function HomeChat({list,setFriendprofile,setChat,check,search}){

  const {DATA} = useContext(Dataprovider);

    return(
        <>
          { 
              list.length === 0?

              <div id="Home_chat_empty">
                <p id="Home_p_empty">Make friends to chat</p>
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
                  <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`} 
                      onClick={()=>{setChat(item)}}
                    >
                      {reduceName(item.name,20)}
                    </p>
                  {
                    item.unreadMsg > 0?
                    <span id="Home_unread_message">{item.unreadMsg}</span>
                    :
                    ""

                  }
                </div>
            ))
          }
        </>
    );
}
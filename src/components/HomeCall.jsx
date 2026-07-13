
import '../css/Home.css';
import { useContext } from 'react';
import { Dataprovider } from './App';
import { MdOutlineCall } from "react-icons/md";
import { checkUserBlocked } from '../js/validatator';

export default function HomeCall({list,setFriendprofile,check,search,setMakeCall}){

    const {DATA} = useContext(Dataprovider);
  
    return(
        <>
          { 
            list.length === 0?

              <div id="Home_chat_empty">
                <p id="Home_p_empty">Make friends to call</p>
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
                    <img src={item.profile_url? item.profile_url : "./defaultProfile.png"} alt="" />
                  </div>
                  <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{item.name}</p>
                  {
                    item.status === "ACTIVE"?
                      <MdOutlineCall className='HomeComponent_icon'
                        onClick={()=>{
                          setMakeCall({
                          call : true,
                          Bychat : false,
                          video : false,
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

import '../css/Home.css';
import { GoPlus } from "react-icons/go";
import { GrChat } from "react-icons/gr";
import { MdOutlineCall } from "react-icons/md";
import { LuVideo } from "react-icons/lu";
import { BiBell } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";
import { useContext, useRef, useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { Dataprovider } from './App';
import Profile from './Profile';
import HomeChat from './HomeChat';
import HomeCall from './HomeCall';
import HomeVideo from './HomeVideo';
import HomeNotification from './HomeNotification';
import Callwindow from './Callwindow';
import Chatbox from './ChatBox';
import SearchContact from './SearchContact';
import Settings from './Settings';

export default function Home({logout}) {

    const {defaultdata,DATA,setChatCache,setValidated,setData,showpopup} = useContext(Dataprovider);
    
    const list = DATA.friends;
    const[search,setsearch] = useState("");
    
    const[profile,setProfile] = useState({
      viewDB:false,
      data: defaultdata,
    });
    
    const[plus,setPlus] = useState(false);
    
    const[chatbox,setChatbox] = useState({
      chat:false,
      data:defaultdata
    });
    
    const[makeCall,setMakeCall] = useState({
      call : false,
      video : false,
      data : defaultdata,
    });
    
    const menu = useRef();
    const Input = useRef();
    
    const[homeComponent,setHomeComponent] = useState([true,false,false,false]);


    const[settings,setSettings] = useState(false);

    function dropdown(){
      menu.current.classList.toggle("active");
    }

    function ToggleInput(e){
      Input.current.classList.toggle("active");
      e.currentTarget.classList.toggle("Home_searchActive");
    }

    function searchFilter(e){
      setsearch(e.target.value);
    }

    function check(value){
      for(let i = 0; i < search.length; i++){
        let c = search.charAt(i).toLowerCase();
        if(c === value.charAt(i).toLowerCase()){
          return true;
        }
      }
      return false;
    }

    function setFriendprofile(item){
      setProfile({viewDB:true,data:item,setProfile : setProfile});
    }

    function setChat(item){
      setChatbox({chat:true,data:item,setChatbox : setChatbox});
    }

    return(
      <>
      { settings ? <Settings setSettings={setSettings}/>
        :
        plus? <SearchContact setPlus={setPlus}/>
          :
        makeCall.call? <Callwindow metadata={makeCall}/>
          :
        chatbox.chat?<Chatbox metadata={chatbox}/>
          :
        profile.viewDB? <Profile metadata={profile}/>
        :
        <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id='Home_Main'>
          <div className='Home_layout' id='Home_header'>
            <p id='Home_Headname'>Vibely</p>
            <RiSearchLine id='Home_search' onClick={ToggleInput}/>
            <input type="text" id='Home_searchBar' placeholder='search contact'
              onChange={searchFilter}
              ref={Input}
            />
            <BsThreeDotsVertical className='Chat_icon' id='Chat_settings' onClick={dropdown}/>
          </div>
          <div id='Home_options' ref={menu}>

            <div className='options'
              onClick={()=>{
                setProfile(
                {viewDB:true,data:DATA,setProfile : setProfile}
              )}}
            >
              <p className='options_p'>My profile</p>
              <BsChevronRight />
            </div>

            <div className='options'
              onClick={()=>{
                setSettings(true)
              }}>
              <p className='options_p'>Settings</p>
              <BsChevronRight />
            </div>

            <div className='options'
              onClick={()=>{
                setChatCache({});
                showpopup("logged out");
                setValidated(false);
                logout();
              }}
            >
              <p className='options_p'>Log out</p>
              <BsChevronRight />
            </div>

          </div>
          <div id='Home_middle' className={`${list.length === 0 ? "empty":""}`}>
            {  
              homeComponent[0]?
              <HomeChat list={list} setFriendprofile={setFriendprofile}
              setChat={setChat} check={check} search={search}
              />
                :
              homeComponent[1]?
              <HomeCall list={list} setFriendprofile={setFriendprofile}
                check={check} search={search} setMakeCall={setMakeCall}
              />
              :
              homeComponent[2]?
              <HomeVideo list={list} setFriendprofile={setFriendprofile}
                check={check} search={search} setMakeCall={setMakeCall}
              />
              :
              <HomeNotification check={check} search={search}/>
            }
          </div>
            <GoPlus id='Home_plus' onClick={()=>{setPlus(true)}}/>
          <div className='Home_layout' id='Home_footer'>
            <div >
              <GrChat  className={`Home_icon ${
                homeComponent[0]?"active_home_icon":""}`} 
                id='chat'
              onClick={(e)=>{
                setHomeComponent([true,false,false,false]);
              }}/>
            </div>
            <div>
              <MdOutlineCall className={`Home_icon ${
                homeComponent[1]?"active_home_icon":""}`} 
              id='call' 
              onClick={(e)=>{
                setHomeComponent([false,true,false,false]);
              }}/>
            </div>
            <div>
              <LuVideo className={`Home_icon ${
                homeComponent[2]?"active_home_icon":""}`}
              id='video' 
              onClick={(e)=>{
                setHomeComponent([false,false,true,false]);
              }}/>
            </div>
            <div>
              <BiBell className={`Home_icon ${
                homeComponent[3]?"active_home_icon":""}`} 
              id='bell' 
              onClick={(e)=>{
                setHomeComponent([false,false,false,true]);
              }}/>
              {
                DATA.requests.length > 0?
                <span 
                id='Home_notify_number'
                className={homeComponent[3] ? "Home_notify_active" : ""}
                  >{DATA.requests.length}</span>
                :
                <></>
              }
            </div>
          </div>
          
        </main>
        
      }
      </>
      
    );

  }
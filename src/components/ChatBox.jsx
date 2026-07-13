
import '../css/Chat.css';
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineCall } from "react-icons/md";
import { LuVideo } from "react-icons/lu";
import { BsChevronRight } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuSendHorizontal } from "react-icons/lu";
import { useContext, useEffect, useRef, useState } from 'react';
import { Dataprovider } from './App';
import Profile from './Profile';
import Callwindow from './Callwindow';
import { checkUserBlocked } from '../js/validatator';

export default function Chatbox({metadata}){
    
    const {defaultdata,DATA,setData,
            chatCache,setChatCache,sendMessagetoUser,
            showpopup,URLsubmit,stompClient,chatting
        } = useContext(Dataprovider);

    const friendId = metadata.data.number;

    const [typing,setTyping] = useState(false);
    const [online,setOnline] = useState(false);

    useEffect(()=>{

        stompClient.publish({
            destination : "/app/status.ping",
            body : JSON.stringify({myID :  DATA.number,friendID : friendId})
        });

        const typing = stompClient.subscribe(
              "/user/queue/message.typing",
              (response)=>{
                const data = JSON.parse(response.body);

                if(friendId === data.sender){
                    setTyping(data.typing);
                }


              }
        );

        const online = stompClient.subscribe(
            "/user/queue/incoming.friend.online",
            (response)=>{

                const data = JSON.parse(response.body);
            
                if(friendId === data.number){
                    setOnline(true);
                }

            }
        );

        const offline = stompClient.subscribe(
            "/user/queue/incoming.friend.offline",
            (response)=>{

                const data = JSON.parse(response.body);

                if(friendId === data.number){
                    setOnline(false);
                }

            }
        )

        return ()=>{
            typing.unsubscribe();
            online.unsubscribe();
            offline.unsubscribe();
        }
    },[])

    
    const [profile,setProfile] = useState({
        viewDB : false,
        data:metadata.data
    });
    
    
    useEffect(()=>{
        
        function checkUserAvailable(){
    
            for(let c of DATA.friends){
                if(c.number === friendId){
                    return true;
                }
            }
    
            return false;
    
        }
        let isfriend = checkUserAvailable();
    
        if(!isfriend){
            metadata.setChatbox({chat : false,data : defaultdata});
        }

    },[DATA.friends]);


    const menu = useRef();
    const [messageData,setMessageData] = useState([]);


    async function setReadedLog() {
        const STATUS = await submitData("POST","/modify","/readedMessage",friendId);

        if(STATUS === 200){
            setData(prev => ({
                ...prev,
                friends: prev.friends.map(friend =>
                    friend.number === friendId
                        ? { ...friend, unreadMsg: 0 }
                        : friend
                )
            }));
        }
    }

    useEffect(() => {

        async function getParticularData(id) {

            const res = await URLsubmit("GET","/search/getChat",
                {
                    params: {
                        myId: DATA.number,
                        friendId: id
                    }
                }
            );

            setChatCache(prev => ({
                ...prev,
                [friendId]: res.data
            }));
        }

        if (!chatCache[friendId]) {
            getParticularData(friendId);
        }


        setReadedLog();

    }, [friendId]);
    
    useEffect(() => {
        setMessageData(chatCache[friendId] || []);
    }, [chatCache, friendId]);

    const[makeCall,setMakeCall] = useState({
      call : false,
      video : false,
      data : defaultdata,
    });



    function expand(e){
        e.target.style.height = "auto";

        e.target.style.height =
        e.target.scrollHeight + "px";

    }

    function dropdown(){
        menu.current.classList.toggle("active");
    }

    async function submitData(method,controlPoint,Endpoint,id) {

        let res;

        switch(method){
            case "PUT":

                res = await URLsubmit(method,controlPoint+Endpoint,
                    {
                        myID:DATA.number,
                        friendID:id
                    }
                );
            break;
            case "DELETE":
                res = await URLsubmit(method,controlPoint+Endpoint,
                    {   data:{
                            myID:DATA.number,
                            friendID:id
                        }
                    }
                );
            break;

            case "POST":
                res = await URLsubmit(method,controlPoint+Endpoint,
                    {
                        myID:DATA.number,
                        friendID:id
                    }
                );
            break;

            default :
                console.warn("Invalid method to http");
            break;
        }

        return res.status;

    }

    async function blockFriend() {
        const STATUS = await submitData("PUT","/modify","/blockuser",friendId);

        if(STATUS === 200){
            setData(prev => ({
                ...prev,
                blockedlist : [...prev.blockedlist,metadata.data]
            }));
            showpopup(metadata.data.name+" blocked");
        }

    }

    async function unblockFriend() {
        const STATUS = await submitData("PUT","/modify","/unblockuser",friendId);

        if(STATUS === 200){
            setData(prev => ({
                ...prev,
                blockedlist : prev.blockedlist.filter(
                    user => user.number !== metadata.data.number
                )
            }));    
            showpopup(metadata.data.name+" unblocked");       
        }

    }

    async function removeFriend() {
        const STATUS = await submitData("DELETE","/modify","/removefriend",friendId);

        if(STATUS === 200){
            setData(prev =>({
                ...prev,
                friends : prev.friends.filter(
                    user => user.number !== metadata.data.number
                )
            }));
            metadata.setChatbox({chat:false,data:defaultdata});
            showpopup(metadata.data.name+" removed");
        }

    }

    async function deleteChat() {
        const STATUS = await submitData("DELETE","/modify","/deletechat",friendId);

        if(STATUS === 200){
            if(chatCache[friendId]){
                setChatCache(prev => ({
                    ...prev,
                    [friendId]: []
                }));
            }
            showpopup("chat deleted");
        }
    }

    

    function send(){

        const textarea = document.getElementById('textarea');

        if(textarea.value !== ""){
            const data = {sender:DATA.number,receiver:friendId,message: textarea.value};
            sendMessagetoUser(data);
            setChatCache(prev=>({
                ...prev,
                [friendId] : [...(prev[friendId] || []),data]
            }));
            textarea.value = "";
            textarea.style.height = "auto";
        }

    }

    function setLogWhenGoBack(e){
        e.currentTarget.style.pointerEvents = "none";
        setReadedLog();
    }



    return(
        <>
        {
            profile.viewDB?<Profile metadata = {profile}/>
            :
            makeCall.call? <Callwindow metadata={makeCall}/>
            :
            <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id='Chat_main'>
            <div id="Chat_header">
                <FaArrowLeft id='Chat_leftarrow' className='Chat_head'
                onClick={(e)=>{
                    setLogWhenGoBack(e);
                    metadata.setChatbox({chat:false,data:defaultdata});
                }}/>
                <div id='Chat_ImgDiv' className='profile_parent' 
                    onClick={()=>{                        
                        setProfile({
                            viewDB : true,   
                            data:metadata.data,
                            setProfile : setProfile,
                        });
                    }}
                >
                    <img src={metadata.data.profile_url? metadata.data.profile_url : "./defaultProfile.png"} alt="" />
                </div>
                <div id='Chat_name'>
                    <p  className='Chat_head'

                        onClick={()=>{setProfile({
                            viewDB : true,     
                            data:metadata.data,
                            setProfile : setProfile,
                        })}}

                    >
                        {metadata.data.name}
                    </p>
                    {   
                        typing?
                        <p id='status'>typing</p>
                        : 
                        online?
                        <p id='status'>online</p>
                        :
                        <></>
                    }
                </div>
                {checkUserBlocked(friendId,DATA.blockedlist) || metadata.data.status === "DEACTIVE"?
                    <></>
                    :
                    <>
                        <MdOutlineCall className='Chat_icon' id='Chat_phone'
                            onClick={()=>{setMakeCall({
                                call : true,
                                video : false,
                                data : metadata.data,
                                setMakeCall : setMakeCall,
                            })}}
                        />
                        <LuVideo className='Chat_icon' id='Chat_video'
                            onClick={()=>{setMakeCall({
                                call : true,
                                video : true,
                                data : metadata.data,
                                setMakeCall : setMakeCall,
                            })}}
                        />
                    </>
                }
                <BsThreeDotsVertical className='Chat_icon' id='Chat_settings' onClick={dropdown}/>
            </div>
            <div id='Chat_option' ref={menu}>

                <div className='options'
                    onClick={()=>{setProfile({
                        viewDB : true,
                        data : metadata.data,
                        setProfile : setProfile,
                    })}}>
                    <p className='options_p'>View profile</p>
                    <BsChevronRight />
                </div>

                <div className='options' onClick={deleteChat}>
                    <p className='options_p'>Clear chat</p>
                    <BsChevronRight />
                </div>

                <div className='options'onClick={removeFriend}>
                    <p className='options_p'>Remove friend</p>
                    <BsChevronRight />
                </div>

                <div className='options' onClick={()=>{
                    checkUserBlocked(metadata.data.number,DATA.blockedlist)?
                        unblockFriend()
                        :
                        blockFriend();
                }}>
                    {
                        checkUserBlocked(metadata.data.number,DATA.blockedlist)?
                        <p className='options_p'>Unblock</p>
                        :
                        <p className='options_p'>Block</p>
                    }
                <BsChevronRight />
                </div>
            </div>
            <div id='Chat_message'>
                {
                    messageData.map((obj,index) => (
                        <div key={index} className='Chat_section'
                            id={obj.sender === DATA.number?"Chat_me":"Chat_friend"}
                        >
                            <p className="Chat_p" >{obj.message}</p>
                        </div>
                    ))
                }
                {   
                    typing?
                    <div className='Chat_section' id='Chat_friend'>
                        <p className='Chat_p' id='dots'>
                            <span className='dot'>.</span>
                            <span className='dot'>.</span>
                            <span className='dot'>.</span>
                        </p>
                    </div>
                    :
                    <></>
                }
            </div>
            {
                checkUserBlocked(friendId,DATA.blockedlist) || metadata.data.status === "DEACTIVE"?
                    <></>
                :
                    <div id='Chat_textInput'>
                        <textarea onInput={expand} placeholder='enter a message'
                            id='textarea'
                            onFocus={()=>{
                                chatting(
                                    {
                                        sender : DATA.number,
                                        receiver : friendId,
                                        typing : true
                                    }
                                );
                            }}
                            onBlur={()=>{
                                chatting(
                                    {
                                        sender : DATA.number,
                                        receiver : friendId,
                                        typing : false
                                    }
                                );
                            }}
                        ></textarea>
                        <LuSendHorizontal id='sendMessage'
                            onClick={send}
                        />
                    </div>

            }
        </main>
        }
        </>        
    );
}
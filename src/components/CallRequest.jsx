
import { useContext, useEffect, useRef, useState } from 'react';
import '../css/CallRequest.css';
import { MdOutlineLocalPhone } from "react-icons/md";
import { Dataprovider } from './App';
import { getContact } from '../js/validatator';
import { LuVideo } from 'react-icons/lu';
import VideoCall from './VideoCall';

export default function CallRequest({callerdata,controller,setCallerData,setIncomingCall}){

    const {DATA} = useContext(Dataprovider);

    const userdata = getContact(callerdata.sender,DATA.friends);

    const [VideoFrame,setVideoFrame] = useState(false);

    const[callclicked,setCallClicked] = useState(false);

    const audio = useRef();
    const Info_dom = useRef();

    const decline_dom = useRef();
    const hangup_dom = useRef();

    useEffect(()=>{

        controller.onHangup = (msg)=>{

            
            if(callerdata.connectionType === "video"){
                setCallerData({});
                setIncomingCall(false);
            }else{

                if(hangup_dom.current){
                    hangup_dom.current.classList.remove('before');
                    
                    hangup_dom.current.classList.add('disable');
                }

                if(Info_dom.current){
                    Info_dom.current.textContent = msg;
                    Info_dom.current.style.color = "red";
                }
                
                if(decline_dom.current){
                    decline_dom.current.classList.add('disable');
                }
    
                setTimeout(() => {
    
                    setCallerData({});
                    setIncomingCall(false);

                }, 5000);
            }
            
    
        }

        if(callerdata.connectionType === "audio"){

            controller.onStream = (stream)=>{
                audio.current.srcObject = stream;
            }

            controller.onStateChange = (state)=>{
                Info_dom.current.textContent = state;
                if(state === "disconnected"){
                    Info_dom.current.style.color = "red";
                }
            }
        }

        return ()=>{

            if(callerdata.connectionType === "audio"){

                controller.onStream = null;
                controller.onStateChange = null;
            }

            controller.onHangup = null;
        }
    },[]);


    async function setAudioCall(e){

        if(callclicked){

            controller.hangup();
            
        }else{
            await controller.createAnswer(callerdata.data);
            setCallClicked(true);
        }

    }


    return(

        <>
        {
            VideoFrame ?
            <VideoCall offer={callerdata.data}/>
            :
            <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Request_main">
                <div id='Call_imgContainer'>
                    <div id="Call_ImgDiv" className='profile_parent'>
                        <img src={callerdata.data.profile_url? callerdata.data.profile_url : "./defaultProfile.png"} alt="" />
                    </div>
                    <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} id='Call_name'>{userdata.name}</p>
                    <div id='Call_section'>
                        <MdOutlineLocalPhone id='Call_phone'/>
                        <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} id='Call_number'>{userdata.number}</p>
                    </div>
                </div>
                <div id='status_div'>
                    <p id='Status' ref={Info_dom}>Incoming call</p>
                </div>
    
                {
                    callerdata.connectionType === "audio"? 
                    <audio id='remoteAudio' autoPlay hidden ref={audio}></audio>
                    :
                    ""
                }
    
                <div id='Request_footer'>
                {
                    !callclicked ?
                        callerdata.connectionType === "audio"?
                            <div className='Request_buttons'>
                                <MdOutlineLocalPhone id='Req_decline' 
    
                                    ref={decline_dom}
        
                                    onClick={()=>{controller.declineCall()}
                                }/>
                                <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"}>Decline</p>
                            </div>
                            :
                            <div className='Request_buttons'>
                                <LuVideo id='Req_decline'
                                    ref={decline_dom}
                                    onClick={()=>{controller.declineCall()}}
                                />
                                <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"}>Decline</p>
                            </div>
                    :
                        <></>
                }
                {
                    callerdata.connectionType === "audio"?
                        <div className='Request_buttons'>
                            <MdOutlineLocalPhone className={`Call_icon 
                                ${!callclicked ? "before"
                                    : ""
                                } 
                                ${
                                    callclicked ? "callPhone" : ""
                                }`} id='Request_attend' 
        
                                ref={hangup_dom}
        
                                onClick={(e)=>{
                                    setAudioCall(e);
                                }}
                            />
                            <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} >{!callclicked?"Attend" : "Hangup"}</p>
                        </div>
                        :
                        <div className='Request_buttons'>
                            <LuVideo className='Call_icon before' id='Request_attend'
                                onClick={()=>{
                                    controller.createAnswer(callerdata.data);
                                    setVideoFrame(true);
                                }}
                                ref={hangup_dom}
                            />
                            <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} >Attend</p>
                        </div>
                }
                </div>
            </main>

        }
        </>

    );
}
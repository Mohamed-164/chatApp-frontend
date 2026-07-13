import { useContext, useEffect, useRef, useState } from 'react';
import '../css/Callwindow.css';
import { FaArrowLeft } from "react-icons/fa6";
import { MdPersonOutline } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuVideo } from "react-icons/lu";
import { Dataprovider } from './App';
import VideoCall from './VideoCall';

export default function Callwindow({metadata}){

    const{DATA,audioCall,videoCall} = useContext(Dataprovider);

    const[status,setStatus] = useState({status :"",color : "cadetblue"});

    const [VideoFrame,setVideoFrame] = useState(false);

    const [callCliked,setCallClicked] = useState(false);

    const Info_dom = useRef();

    const audio_dom = useRef();

    useEffect(()=>{

        if(metadata.video){

            videoCall.onHangup = (msg)=>{
                
                setVideoFrame(false);
                setStatus({status:msg,color :"red"});
        
                setTimeout(()=>{
                    setStatus({status:"",color : "cadetblue"});
                },5000);
            }

        }else{
            
            audioCall.onHangup = (msg)=>{
                
                setStatus({status:msg,color :"red"});
        
                setTimeout(()=>{
                    setStatus({status:"",color : "cadetblue"});
                },5000);
        
                setCallClicked(false);
            }
    
            audioCall.onStream = (stream)=>{
                audio_dom.current.srcObject = stream;
            }

            audioCall.onStateChange = (state)=>{
                setStatus({status:state,color : "cadetblue"});
            }

        }

        return ()=>{

            if(metadata.video){

                videoCall.onHangup = null;

            }else{

                audioCall.onHangup = null;
                audioCall.onStream = null;
                audioCall.onStateChange = null;
            }

        }

    },[]);


    function setAudioCall(){

        if(callCliked){

            audioCall.hangup()
            setCallClicked(false);
            
        }else{
            audioCall.setReceiverId(metadata.data.number);

            audioCall.createOffer();
            setCallClicked(true);

        }
    }


    return(
        <>
        {
            VideoFrame ?
            <VideoCall />
            :
            <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
                <div id="Profile_header" className='Profile_outerDiv'>
                    {
                        callCliked?""
                            :
                        <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                            onClick={()=>{
                                metadata.setMakeCall({
                                call : false,
                                video : false,
                                data : metadata.data,
                                setMakeCall : metadata.setMakeCall
                            })}} 
                        />
                    }
                    <p className='Profile_head'>{metadata.video ?"Video call":"Audio call"}</p>
                </div>

                <div id='Call_imgContainer'>
                    <div id="Call_ImgDiv" className='profile_parent'>
                        <img src={metadata.data.profile_url? metadata.data.profile_url : "./defaultProfile.png"} alt="" />
                    </div>
                        <p id='Call_name'>{metadata.data.name}</p>
                    <div id='Call_section'>
                        <MdOutlineLocalPhone id='Call_phone'/>
                        <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} id='Call_number'>{metadata.data.number}</p>
                    </div>
                </div>  

                <div>
                    <p id='Call_infoP' style={{color:status.color}}>{status.status}</p>
                </div>

                <audio id='remoteAudio' autoPlay hidden ref={audio_dom}></audio>

                <div id='Call_footer'>
                    {
                        metadata.video?
                        <LuVideo className='Call_icon' id='Call_MakeCall'

                        onClick={async()=>{
                            videoCall.setReceiverId(metadata.data.number);
                            await videoCall.createOffer();
                            setVideoFrame(true);
                        }}

                        />
                        :
                        <MdOutlineLocalPhone className={`Call_icon ${
                                callCliked ? "callPhone" : ""
                            }`} id='Call_MakeCall'
                            onClick={(e)=>{
                                setAudioCall();
                            }}
                        />
                    }
                    <p id='Call_Makecall_p'>{callCliked?"Hang up":"Make call"}</p>
                </div>

            </main>

        }
        </>
    );
}
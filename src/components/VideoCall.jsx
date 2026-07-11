
import { useContext, useEffect, useRef, useState } from 'react';
import '../css/VideoCall.css';
import { LuVideo } from "react-icons/lu";
import { Dataprovider } from './App';

export default function VideoCall(){

    const {videoCall} = useContext(Dataprovider);

    const [bigFrame,setBigFrame] = useState("remote");

    const timeoutref = useRef(null);

    const remoteVideo = useRef();
    const localVideo = useRef();
    const button = useRef();

    useEffect(()=>{

        if(videoCall.STREAM){
            localVideo.current.srcObject = videoCall.STREAM;
        }

        videoCall.onLocalVideo = (stream)=>{
            localVideo.current.srcObject = stream;
        }

        videoCall.onStream = (stream)=>{
            remoteVideo.current.srcObject = stream;
        }

        return ()=>{
            videoCall.onStream = null;
            clearTimeout(timeoutref.current);
            videoCall.onLocalVideo = null;
        };

    },[]);

    function show(e){
        button.current.classList.toggle('show');

        bigFrame === "remote" ?
            localVideo.current.classList.toggle('show')
        :
            remoteVideo.current.classList.toggle('show');

        timeoutref.current = setTimeout(() => {
                
                button.current.classList.remove('show');
    
                bigFrame === "remote" ?
                    localVideo.current.classList.remove('show')
                    :
                    remoteVideo.current.classList.remove('show');


        }, 5000);

    }

    return(
        <main id="Video_main">
            <video className={bigFrame === "local"?'smallScreen':'bigScreen'}
                id="remoteVideo"
                onClick={(e)=>{
                    if(bigFrame === "remote"){
                        show(e);
                    }else{
                        setBigFrame("remote");
                    }
                }}
                ref={remoteVideo}
                autoPlay
                playsInline
            ></video>
            <video className={bigFrame === "remote"?'smallScreen':'bigScreen'}
                id="localVideo"  ref={localVideo}
                onClick={(e)=>{
                    if(bigFrame === "local"){
                        show(e);
                    }else{
                        setBigFrame("local");
                    }
                }}
                 autoPlay
                 playsInline
                 muted
            ></video>
            <LuVideo  id='Video_hangup' ref={button}
                onClick={()=>{
                    videoCall.hangup();
                }}
            />
        </main>
    );
}

import '../css/About.css';
import { FaArrowLeft } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { GrTechnology } from "react-icons/gr";
import { MdCopyright } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { useContext } from 'react';
import { Dataprovider } from './App';

export default function About({setAbout}){

    const{DATA} = useContext(Dataprovider);

    return(
    <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">

        <div id="Profile_header" className='Profile_outerDiv'>
            <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                onClick={()=>{
                    setAbout(false);
                }}
            />
            <p className='Profile_head'>About</p>
        </div>

        <div className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="About_middle">
            <div className="About_div">
                <IoInformationCircleOutline className='About_icon'/>
                <h3 style={{fontFamily:'sans-serif',color:'#0097A7'}}>
                    App info
                </h3>
            </div>
            <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                This application is a private communication platform designed to help people say connected with trusted contacts. Unlike traditional messaging platforms where anyone can send messages, communication in this app is based on mutual friendship. Users must send and accept friend requests before they can exchange messages,make audio calls or start video calls
            </article>
            <div className="About_div">
                <MdOutlineFeaturedPlayList className='About_icon'/>
                <h3 style={{fontFamily:'sans-serif',color:'#0097A7'}}>
                    Features
                </h3>
            </div>
            <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                The application provides real-time messaging,friend management,account privacy controls,and secure audio/video calling powered by WebRTC technology. Users can block unwanted contacts,manage their friends list,clear conversation,and control who can interact with them.
            </article>
            <div className="About_div">
                <GoGoal className='About_icon'/>
                <h3 style={{fontFamily:'sans-serif',color:'#0097A7'}}>
                    Goal
                </h3>
            </div>
            <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                The goal of this project is to combine the privacy-focused approach of friend-based social platforms with the simplicity of modern messaging applications.By limiting communication to approvad friends,the app helps create a more secure and personal communication experience.
            </article>
            <div className="About_div">
                <GrTechnology className='About_icon'/>
                <h3 style={{fontFamily:'sans-serif',color:'#0097A7'}}>
                    Technology
                </h3>
            </div>
            <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                This project was built using React for the frontend,Spring boot for backend services,WebSocket technology for real-time communication, and WebRTC peer-to-peer real time communication signaling system used for calling features. 
            </article>

        </div>
        <div className={DATA.theme === "LIGHT"?'bg_dark' : 'bg_white'} id='About_footer'>
            <MdCopyright className={DATA.theme === "LIGHT"?"p_dark":"p_white"} id='copyright_icon'/>
            <p className={DATA.theme === "LIGHT"?"p_dark":"p_white"} id='copy_p'>Copyright 2026 - All rights are not reserved you can use if you want,but please don't</p>
        </div>

    </main>
    );
}

import '../css/Profile.css';
import '../css/Settings.css';
import { TbEdit } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { GoSun } from "react-icons/go";
import { ImBlocked } from "react-icons/im";
import { RiMoonFill } from "react-icons/ri";
import { BsChevronRight } from "react-icons/bs";
import { LuTrash2 } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineAirplanemodeActive } from "react-icons/md";
import { MdOutlineAirplanemodeInactive } from "react-icons/md";
import { GrKey } from "react-icons/gr";
import { useContext, useState } from 'react';
import Blockedlist from './Blockedlist';
import AccountDeletion from './AccountDeletion';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Deactivate from './Deactivate';
import About from './About';
import { Dataprovider } from './App';

export default function Settings({setSettings}){

    const{DATA,setData,URLsubmit,showpopup} = useContext(Dataprovider);

    const [blockedlist,setBlockedList] = useState(false);
    const [editprofile,setEditProfile] = useState(false);
    const [changePassword,setChangePassword] = useState(false);
    const [deactivate,setDeactivate] = useState(false);
    const [accountDelete,setAccountDelete] = useState(false);
    const [about,setAbout] = useState(false);


    async function submitRequest(endPoint,body) {

        const res = await URLsubmit("POST","/settings"+endPoint,body);

        return res.status;

    }

    const[themeload,setThemeLoad] = useState(false);
    const[visibleload,setVisibleLoad] = useState(false);

    async function setTheme() {

        setThemeLoad(true);

        setData((prev)=>({
            ...prev,
            theme : DATA.theme === "LIGHT"? "DARK" : "LIGHT"
        }));

        const status = await submitRequest("/theme",{
            number : DATA.number,
            enums : DATA.theme === "LIGHT"? "DARK" : "LIGHT"
        });
        
        setThemeLoad(false);
        if(status > 200){
            setData((prev)=>({
                ...prev,
                theme : DATA.theme === "LIGHT"? "DARK" : "LIGHT"
            }));
            showpopup("failed update");
        }
        
    }

    async function setVisibility() {


        setVisibleLoad(true);

        setData((prev)=>({
            ...prev,
            visibility : DATA.visibility === "SHOW" ? "HIDE" : "SHOW"
        }));

        const status = await submitRequest("/visibility",{
            number : DATA.number,
            enums : DATA.visibility === "SHOW" ? "HIDE" : "SHOW"
        });

        if(status > 200){
            setData((prev)=>({
                ...prev,
                visibility : DATA.visibility === "SHOW" ? "HIDE" : "SHOW"
            }));
            showpopup("failed update");
        }
        
    }

    return(
        <>
        {
            blockedlist?
                < Blockedlist setBlockedList={setBlockedList} />
            :
            editprofile?
                <EditProfile setEditProfile={setEditProfile} submitRequest={submitRequest}/>
            :
            changePassword?
                <ChangePassword setChangePassword={setChangePassword} submitRequest={submitRequest}/>
            :
            deactivate?
                <Deactivate setDeactivate={setDeactivate} submitRequest={submitRequest}/>
            :
            accountDelete?
                <AccountDeletion setAccountDelete={setAccountDelete}/>
            :
            about?
                <About setAbout={setAbout}/>
            :
            <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
                <div id="Profile_header" className='Profile_outerDiv'>
                    <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                        onClick={()=>{
                            setSettings(false);
                        }}
                    />
                    <p className='Profile_head'>Settings</p>
                </div>

                <div id='Settings_middle'>

                    <div className='Setting_options'
                        onClick={setTheme} style={{pointerEvents: themeload?"none":"auto"}}
                    >
                        <IoColorPaletteOutline className='Settings_icon'/>
                        <p className='Settings_p'>Theme</p>
                        <div className={DATA.theme === "LIGHT"?"_white":"_dark"} id='theme_toggle'>
                            <span 
                                className={DATA.theme === "LIGHT"?"_white":"_dark"} id='theme_span'>
                                {
                                    DATA.theme === "LIGHT"?
                                    <GoSun id='white_theme'/>
                                    :
                                    <RiMoonFill id='dark_theme'/>

                                }
                            </span>
                        </div>
                    </div>
                    <div className='Setting_options'
                        onClick={setVisibility} style={{pointerEvents: visibleload?"none":"auto"}}
                    >
                        {
                            DATA.visibility === "SHOW" ?
                            <VscEyeClosed className='Settings_icon'/>
                            :
                            <VscEye className='Settings_icon'/>
                        }
                        <p className='Settings_p'>{DATA.visibility === "SHOW"?"Hide online":"Show online"}</p>
                        <div className={DATA.theme === "LIGHT"?"_white":"_dark"} id='theme_toggle'>
                            <span className=
                            {`${DATA.theme === "LIGHT"?"_white":"_black"} 
                                ${DATA.visibility === "HIDE"?"hide" :""}`} 
                                id='visibility_span'
                            >
                                {
                                    DATA.visibility === "SHOW"?
                                    <VscEyeClosed 
                                        style={
                                            {color:DATA.theme === "LIGHT"?"rgb(54, 69, 79)" : "white"}
                                        }
                                    />
                                    :
                                    <VscEye 
                                        style={
                                            {color:DATA.theme === "LIGHT"?"rgb(54, 69, 79)" : "white"}
                                        }
                                    />
                                }
                            </span>
                        </div>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            setBlockedList(true);
                        }}
                    >
                        <ImBlocked className='Settings_icon'/>
                        <p className='Settings_p'>Blocked lists</p>
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            if(DATA.status === "ACTIVE"){
                                setEditProfile(true);
                            }
                        }}
                    >
                        <TbEdit className='Settings_icon'/>
                        <p className='Settings_p'>Edit profile</p>
                        {
                            DATA.status === "DEACTIVE"? 
                                <p className='deactive_p'>Inactive</p> : <></>
                        }
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            if(DATA.status === "ACTIVE"){
                                setChangePassword(true);
                            }
                        }}
                    >
                        <GrKey className='Settings_icon'/>
                        <p className='Settings_p'>Change password</p>
                        {
                            DATA.status === "DEACTIVE"? 
                                <p className='deactive_p'>Inactive</p> : <></>
                        }
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            setDeactivate(true);
                        }}
                    >
                        {
                            DATA.status === "ACTIVE"?
                                 <MdOutlineAirplanemodeActive className='Settings_icon'/>
                                 :
                                 <MdOutlineAirplanemodeInactive className='Settings_icon'/>
                        }
                        <p className='Settings_p'>
                            {DATA.status === "ACTIVE"?"Deactivate account" : "Activate account"}
                        </p>
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            if(DATA.status === "ACTIVE"){
                                setAccountDelete(true);
                            }
                        }}
                    >
                        <LuTrash2 className='Settings_icon' />
                        <p className='Settings_p'>Delete account</p>
                        {
                            DATA.status === "DEACTIVE"? 
                                <p className='deactive_p'>Inactive</p> : <></>
                        }
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                    <div className='Setting_options'
                        onClick={()=>{
                            setAbout(true);
                        }}
                    >
                        <IoInformationCircleOutline className='Settings_icon'/>
                        <p className='Settings_p'>About</p>
                        <BsChevronRight className='Settings_arrow'/>
                    </div>

                </div>
                
            </main>

        }
        </>
    );

}
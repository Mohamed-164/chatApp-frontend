
import { useContext } from 'react';
import '../css/Profile.css';
import { FaArrowLeft } from "react-icons/fa6";
import { MdPersonOutline } from "react-icons/md";
import { MdMailOutline } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { Dataprovider } from './App';

export  default function Profile({metadata}) {

    const{DATA} = useContext(Dataprovider);

    return(
      <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">

        <div id="Profile_header" className='Profile_outerDiv'>
            <FaArrowLeft id='Profile_leftarrow' className='Profile_head' 
              onClick={()=>{
                metadata.setProfile({viewDB:false,data:metadata.data})
              }}
            />
            <p className='Profile_head'>Profile</p>
        </div>

        <div id='Profile_imgContainer' className='Profile_outerDiv'>
          <div id="Profile_ImgDiv" className='profile_parent'>
            <img src={
              metadata.data.profile_url === null ?
            "./defaultProfile.png" : metadata.data.profile_url
            } 
            alt="" />
          </div>
        </div>

        <div className='Profile_outerDiv'>
          <div className='Profile_innerDiv'>
            <MdPersonOutline className='Profile_icon'/>
            <h3 className='Profile_h4'>Name</h3>
          </div>
          <p className={`Profile_p ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{metadata.data.name}</p>
        </div>
        <div className='Profile_outerDiv'>
          <div className='Profile_innerDiv'>
            <MdOutlineLocalPhone className='Profile_icon'/>
            <h3 className='Profile_h4'>Phone</h3>
          </div>
          <p className={`Profile_p ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{metadata.data.number}</p>
        </div>
        <div className='Profile_outerDiv'>
          <div className='Profile_innerDiv'>
            <MdMailOutline className='Profile_icon'/>
            <h3 className='Profile_h4'>Email Address</h3>
          </div>
          <p className={`Profile_p ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{metadata.data.mail}</p>
        </div>

      </main>
    );

  }
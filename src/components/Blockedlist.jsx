
import '../css/Home.css';
import '../css/Profile.css';
import '../css/Blockedlist.css'
import { useContext } from 'react';
import { Dataprovider } from './App';
import { FaArrowLeft } from "react-icons/fa6";
import { FcCancel } from 'react-icons/fc';


export default function Blockedlist({setBlockedList}){

    const {defaultdata,DATA,setData,URLsubmit,showpopup} = useContext(Dataprovider);

    const blockList = DATA.blockedlist;

    async function submitData(id) {

        const res = await URLsubmit("PUT","/modify/unblockuser",
            {
                myID:DATA.number,
                friendID:id
            }
        );

        return res.status;
        
    }

    async function unblockFriend(id) {

        const STATUS = await submitData(id);

        if(STATUS == 200){
            setData(prev => ({
                ...prev,
                blockedlist : prev.blockedlist.filter(
                    user => user.number !== id
                )
            }));   
            showpopup("unblocked");        
        }else{
            showpopup("failed to update");
        }

    }

    return(
        <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
            <div id="Profile_header" className='Profile_outerDiv'>
                <FaArrowLeft id='Profile_leftarrow' className='Profile_head' 
                    onClick={()=>{setBlockedList(false)}}
                />
                    <p className='Profile_head'>Blocked lists</p>
            </div>
            <div id='Home_middle'>
                {   blockList.map((item,index)=>(
                    <div key={index} className={`Home_contact 
                        ${DATA.theme === "LIGHT" ?'contact_white':'contact_dark'}`}>
                        <div className='Home_friendprofile profile_parent'>
                        <img src="./defaultProfile.png" alt="" 
                            onError={(e)=>{
                                e.target.src = "./defaultProfile.png"
                            }}
                        />
                        </div>
                        <p className={`Home_friendname ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>{item.name}</p>
                        <div id='unblock_div'>
                            <FcCancel id="unblock_icon"/>
                            <p id='unblock_p'onClick={()=>{unblockFriend(item.number)}}>unblock</p>
                        </div>
                    </div>
                ))
                }
            </div>
        </main>
    )
}

import '../css/Profile.css';
import '../css/SearchContact.css';
import { Dataprovider } from "./App";
import { GoPlus } from "react-icons/go";
import { RiSearchLine } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa6";
import { checkExistsContact, reduceName } from '../js/validatator';
import { MdOutlineLocalPhone } from "react-icons/md";
import { useContext, useRef, useState } from 'react';

export default function SearchContact({setPlus,setHomeComponent}){

    const {DATA,showpopup,URLsubmit} = useContext(Dataprovider);
    
    const [showRequest,setRequest] = useState(true);
    const [requested,setRequested] = useState(false);
    const [requestLoading,setRequestLoading] = useState(false);

    const [loading,setLoading] = useState(false);

    const[SEARCHDATA,setSearchData] = useState(null);
    const STATUS = useRef();

    const[existsRequest,setExistsRequest] = useState(false);

    async function submit() {

        const PHONE = document.getElementById('Search_inputs').value;
        const [ExistsFriend,friendData] = checkExistsContact(PHONE,DATA.friends);
        const [ExistsRequest,requestData] = checkExistsContact(PHONE,DATA.requests);

        if(ExistsRequest){setExistsRequest(true)}
        
        if(DATA.number === Number(PHONE) || ExistsFriend || ExistsRequest){


            const data = {
                number : (
                        ExistsFriend ? friendData.number :
                        ExistsRequest ? requestData.number : DATA.number
                    ),
                name : (
                        ExistsFriend ? friendData.name : 
                        ExistsRequest ? requestData.name : DATA.name
                    ),
                mail : (
                        ExistsFriend ? friendData.mail : 
                        ExistsRequest ? requestData.mail : DATA.mail
                    ),
                profile_url : (
                        ExistsFriend ? friendData.profile_url : 
                        ExistsRequest ? requestData.profile_url : DATA.profile_url
                    )
            }

            setLoading(false);
            setSearchData(data);
            setRequest(false);

            return 800;
        }else if(PHONE === "" || isNaN(Number(PHONE)) || !/^\d{10}$/.test(PHONE)){
            return 400;
        }else{

                const res = await URLsubmit("POST","/search/search-contact",
                    {
                        myID:DATA.number,
                        friendID:PHONE
                    }      
                );
                
                if(res.data !== ""){
                    setSearchData(res.data);
                }else{
                    setSearchData(null);
                }
                if(res.status === 200){
                    setLoading(false);
                    setRequest(true);
                }
            return res.status;  
        }
    }

    function setStatus(msg,color){

        if(STATUS.current != null){
            STATUS.current.textContent = msg; 
            STATUS.current.style.color = color; 
        }

    }


    async function submitData() {

        setSearchData(null);
        removeStatus();
        setLoading(true);
        const SUCCESS = await submit();

        if(SUCCESS === 404){
            setLoading(false);
            setStatus("User not found","#0097A7");
        }else if(SUCCESS === 400){
            setLoading(false);
            setStatus("Enter a valid number","red");
        }else if(SUCCESS === 409){
            setLoading(false);
            setRequested(true);
        }else if(SUCCESS!== 800 && SUCCESS !== 200){
            setLoading(false);
            setStatus("server error soon the issue will be solved","#1a6bf7");
        }
    }


    async function addRequest() {
        
        const res = await URLsubmit("POST","/search/addRequest",
            {
                myID:DATA.number,
                friendID:SEARCHDATA.number
            }
        );

        if(res.status === 200){
            setRequestLoading(false);
            setRequest(false);
            setRequested(true);
            showpopup("request sended");
        }else if(res.status > 400){
            setRequestLoading(false);
            showpopup("server error");
        }

    }

    async function removeRequest() {
        const res = await URLsubmit("POST","/search/removeRequest",
            {
                myID:DATA.number,
                friendID:SEARCHDATA.number
            }
        );

        if(res.status === 200){
            setRequestLoading(false);
            setRequest(true);
            setRequested(false);
            showpopup("request removed");
        }else{
            setRequestLoading(false);
            showpopup("server error");
        }
    }


    function removeStatus(){
        if(STATUS.current != null){
            STATUS.current.textContent = "";
        }
    }


    return(
    <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
        <div id="Profile_header" className='Profile_outerDiv'>
            <FaArrowLeft id='Profile_leftarrow' className='Profile_head' 
                onClick={()=>{setPlus(false)}}
            />
            <p className='Profile_head'>Search Contact</p>
        </div>
        <div className='Search_segment'>
            <MdOutlineLocalPhone className='Search_icon'/>
            <input id='Search_inputs' type="tel" placeholder='Phone Number'
            onFocus={removeStatus}
            />
            <RiSearchLine id='searchIcon' onClick={submitData}/>
        </div>
        {
            loading?
            <p id='Search_dots'>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
            </p>
            :
            <></>
        }
        <p ref={STATUS} id='Search_p'></p>
        {
            SEARCHDATA !== null?
            <div className={DATA.theme === "LIGHT"?"contact_white":"contact_dark"} 
            id="Search_contact">
                <div id='Search_profile' className='profile_parent'>
                    <img src="./defaultProfile.png" alt="" />
                </div>
                <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} id="Search_friendname">
                    {
                       reduceName(SEARCHDATA.name,10)
                    }
                </p>
                {
                    existsRequest ?
                    <div id='requested' 
                        style={{backgroundColor:"#0097A7",color:"aliceblue"}}
                        onClick={()=>{
                            setPlus(false);
                            setHomeComponent([false,false,false,true]);
                        }}
                    >
                        <p>{"view request >>"}</p>
                    </div>
                    :
                    showRequest && !requested?
                    <div id='requested' 
                        style={{backgroundColor:"#0097A7",color:"aliceblue"}}
                        onClick={()=>{
                            if(!requestLoading){
                                addRequest();
                                setRequestLoading(true);
                            }
                        }}
                    >
                        {
                            requestLoading?
                            <p>
                                <span className='request_dot'>.</span>
                                <span className='request_dot'>.</span>
                                <span className='request_dot'>.</span>
                            </p>
                            :
                            <p>request</p>
                        }
                    </div>
                        :
                    requested?
                    <div id='requested' 
                        className={DATA.theme === "LIGHT"?"r_white":"r_dark"}
                        onClick={()=>{
                            if(!requestLoading){
                                removeRequest();
                                setRequestLoading(true);
                            }

                        }}
                    >
                        {
                            requestLoading?
                            <p>
                                <span className='request_dot'>.</span>
                                <span className='request_dot'>.</span>
                                <span className='request_dot'>.</span>
                            </p>
                            :
                            <p>requested</p>
                        }
                    </div>
                    :
                    <></>
                }
            </div>
            :
            <></>
        }
    </main>
    );
}
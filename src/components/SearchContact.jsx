
import '../css/Profile.css';
import '../css/SearchContact.css';
import { Dataprovider } from "./App";
import { GoPlus } from "react-icons/go";
import { RiSearchLine } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa6";
import { checkExistsContact } from '../js/validatator';
import { MdOutlineLocalPhone } from "react-icons/md";
import { useContext, useRef, useState } from 'react';

export default function SearchContact({setPlus}){

    const {DATA,showpopup,URLsubmit} = useContext(Dataprovider);
    
    const [showPlus,setShowPlus] = useState(true);

    const[SEARCHDATA,setSearchData] = useState(null);
    const STATUS = useRef();

    async function submit() {

        const PHONE = document.getElementById('Search_inputs').value;
        const {ExistsFriend,friendData} = checkExistsContact(PHONE,DATA.friends);
        
        if(DATA.number === Number(PHONE) || ExistsFriend){


            const data = {
                number : (ExistsFriend ? friendData.number : DATA.number),
                name : (ExistsFriend ? friendData.name : DATA.name),
                mail : (ExistsFriend ? friendData.mail : DATA.mail),
                profile_url : (ExistsFriend ? friendData.profile_url : DATA.profile_url)
            }

            setSearchData(data);
            setShowPlus(false);

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
                    setShowPlus(true);
                }
            return res.status;  
        }
    }



    async function submitData() {

        const SUCCESS = await submit();

        if(SUCCESS === 404){
           STATUS.current.textContent = "User not found"; 
           STATUS.current.style.color = "#0097A7"; 
        }else if(SUCCESS === 400){
            STATUS.current.textContent = "Enter a valid number";
            STATUS.current.style.color = "red";
        }else if(SUCCESS === 409){
            setShowPlus(false);
        }else if(SUCCESS!== 800 && SUCCESS !== 200){
            STATUS.current.textContent = "There is a server error soon we solve the issue"; 
            STATUS.current.style.color = "#1a6bf7"
        }
    }


    async function addRequest(id) {
        
        const res = await URLsubmit("POST","/search/addfriend",
            {
                myID:DATA.number,
                friendID:id
            }
        );

        if(res.status === 200){
            setShowPlus(false);
            showpopup("request sended");
        }
        return res.status;

    }

    async function addFriend() {

        const STATUS = await addRequest(SEARCHDATA.number);

        if(STATUS > 400){
            alert("There is a internal server error soon we solve it");
        }
        
    }


    function removeStatus(){
        STATUS.current.textContent = "";
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
        <p ref={STATUS} id='Search_p'></p>
        {
            SEARCHDATA !== null?
            <div className={DATA.theme === "LIGHT"?"contact_white":"contact_dark"} 
            id="Search_contact">
                <div id='Search_profile' className='profile_parent'>
                    <img src="./defaultProfile.png" alt="" />
                </div>
                <p className={DATA.theme === "LIGHT"?"p_white":"p_dark"} id="Search_friendname">{SEARCHDATA.name}</p>
                {
                    showPlus?<GoPlus id='Search_plus' 
                        onClick={addFriend}
                    />
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
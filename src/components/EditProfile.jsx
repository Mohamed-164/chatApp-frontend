import { useContext, useEffect, useRef, useState } from 'react';
import '../css/EditProfile.css';
import { TbEdit } from "react-icons/tb";
import { LuTrash2 } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa6";
import { validateMail, validateName } from '../js/validatator';
import { Dataprovider } from './App';

export default function EditProfile({setEditProfile,submitRequest}){

    const{DATA,setData,showpopup,setPopUp} = useContext(Dataprovider);

    const defaultImg = "./defaultProfile.png";

    const [image, setImage] = useState(DATA.profile_url !== null?DATA.profile_url : defaultImg);

    useEffect(()=>{
        document.getElementById('Edit_name').value = DATA.name;
        document.getElementById('Edit_mail').value = DATA.mail;
    },[]);

    
    function handleFile(e) {
        const file = e.target.files[0];
        
        if (file) {
            setImage(URL.createObjectURL(file));
        }else if(DATA.profile_url !== null){
            setImage(DATA.profile_url);
        }else {
            setImage(defaultImg);
        }
    }

    const removebtn = useRef();
    const editbtn = useRef();

    function enableBtn(){
        editbtn.current.disabled = false;
        removebtn.current.disabled = false;
    }

    function diabledBtn(){
        editbtn.current.disabled = true;
        removebtn.current.disabled = true;
    }

    async function editSubmit(){

        diabledBtn();
        
        const file = document.getElementById('fileInput').files[0];
        const name = document.getElementById('Edit_name').value;
        const mail = document.getElementById('Edit_mail').value;
        
        if(!validateName(name)){

            showpopup("Invalid name");
            enableBtn();
            
            return;
        } 

        if(!validateMail(mail)){

            showpopup("Invalid mail");
            enableBtn();

            return;
        } 

        
        const formData = new FormData();
        formData.append("id",DATA.number);

        if(file){
            formData.append("image",file);
        }
        
        if(name !== DATA.name){
            formData.append("name", name);
        }
        if(mail !== DATA.mail){
            formData.append("mail", mail);
        }

        setPopUp({show : true,msg:"processing..."});
        const code = await submitRequest("/editprofile",formData);

        if(code === 200){
            showpopup("profile updated");

            setData((prev)=>({
                ...prev,
                profile_url : file?URL.createObjectURL(file) : DATA.profile_url,
                name : name,
                mail : mail
            }));
            enableBtn();

        }else if(code === 400){
            showpopup("Invalid file format");
            enableBtn();
        }else{
            showpopup("server error");
            enableBtn();
        }

    }

    async function removeprofile(){

        diabledBtn();

        if(DATA.profile_url === null){
            enableBtn();
            return;
        } 

        const formData = new FormData();
        formData.append("id",DATA.number);

        setPopUp({show : true,msg:"processing"});
        const code = await submitRequest("/removeProfile",formData);

        if(code === 200){
            showpopup("profile removed");
            setData((prev)=>(
                {
                    ...prev,
                    profile_url : null
                }
            ));
            setImage(defaultImg);
            enableBtn();
        }else{
            showpopup("server error");
            enableBtn();
        }
        
    }

    return(
        <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
            <div id="Profile_header" className='Profile_outerDiv'>
                <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                    onClick={()=>{
                        setPopUp({show : false,msg : ""});
                        setEditProfile(false);
                    }}
                />
                <p className='Profile_head'>Edit Profile</p>
            </div>

            <div id='Profile_imgContainer' className='Profile_outerDiv'>
                <div id="Profile_ImgDiv" className='profile_parent'>
                    <img id='img' src={image} alt="" />
                </div>
            </div><br></br>

            <div className='Edit_div'>
                <div className="file-box">
                    <label htmlFor="fileInput">Choose profile</label>
                    <input type="file" id="fileInput" onChange={handleFile} accept='image/png,image/jpeg'/>
                    <div id='removeprofile'>
                        <LuTrash2 id='Edit_removedp'/>
                        <input ref={removebtn}
                            id='Edit_remove' type="submit" value="remove profile" 
                            onClick={removeprofile}
                        />
                    </div>
                </div>
            </div>

            <div className='Edit_div'>
                <h3 className={DATA.theme === "LIGHT"?"p_white":"p_dark"} >Enter a new name : </h3>
                <textarea className={`Edit_textarea ${DATA.theme === "LIGHT"?"p_white _white":"p_dark _dark"}`} id="Edit_name"
                    onBlur={(e)=>{
                        const value = e.target.value;
                        if(value === ""){
                            e.target.value = DATA.name;
                            e.target.nextElementSibling.textContent = "";
                            return;
                        }else if(validateName(value)){
                            e.target.nextElementSibling.textContent = "";
                        }else{
                            e.target.nextElementSibling.textContent = "Name should contains only letters,Above 3 and less than 20 characters";
                            e.target.nextElementSibling.style.color = "red";
                        }
                    }}
                ></textarea>
                <p className='Edit_p'></p>
            </div>

            <div className='Edit_div'>
                <h3 className={DATA.theme === "LIGHT"?"p_white":"p_dark"}  >Enter a new mail : </h3>
                <textarea className={`Edit_textarea ${DATA.theme === "LIGHT"?"p_white _white":"p_dark _dark"}`} id="Edit_mail"
                    onBlur={(e)=>{
                        const value = e.target.value;
                        if(value === ""){
                            e.target.value = DATA.mail;
                            e.target.nextElementSibling.textContent = "";
                            return;
                        }else if(validateMail(value)){
                            e.target.nextElementSibling.textContent = "";
                        }else{
                            e.target.nextElementSibling.textContent = "Invalid mail";
                            e.target.nextElementSibling.style.color = "red";
                        }   
                    }}
                ></textarea>
                <p className='Edit_p'> </p><br></br>
            </div>
            <div className='Edit_div'>
                <p className={`Edit_p ${DATA.theme === "LIGHT"?"p_white":"p_dark"}`}>Note : you can leave as it is if you don't want to change, we update what is actually changed..automatically</p>
            </div>

            <div id='Edit_footer'>
                <TbEdit id='Edit_icon'/>
                <input ref={editbtn}
                    id='Edit_profile' type="submit" value="Edit profile" onClick={editSubmit}
                />
            </div>


        </main>
    );
}
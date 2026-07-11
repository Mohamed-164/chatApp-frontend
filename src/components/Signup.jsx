
import '../css/Authenticate.css'
import axios from 'axios';
import { MdPersonOutline } from "react-icons/md";
import { MdMailOutline } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuLockKeyhole } from "react-icons/lu";
import { useEffect, useState ,useRef, useContext} from 'react';
import { validateName,validateMail,validatePassword,validatePhone} from '../js/validatator';
import { Dataprovider } from './App';

export default function Signup({signup,setSignup}){

    const {BASE_URL,showpopup,URLsubmit,setPopUp} = useContext(Dataprovider);

    const DEFAULT_PNAME = "For Example : MS Dhoni";
    const DEFAULT_PMAIL = "For Example : msdhoni@gmail.com";
    const DEFAULT_NUMBER = "Number not start with (0,1,2,3,4,5)";
    const DEFAULT_PASSWORD = "password must use combination of alphanumeric";
    const DEFAULT_CONFIRMPASSWORD = "Retype again to confirm";

    let NAME = true;
    let MAIL = true;
    let NUM = true;

    const Upass = useRef("");
    const STATUS = useRef();

    function setStatus(){
        STATUS.current.textContent ="";
    }

    const submitbtn = useRef();

    function enablebtn(){
        submitbtn.current.disabled = false;
    }

    function disablebtn(){
        submitbtn.current.disabled = true;
    }

    async function submit() {

        const Name = document.getElementById("uname").value;
        const email = document.getElementById("mail").value;
        const phone = document.getElementById("pno").value;
        const pass = document.getElementById("pass").value;
        const cpass = document.getElementById("cpass").value;

        if(!validateName(Name) || !validateMail(email) || 
            !validatePhone(phone) || !validatePassword(pass) || pass !== cpass){
            return 400;
        }else{

            setPopUp({show : true ,msg:"signing up..."})
            const res = await URLsubmit("POST","/auth/signup",
                {
                    number:phone,
                    name:Name,
                    mail:email,
                    password:pass
                }
            );

            return res.status;
        }
    }

    async function submitData(){
        disablebtn();
        const SUCCESS = await submit();
        if(SUCCESS == 201){
            enablebtn();
            setSignup(false);
            showpopup("signed up successfully");
        }else if(SUCCESS == 401){
            STATUS.current.textContent = "User with this phone number already exists"
            STATUS.current.style.color = "red";
            enablebtn();
            showpopup("Already exists");
        }else if(SUCCESS == 400){
            STATUS.current.textContent = "Please enter valid credentials";
            STATUS.current.style.color = "red"; 
            enablebtn();
            showpopup("Invalid credentials");
        }else{
            enablebtn();
            showpopup("server error");
        }
    }


    function defaultmsg(dmsg,e){
        e.target.nextElementSibling.textContent = dmsg;
        e.target.nextElementSibling.style.color = "#6a0dad";
    }

    function OnBlur(e,con){
        if(e.target.value === "" || con){
            e.target.nextElementSibling.textContent = "";
            e.target.nextElementSibling.style.color = "black";
        }
    }

    function showError(errmsg,e){
        e.target.nextElementSibling.textContent = errmsg;
        e.target.nextElementSibling.style.color = "red"; 
    }

    function BlurName(e){
        if(NAME && e.target.value.length < 3){
            NAME = false;
            showError("Name atleast have more than 3 characters",e);
        }
        OnBlur(e,NAME);
    }

    function BlurMail(e){
        if(MAIL && e.target.value !== ""){
            let mail = e.target.value.split('@');
            let name = mail[0];
            e.target.value = name+"@gmail.com";

            e.target.nextElementSibling.textContent = "Please verify once again";
            e.target.nextElementSibling.style.color = "#0d95ad";

            setTimeout(()=>{
                OnBlur(e,MAIL);
            },5000);
        }else if(MAIL && e.target.value === ""){
            OnBlur(e,MAIL);
        }
    }

    function BlurPhone(e){
        let value = e.target.value;
        if(NUM){
            if(value.length < 10 || value.length > 10){
                NUM = false;
                showError("Invalid Number",e);
            }
        }
        OnBlur(e,NUM);
    }

    function BlurPassword(e){
        let pass = e.target.value;

        let EIGHT = pass.length >= 8;
        let UPPER = /[A-Z]/.test(pass);
        let LOWER = /[a-z]/.test(pass);
        let NUMBER = /[0-9]/.test(pass);
        let SYMBOL = /[^A-Za-z0-9]/.test(pass);
        if(!EIGHT && pass !== ""){
            showError("Password atleast have 8 characters",e);
            return;
        }else if((!SYMBOL || !UPPER || !LOWER || !NUMBER) && e.target.value !== ""){
            showError("Passoword atleast have one symbol,number,capital,small letters",e);
            return;
        }
        OnBlur(e,true);
    }

    function BlurCpass(e){
        if(e.target.value!== "" && e.target.value !== Upass.current){
            showError("password not matched",e);
            return;
        }
        OnBlur(e,true);
    }

    function username(e) {
        
        setStatus();

        let value = e.target.value;

        if(value === ""){
            defaultmsg(DEFAULT_PNAME,e);    
        }

        for (let i = 0; i < value.length; i++) {
            let char = value.charCodeAt(i);
            if ((char < 65 || char > 90) && (char < 97 || char > 122)) {
                NAME = false;
                showError("Name should only contain letters",e);
                break;
            }else{
                NAME = true;
            }
        }

        if(NAME){
            defaultmsg(DEFAULT_PNAME,e);
        }

    }

    function mail(e){

        setStatus();

        let value = e.target.value;

        let usermail = value;

        if(value === ""){
            defaultmsg(DEFAULT_PMAIL,e);
        }else if(value.startsWith('@')){
            showError("Enter a proper mail id",e);
            return;
        }else if(value.includes('@')){
            let mname = value.split("@");
            if(mname.length > 2){
                MAIL = false;
                showError("Invalid mail",e);
                return;
            }
            usermail = mname[0];
        }

        for(let i = 0; i < usermail.length; i++){

            let char = value.charCodeAt(i);
             if (((char < 65 || char > 90) && (char < 97 || char > 122))&&(char < 48 || char > 57)) {
                MAIL = false;
                showError("mailId should only have numbers and letters",e);
                break;
             }else{
                MAIL = true;
             }
        }

        if(MAIL){
            defaultmsg(DEFAULT_PMAIL,e);
        }

    }

    function phone(e){
        setStatus();

        let value = e.target.value;

        if(value === ""){
            defaultmsg(DEFAULT_NUMBER,e);
        }else{

            for(let i = 0; i < value.length; i++){
                
                let char = value.charCodeAt(i);
                if(char < 48 || char > 57){
                    NUM = false;
                    showError("please enter a valid mobile number",e);
                    break;
                }else if(value.startsWith('0') || value.startsWith('1') || value.startsWith('2') ||
                    value.startsWith('3') || value.startsWith('4') || value.startsWith('5')){
                    NUM = false;
                    showError("Indian standard number doesn't start with "+value.charAt(i),e);
                    break;
                }else{
                    NUM = true;
                }
            }
        }
        
        

        if(NUM){
            defaultmsg(DEFAULT_NUMBER,e);
        }
    }

    function password(e){

        setStatus();

        let value = e.target.value;

        Upass.current = value;
        
        if(value === ""){
            defaultmsg(DEFAULT_PASSWORD,e);
        }

        defaultmsg(DEFAULT_PASSWORD,e);
    }

    function onfocusCpass(e){
        setStatus();
        defaultmsg(DEFAULT_CONFIRMPASSWORD,e);
    }


    return(
        <>
            <div className='Authen_segment'>
                <MdPersonOutline  className='Authen_icon'/>
                <input className='Authen_inputs' id='uname' type="text" placeholder='Full Name' 
                    onFocus={username}
                    onBlur={BlurName}
                    onChange={username}
                />
                <p className='Authen_p' id='Pname'></p>
            </div>
            <div className='Authen_segment'>
                <MdMailOutline className='Authen_icon'/>
                <input className='Authen_inputs' id='mail' type="text" placeholder='Email Address'
                    onFocus={mail}
                    onBlur={BlurMail}
                    onChange={mail}
                />
                <p className='Authen_p' id='Pmail'></p>
            </div>
            <div className='Authen_segment'>
                <MdOutlineLocalPhone className='Authen_icon'/>
                <input className='Authen_inputs' id='pno' type="tel" placeholder='Phone Number'
                    onFocus={phone}
                    onBlur={BlurPhone}
                    onChange={phone}
                />
                <p className='Authen_p' id='Ppno'></p>
            </div>
            <div className='Authen_segment'>
                <LuLockKeyhole className='Authen_icon'/>
                <input className='Authen_inputs' id='pass' type="password" placeholder='Password'
                    onFocus={password}
                    onBlur={BlurPassword}
                    onChange={password}
                />
                <p className='Authen_p' id='Ppass'></p> 
            </div>
            <div className='Authen_segment'>
                <LuLockKeyhole className='Authen_icon'/>
                <input className='Authen_inputs' id='cpass' type="password" placeholder='Confirm Password'
                    onFocus={onfocusCpass}
                    onBlur={BlurCpass}
                />
                <p className='Authen_p' id='PCpass'></p>
            </div>
            <div>
                <input className='Authen_submit' type="submit" value="SIGN UP" ref={submitbtn} onClick={submitData}/>
                <p className='Authen_p' ref={STATUS}></p><br></br>   
                <p>Do you Already have an account ?<a href="#" onClick={()=>{setSignup(false)}}>  Log In</a></p>
            </div>
        </>
    );
}
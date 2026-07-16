
import '../css/Authenticate.css';
import { MdOutlineLocalPhone } from "react-icons/md";
import { LuLockKeyhole } from "react-icons/lu";
import { useContext, useRef, useState } from 'react';
import { Dataprovider } from './App';

export default function Login({signup,setSignup,setToken}){

    
    const {BASE_URL,setData,setValidated,showpopup,URLsubmit,setPopUp} = useContext(Dataprovider);

    const [loading,setLoading] = useState(false);

    const STATUS = useRef();

    async function submit() {
        const PHONE = document.getElementById('Lno').value;
        const PASS = document.getElementById('Lpass').value;

        if(PHONE == "" || PASS == "" || isNaN(Number(PHONE)) || !/^\d{10}$/.test(PHONE)){
            return 400;
        }else{
            
            setPopUp({show : true,msg : "connecting..."});
            const res = await URLsubmit("POST","/auth/login",
                {
                    phonenumber:PHONE,
                    password:PASS
                }
            );

            if(res.status === 200){
                setToken(res.data.token);
                setData(res.data.userDto);
            }

            return res.status;
        }
    }

    const loginbtn = useRef();

    function enableBtn(){
        loginbtn.current.disabled = false;
    }

    function disablebtn(){
        loginbtn.current.disabled = true;
    }

    async function submitData() {

        disablebtn();
        const SUCCESS = await submit();

        if(SUCCESS === 400 || SUCCESS === 403){
            STATUS.current.textContent = "Invalid Credentials";
            STATUS.current.style.color = "red"; 
            showpopup("Unauthorized access");
            enableBtn();
        }else if(SUCCESS === 200){
            setPopUp({show : true,msg : "logging in..."});
            setLoading(true);
            setValidated(true);
        }else if(SUCCESS === 409){
            STATUS.current.textContent = "someone using your account";
            STATUS.current.style.color = "red";
            showpopup("logged by someone");
            enableBtn();
        }else{
            enableBtn();
            showpopup("server error");
        }
    }

    function removeStatus(){
        STATUS.current.textContent = "";
    }

    return (
        <>
        <div>
            <div className='Authen_segment'>
                <MdOutlineLocalPhone className='Authen_icon'/>
                <input className='Authen_inputs' id='Lno' type="tel" placeholder='Phone Number'
                onClick={removeStatus}
                />
                <p className='Authen_p'></p>
            </div>
            <div className='Authen_segment'>
                <LuLockKeyhole className='Authen_icon'/>
                <input className='Authen_inputs' id='Lpass' type="password" placeholder='Password'
                onClick={removeStatus}
                />
                <p className='Authen_p'></p> 
            </div>
        </div>
        <div>
            <input className='Authen_submit' type="submit" value="LOGIN" ref={loginbtn} onClick={submitData}/>
            <p className='Authen_p' ref={STATUS}></p><br></br>   
            {
                loading?
                <></>
                :
                <p>Don't have an account ?<a href="#" onClick={()=>{setSignup(true)}}>Sign up</a></p>
            }
        </div>
        </>
    );
}
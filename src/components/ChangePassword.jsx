
import '../css/EditProfile.css';
import { TbEdit } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { validatePassword } from '../js/validatator';
import { useContext, useEffect, useRef } from 'react';
import { Dataprovider } from './App';

export default function ChangePassword({setChangePassword,submitRequest}){

    const{DATA,showpopup,setPopUp} = useContext(Dataprovider);

    const newpass = useRef();

    useEffect(()=>{
        newpass.current = "";
    });

    async function submit(){

        const oldpass = document.getElementById('oldpass');
        const newpass = document.getElementById('newpass');
        const status = document.getElementById('status');

        setPopUp({show : true,msg : "processing..."});
        const code = await submitRequest("/changePassword",{
                number : DATA.number,
                oldPassword : oldpass.value,
                newPassword : newpass.value
        });

        if(code >= 403){
           status.textContent = "Invalid password";
           status.style.color = "red";
           showpopup("Invalid credentials");
        }else{
            const confirmpass = document.getElementById('confirmpass');

            oldpass.value = "";
            newpass.value = "";
            confirmpass.value = "";

            showpopup("password changed");

        }

    }
    
    return(
        <main className={DATA.theme === "LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">

            <div id="Profile_header" className='Profile_outerDiv'>
                <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                        onClick={()=>{
                            setChangePassword(false);
                        }}
                />
                <p className='Profile_head'>Change password</p>
            </div>

            <div className="Edit_div">
                <h3 className={DATA.theme === "LIGHT"?"p_white":"p_dark"}>Enter old password :</h3>
                <textarea className={`Edit_textarea ${DATA.theme === "LIGHT"?"p_white _white":"p_dark _dark"}`} id="oldpass"
                    onFocus={(e)=>{
                        e.currentTarget.nextElementSibling.textContent = "";
                    }}
                />
                <p id='status' className="Edit_p"></p>
            </div>

            <div className="Edit_div">
                <h3 className={DATA.theme === "LIGHT"?"p_white":"p_dark"}>Enter new password :</h3>
                <textarea className={`Edit_textarea ${DATA.theme === "LIGHT"?"p_white _white":"p_dark _dark"}`} id="newpass"
                    onBlur={(e)=>{
                        const value = e.target.value;
                        if(value === ""){
                            e.target.nextElementSibling.textContent = "";
                            return;
                        }else if(validatePassword(value)){
                            newpass.current = value;
                            e.target.nextElementSibling.textContent = "";
                        }else{
                            e.target.nextElementSibling.textContent = "password must contain atleast one number,symbol,small and capital letter and 8 or above characters";
                            e.target.nextElementSibling.style.color = "red";
                        }
                    }}
                />
                <p className="Edit_p"></p>
            </div>

            <div className="Edit_div">
                <h3 className={DATA.theme === "LIGHT"?"p_white":"p_dark"}>Enter for confirm password :</h3>
                <textarea className={`Edit_textarea ${DATA.theme === "LIGHT"?"p_white _white":"p_dark _dark"}`} id="confirmpass"
                    onBlur={(e)=>{
                        const value = e.target.value;
                        if(value === "" && newpass.current === ""){
                            e.target.nextElementSibling.textContent = "";
                            return;
                        }else if(value === "" && newpass.current !== ""){
                            e.target.nextElementSibling.textContent = "Must retype password again";
                            e.target.nextElementSibling.style.color = "red";
                        }else if(newpass.current === value){
                            e.target.nextElementSibling.textContent = "";
                        }else{
                            e.target.nextElementSibling.textContent = "Retype the password correclty";
                            e.target.nextElementSibling.style.color = "red";
                        }
                    }}
                />
                <p className="Edit_p"></p>
            </div>

            <div id='Edit_footer'>
                <TbEdit id='change_pass_icon'/>
                <input id='change_pass' type="submit" value="Change password"
                    onClick={submit}
                />
            </div>

        </main>
    );

}
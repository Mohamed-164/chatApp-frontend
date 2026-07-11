
import { useContext, useState } from 'react';
import '../css/AccountDeletion.css';
import '../css/Popup.css';
import { createPortal } from 'react-dom';
import { FaArrowLeft } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";
import { Dataprovider } from './App';
import PasswordTab from './PasswordTab';

function ConfirmDelete({confirm,setConfirm,theme,submit}){

    confirm.element.disabled = true;

    const[passtab,setPassTab] = useState(false);

    function goback(){
        setPassTab(false);
        confirm.element.disabled = false;
        setConfirm({show : false,element : ""});
    }



    return createPortal(

        <>
        {
            passtab? <PasswordTab goback={goback} submit={submit}/> 
            : 
            <div className={theme === "LIGHT"?"bg_dark":"bg_white"} id='delete_confirm'>
                <p className={theme === "LIGHT"?"p_dark":"p_white"}>Are you sure to delete your account?</p>
                <div id='delete_buttons'>
                    <input id='yes' type="submit" value="Yes" onClick={()=>{setPassTab(true)}}/>
                    <input id='no' type="submit" value="No" 
                    onClick={goback}/>
                </div>
            </div>
        }
        </>,
    document.body);
}

export default function AccountDeletion({setAccountDelete}){

    const{DATA,showpopup,URLsubmit} = useContext(Dataprovider);

    const[confirm,setConfirm] = useState({show : false,element : ""});

    async function deleteAccount(body) {
        

        const res = await URLsubmit("DELETE","/auth/deleteaccount",{
                data:body
            });
        
        return res.status;

    }

    async function submit(status,pass){

        const code = await deleteAccount({
            number : DATA.number,
            password : pass
        });

        if(code === 200){

            setConfirm(false);

            const back = document.getElementById('Profile_leftarrow');
            back.style.display = "none";

            showpopup("Account deleted restarting...");

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }else if(code === 403){
            status.textContent = "Invalid password";
            status.style.color = "red";
        }else{
            showpopup("Interal server error");
        }

    }

    return(
        <>
        {
            confirm.show?
            <ConfirmDelete confirm={confirm} 
                setConfirm={setConfirm} theme={DATA.theme} submit={submit}
            />
            : ""
        }

        <main className={DATA.theme ==="LIGHT"?'bg_white' : 'bg_dark'} id="Profile_main">
            <div id="Profile_header" className='Profile_outerDiv'>
                <FaArrowLeft id='Profile_leftarrow' className='Profile_head'
                    onClick={()=>{
                        setAccountDelete(false);
                    }}
                />
                <p className='Profile_head'>Account deletion</p>
            </div>

            <div id='delete_middle'>

                <center>
                    <h3 
                        id='Settings_heading'
                        style={{fontFamily:'sans-serif',color:'#0097A7'}}
                    >Deleting your vibely account</h3>
                </center>
                <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'lighter'}}>
                    If you want to take a break from vibely,you can temporarily deactivate this account ,benefits no one can saw you in search contact,calls and message you, if you want to permanently delete your account you can !, we respect your privacy and free will, thanks for joining us..,we welcomes you anytime.
                </article>
                <h3 id='note' style={{fontFamily:'sans-serif',color:'#0097A7',fontWeight:'bolder'}}>Note :</h3>
                <article className={DATA.theme === "LIGHT"?"p_white":"p_dark"} style={{fontFamily:'sans-serif',textAlign:'center',fontWeight:'revert'}}>
                    Deleting your account is permanent and cannot be undone.Once your account is deleted, all of your personal data will be removed from the application. you will be removed from your friend's contact lists,pending friend requests, and blocked-user lists.Any conversations that involved your account will be permanently deleted for both you and the other participants.After deletion,your account information,messages,and connections will no longer be recoverable
                </article>
            </div>

            <div id='Account_footer'>
                <LuTrash2 id='delete_icon'/>
                <input id='delete' type="submit" value="Delete account" 
                onClick={(e)=>{setConfirm({show : true,element : e.currentTarget})}}
                />
            </div>


        </main>
        </>
    );

}
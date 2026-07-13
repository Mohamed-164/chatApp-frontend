import '../css/App.css';
import {createContext, useEffect, useRef, useState} from 'react';
import Home from './Home';
import Authenticate from './Authenticate';
import {Client} from "@stomp/stompjs";
import CallRequest from './CallRequest';
import { callController } from '../js/callController';
import InfoTab from './InfoTab';
import Popup from './Popup';
import axios from 'axios';

const Dataprovider = createContext();

  const defaultdata = {
      name: "username",
      mail: "username@gmail.com",
      phone:1234567890,
      pass: "12345",
      id: "FlNvFxH2gWk"
    }
   
  let stompClient;

  function App() {

    const BASE_URL = process.env.REACT_APP_BACKEND_URL;
    const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

    const[validated,setValidated] = useState(false);

    const[socketConnected,setSocketConnected] = useState(false);

    const[DATA,setData] = useState({});
    const[token,setToken] = useState("");

    const[popup,setPopUp] = useState({
      show : false,
      msg : ""
    });

    const [info,setInfo] = useState(false);

    const [chatCache,setChatCache] = useState({});

    const [incomingCall,setIncomingCall] = useState(false);

    const [callerdata,setCallerData] = useState({});

    const audioCall = useRef();
    const videoCall = useRef();

    useEffect(()=>{
      if(!validated) return;

      showpopup("logged in");

      stompClient = new Client({
          brokerURL:WEBSOCKET_URL,

          connectHeaders: {
            username: DATA.number,
            Authorization : `Bearer ${token}`
          },
          
          onConnect:()=>{

            audioCall.current = new callController(stompClient,false);

            audioCall.current.setMyId(DATA.number);

            videoCall.current = new callController(stompClient,true);

            videoCall.current.setMyId(DATA.number);

            setSocketConnected(true);

            stompClient.subscribe("/user/queue/incoming.conflict.login",(response)=>{
              setInfo(true);
            });

            stompClient.subscribe("/user/queue/incoming.friend.accept",(response)=>{

              const data = JSON.parse(response.body);

              setData((prev)=>(
                {
                  ...prev,
                  friends : [...prev.friends,data]
                }
              ));

              showpopup(data.name+" accepted request");

            });

            stompClient.subscribe("/user/queue/incoming.friend.request",(response)=>{

              const data = JSON.parse(response.body);

              setData((prev)=>(
                {
                  ...prev,
                  requests : [...prev.requests,data]
                }
              ));

            });

            stompClient.subscribe("/user/queue/incoming.friend.remove",(response)=>{

              const data = JSON.parse(response.body);

              setData((prev)=>(
                {
                  ...prev,
                  friends : prev.friends.filter(f=>f.number !== data.number)
                }
              ));

            });

            stompClient.subscribe("/user/queue/incoming.friend.profile",(response)=>{

              const data = JSON.parse(response.body);

              setData((prev)=>(
                {
                  ...prev,
                  friends : prev.friends.map((f)=>{
                    if(f.number === data.number){
                      f.profile_url = data.profile_url;
                      f.name = data.name;
                      f.mail = data.mail
                    }
                    return f;
                  })
                }
            ));

            });

            stompClient.subscribe("/queue/incoming.conflict.login",(response)=>{

            });

            stompClient.subscribe("/user/queue/delete.friend",(response)=>{

              const data = JSON.parse(response.body);

              setData((prev) =>(
                {
                  ...prev,
                  friends : prev.friends.filter(f=>f.number !== data.number),
                  blockedlist : prev.blockedlist.filter(
                    user => user.number !== data.number
                  )
                }
              ));

            });

            stompClient.subscribe("/user/queue.delete.request",(response)=>{
              
              const data = JSON.parse(response.body);

              setData((prev)=>(
                {
                  ...prev,
                  requests : prev.requests.filter(u => u.number !== data.number)
                }
              ));

            });
            
            stompClient.subscribe(
              "/user/queue/messages",
              (response) => {

                const data = JSON.parse(response.body);

                  setChatCache(prev=>({
                    ...prev,
                      [data.sender] : [...(prev[data.sender] || []),data]
                    }));
                  }
            );

            stompClient.subscribe(
              "/user/queue/message.unread",
              (response)=>{

                const data = JSON.parse(response.body);

                setData((prev)=>({
                  ...prev,
                  friends : prev.friends.filter((f)=>{

                    if(f.number === data.friendId){
                      f.unreadMsg = data.unread;
                    }
                    return true;
                  })
                }));

              }
            )

            stompClient.subscribe(
              "/user/queue/chat.call.offer",
              (response)=>{
                const data = JSON.parse(response.body);

                setCallerData(data);

                setIncomingCall(true);

                if(data.connectionType === "audio"){

                  audioCall.current.setReceiverId(data.sender);
                  const sub = audioCall.current.socketOnHangup();
                  audioCall.current.subscription.push(sub);

                }else{
                  videoCall.current.setReceiverId(data.sender);
                  const sub = videoCall.current.socketOnHangup();
                  videoCall.current.subscription.push(sub);
                }

              }
            );

          }
        
      });

      stompClient.activate();

      stompClient.onWebSocketClose = ()=>{
        showpopup("connection losed");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }


    },[validated]);

    async function logout() {
      await stompClient.deactivate();
    }


    function sendMessagetoUser(data){
      if(!stompClient) return;

      stompClient.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(data)
      });
    }

    function chatting(body){
      stompClient.publish({
        destination:"/app/message.typing",
        body : JSON.stringify(body)
      })
    }



    function showpopup(msg){

      setPopUp({show : true,msg : msg});

      setTimeout(() => {
        setPopUp({show : false,msg : ""});
      }, 3000);

    }

    const api = axios.create
    (
      {
        baseURL:BASE_URL,
        headers:{
          Authorization : `Bearer ${token}`
        }
      }
    );

    async function URLsubmit(method,Endpoint,body){ 

      
      try {
        let res;

            switch(method){
                case "GET":
                  res = await api.get(Endpoint,body);
                break;
                case "PUT":
                  res = await api.put(Endpoint,body);
                break;

                case "DELETE":
                  res = await api.delete(Endpoint,body);
                break;

                case "POST":
                  res = await api.post(Endpoint,body);
                break;
                default :
                console.warn("GIVEN METHOD IS NOT VALID");
                break;
            }
        return res;
      } catch (err) {

        const status = err.response !== undefined? err.response.status : 500;
        const data = err.response !== undefined && err.response.data ? err.response.data : '';

        const res = {
          status : status,
          data : data
        }

          return res;
      }

    }

    return(
      <Dataprovider.Provider 
        value={{BASE_URL,stompClient,chatting,defaultdata,DATA,setData,setValidated,chatCache,
          setChatCache,sendMessagetoUser,audioCall:audioCall.current,
          videoCall:videoCall.current,showpopup,URLsubmit,setPopUp}}
      >
        {
          validated && incomingCall ? 
          <CallRequest controller={
            callerdata.connectionType === "audio"? audioCall.current : videoCall.current
          } 
           callerdata={callerdata}
           setCallerData={setCallerData}
           setIncomingCall={setIncomingCall}
          />
          :
          validated && socketConnected?<Home logout={logout}/>
          :<Authenticate setToken={setToken}/>
        
        }
        {
          info?
          <InfoTab setInfo={setInfo}/>
          : <></>
        }
        {
          popup.show?
            <Popup msg={popup.msg} validated={validated}/> :
            <></>
        }
      </Dataprovider.Provider>
    );

  }

  export default App;
  export {Dataprovider};

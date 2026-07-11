
export class callController{
    
    PEER = null;
    STREAM = null;
    pendingCandidates = [];
    subscription = [];

    receiverId = null;

    myId = null;
    socket = null;

    video = false;

    onHangup;
    onStream;
    onStateChange;
    onLocalVideo;

    constructor(socket,connectionType){
        this.socket = socket;
        this.video = connectionType;

        this.socketOnIceCandidates();
    }

    setReceiverId(id){
        this.receiverId = id;
    }

    setMyId(id){
        this.myId = id;
    }

    async getStream(){

        if(this.video){

            this.STREAM = await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:true
            });

        }else{

            this.STREAM = await navigator.mediaDevices.getUserMedia({
                audio:true
            });

        }
    }

    socketEmit(Endpoint,Body){

        this.socket.publish({
            destination:"/app/chat.call."+Endpoint,
            body:JSON.stringify(Body)
        });

    }

    async flushCandidates(){
        
        if(this.PEER?.remoteDescription){

            for(const c of this.pendingCandidates){

                await this.PEER.addIceCandidate(c);

            }

            this.pendingCandidates.length = 0;

        }

    }



    async createOffer(){

        const onblocked = this.socketOnBlocked();
        this.subscription.push(onblocked);

        try{
            await this.getStream();

            if(typeof this.onLocalVideo === "function" && this.video){
                this.onLocalVideo(this.STREAM);
            }

        }catch(e){
            console.error("getUserMedia failed",e);
            alert(e.name);

            if(typeof this.onHangup === "function"){
                this.onHangup("Permission Denied")
            }

            this.cleanup();

            return;
        }

        this.PEER = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]           
        });

        this.PEER.ontrack = (event)=>{

            if(typeof this.onStream === "function"){
                this.onStream(event.streams[0]);
            }
        };

        this.STREAM.getTracks().forEach(track => {
            this.PEER.addTrack(track,this.STREAM);
        });

        this.PEER.oniceconnectionstatechange = () =>{

            if(typeof this.onStateChange === "function"){
                this.onStateChange(this.PEER.iceConnectionState);
            }

        };

        const offer = await this.PEER.createOffer();
        await this.PEER.setLocalDescription(offer);
        
        const onOffline = this.socketOnOffline();
        this.subscription.push(onOffline);

        if(this.myId && this.receiverId){

            this.socketEmit("offer",{
                connectionType : this.video ?"video":"audio",
                sender : this.myId,
                receiver : this.receiverId,
                data : offer
            });
            
        }


        const sub = this.socketOnDecline();
        this.subscription.push(sub);
        

        this.PEER.onicecandidate = (event) =>{

            if(!event.candidate) return;

            if(this.myId && this.receiverId){

                this.socketEmit("icecandidate",{
                    connectionType : this.video?"video":"audio",
                    sender : this.myId,
                    receiver : this.receiverId,
                    data : event.candidate
                });

            }

        }


        const onAnswer = this.socketOnAnswer();
        this.subscription.push(onAnswer);

        const onDenied = this.socketOnPermissionDenied();
        this.subscription.push(onDenied);

        const onhang = this.socketOnHangup();
        this.subscription.push(onhang);

        this.flushCandidates();

    }

    socketOnBlocked(){
        const sub = this.socket.subscribe("/user/queue/chat.call.blocked",()=>{

            if(typeof this.onHangup === "function"){
                this.onHangup("user is busy");
            }

            this.cleanup();

            sub.unsubscribe();

        });

        return sub;
    }

    socketOnAnswer(){
        const sub = this.socket.subscribe("/user/queue/chat.call.answer",async(response)=>{
            
            const body = JSON.parse(response.body);

            await this.PEER.setRemoteDescription(body.data);

            this.flushCandidates();

            sub.unsubscribe();

        });

        return sub;
    }


    async socketOnIceCandidates(){
        this.socket.subscribe("/user/queue/chat.call.icecandidate",(response)=>{

            const body = JSON.parse(response.body);

            this.pendingCandidates.push(body.data);

            this.flushCandidates();

        });
    }

    declineCall(){

        if(this.myId && this.receiverId){

            this.socketEmit("decline",{
                connectionType : this.video? "video" : "audio",
                sender: this.myId,
                receiver : this.receiverId,
                data : "" 
            });

        }

        if(typeof this.onHangup === "function"){
            this.onHangup();
        }

        this.cleanup();

    }

    async createAnswer(offer){

        try{
            await this.getStream();

            if(typeof this.onLocalVideo === "function" && this.video){
                this.onLocalVideo(this.STREAM);
            }

        }catch(e){
            alert("Permission denied for call access");

            if(this.myId && this.receiverId){

                this.socketEmit("permissionDenied",{
                    connectionType:this.video? "video":"audio",
                    sender : this.myId,
                    receiver : this.receiverId,
                    data : ""
                });

            }


            this.onHangup("Permission denied");

            this.cleanup();

            return;
        }

        this.PEER = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]           
        });
        
        this.PEER.ontrack = (event)=>{

            if(typeof this.onStream === "function"){
                this.onStream(event.streams[0]);
            }
        };

        this.STREAM.getTracks().forEach(track => {
            this.PEER.addTrack(track,this.STREAM);
        });
        
        await this.PEER.setRemoteDescription(offer);

        const answer = await this.PEER.createAnswer();

        await this.PEER.setLocalDescription(answer);

        if(this.myId && this.receiverId){

            this.socketEmit("answer",{
                connectionType : this.video?"video" : "audio",
                sender : this.myId,
                receiver : this.receiverId,
                data : answer
            });

        }



        this.PEER.onicecandidate = (event)=>{

            if(!event.candidate) return;

            if(this.myId && this.receiverId){

                this.socketEmit("icecandidate",{
                    connectionType : this.video?"video":"audio",
                    sender : this.myId,
                    receiver : this.receiverId,
                    data : event.candidate
                });

            }


        };

        this.PEER.oniceconnectionstatechange = ()=>{

            if(typeof this.onStateChange === "function"){
                this.onStateChange(this.PEER.iceConnectionState);
            }

            if(this.PEER.iceConnectionState === "disconnected"){
                
                
                setTimeout(() => {
                    
                    if(typeof this.hangup === "function"){
                        this.onHangup();
                    }
                    
                    this.cleanup();
                }, 5000);

                
            }
            
        }

        const onhang = this.socketOnHangup();
        this.subscription.push(onhang);

        this.flushCandidates();

    }

    socketOnPermissionDenied(){

        const sub = this.socket.subscribe("/user/queue/chat.call.permissionDenied",()=>{
            
            if(typeof this.onHangup === "function"){
                this.onHangup("User not reachable");
            }

            this.cleanup();

        });

        return sub;
    }

    hangup(){

        if(this.myId && this.receiverId){

            this.socketEmit("hangup",{
                connectionType : this.video? "video" : "audio",
                sender : this.myId,
                receiver : this.receiverId,
                data : ""
            });

        }

        if(typeof this.onHangup === "function"){
            this.onHangup("call ended")
        }

        this.cleanup();

    }

    socketOnDecline(){

        const sub = this.socket.subscribe("/user/queue/chat.call.decline",()=>{

            
            if(typeof this.onHangup === "function"){
                this.onHangup("user is busy");
            }

            this.cleanup();

            sub.unsubscribe();

        });

        return sub;

    }

    socketOnHangup(){

        const sub = this.socket.subscribe("/user/queue/chat.call.hangup",()=>{

            
            if(typeof this.onHangup === "function"){
                this.onHangup("hanged up");
            }

            this.cleanup();
        });

        return sub;

    }

    socketOnOffline(){

        const sub = this.socket.subscribe("/user/queue/chat.call.offline",()=>{

            if(typeof this.onHangup === "function"){
                this.onHangup("user is offline");
            }

            this.cleanup();

            sub.unsubscribe();

        });

        return sub;

    }

    cleanup(){

        if(this.PEER){

            this.PEER.close();

            
            this.PEER = null;
            
            this.receiverId = null;
            
        }
        
        if(this.STREAM){

            this.STREAM.getTracks().forEach((track)=>{
                track.stop();                
            });

            this.STREAM = null;

        }

        this.subscription.forEach(sub=>{
            sub.unsubscribe();
        });

        this.subscription.length = 0;
        this.pendingCandidates.length = 0;

    }


}
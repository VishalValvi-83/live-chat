import React, { createContext, useState, useRef, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState(null);
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [isVideo, setIsVideo] = useState(true);
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCalling, setIsCalling] = useState(false);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socketRef = useRef();

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
                auth: { token }
            });

            socketRef.current.on('call-user', ({ from, name: callerName, signal, isVideo }) => {
                setCall({ isReceivingCall: true, from, name: callerName, signal, isVideo });
                setIsReceivingCall(true);
            });
        }
    }, []);

    
    const getMedia = async (isVideoCall = true) => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({
                video: isVideoCall,
                audio: true
            });
            setStream(currentStream);

            if (myVideo.current && isVideoCall) {
                myVideo.current.srcObject = currentStream;
            }
            return currentStream;
        } catch (err) {
            console.error("Failed to get stream:", err);
            if (err.name === 'NotAllowedError') {
                toast.error("Permission denied! Please allow camera/microphone access.");
            } else {
                toast.error(`Error: ${err.message}`);
            }
            return null;
        }
    };
    //17.50
    
    
    
    
    

    
    

    
    
    

    
    
    
    

    
    
    

    const answerCall = async () => {
        
        const isVideoCall = call.isVideo;

        
        const currentStream = await getMedia(isVideoCall);
        if (!currentStream) return;

        setCallAccepted(true);
        
        setIsVideo(isVideoCall);

        const peer = new Peer({ initiator: false, trickle: false, stream: currentStream });

        peer.on('signal', (data) => {
            socketRef.current.emit('answer-call', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            setRemoteStream(currentStream);
            if (userVideo.current) userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    const callUser = async (id, isVideoCall = true) => {
        setIsVideo(isVideoCall);
        setIsCalling(true);

        
        const currentStream = await getMedia(isVideoCall);
        if (!currentStream) {
            setIsCalling(false);
            return;
        }

        const peer = new Peer({ initiator: true, trickle: false, stream: currentStream });

        peer.on('signal', (data) => {
            if (socketRef.current) {
                socketRef.current.emit('call-user', {
                    userToCall: id,
                    signalData: data,
                    from: me,
                    name: name,
                    isVideo: isVideoCall
                });
            }
        });

        peer.on('stream', (currentStream) => {
            setRemoteStream(currentStream);
            if (userVideo.current) userVideo.current.srcObject = currentStream;
        });

        if (socketRef.current) {
            socketRef.current.on('call-accepted', (signal) => {
                setCallAccepted(true);
                setIsCalling(false);
                peer.signal(signal);
            });
        }

        connectionRef.current = peer;
    };

    
    const leaveCall = () => {
        setCallEnded(true);
        setIsCalling(false);
        setIsReceivingCall(false);
        setCallAccepted(false);
        setCall({}); 

        
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }

        
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            setStream(null);
        }

        
        if (socketRef.current && (call.from || call.to)) {
            socketRef.current.emit('end-call', { to: call.from || call.to });
        }

        
    };

    return (
        <CallContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            setMe,
            callUser,
            leaveCall,
            answerCall,
            socketRef,
            isVideo,
            setIsVideo,
            setStream,
            isReceivingCall,
            setIsReceivingCall,
            setCall,
            remoteStream,
            isCalling
        }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
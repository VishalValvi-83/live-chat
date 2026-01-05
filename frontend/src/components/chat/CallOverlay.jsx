import React, { useState, useEffect } from 'react';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Loader2 } from 'lucide-react'; 
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

export function CallOverlay() {
    const {
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        remoteStream,
        callEnded,
        leaveCall,
        answerCall,
        isReceivingCall,
        isVideo,
        isCalling 
    } = useCall();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [myVideo, stream, isCalling, callAccepted]); 

    useEffect(() => {
        if (userVideo.current && remoteStream) {
            userVideo.current.srcObject = remoteStream;
        }
    }, [userVideo, remoteStream, callAccepted]);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    if (stream && stream.getVideoTracks().length > 0) {
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setIsVideoOff(!isVideoOff);
    } else {
        console.warn("No video track to toggle");
    }

    
    if (isReceivingCall && !callAccepted) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-card border border-border shadow-2xl rounded-xl p-4 flex items-center gap-4 w-[90%] max-w-md"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                        <Avatar className="h-12 w-12 border-2 border-green-500">
                            <AvatarFallback>In</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">{call.name || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground">Incoming {call.isVideo ? 'Video' : 'Audio'} Call...</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="destructive" onClick={leaveCall} className="rounded-full h-10 w-10"><PhoneOff className="h-5 w-5" /></Button>
                        <Button size="icon" className="bg-green-500 hover:bg-green-600 rounded-full h-10 w-10" onClick={answerCall}><Phone className="h-5 w-5 text-white" /></Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    
    
    if ((callAccepted || isCalling) && !callEnded) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center">

                {/* Main View */}
                <div className="relative w-full h-full flex items-center justify-center">

                    {/* If Calling (Waiting for answer) */}
                    {isCalling && !callAccepted && (
                        <div className="flex flex-col items-center gap-4 z-10">
                            <div className="relative">
                                <span className="absolute inset-0 rounded-full animate-ping bg-white/20"></span>
                                <Avatar className="h-32 w-32 border-4 border-white/10">
                                    <AvatarFallback className="text-4xl text-black">...</AvatarFallback>
                                </Avatar>
                            </div>
                            <h2 className="text-2xl text-white font-semibold">Calling...</h2>
                            <p className="text-white/60 flex items-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" /> Waiting for response
                            </p>
                        </div>
                    )}

                    {/* Remote Video (Only show if call accepted) */}
                    {callAccepted && isVideo && (
                        <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover md:object-contain" />
                    )}

                    {/* Audio Call UI (If not video) */}
                    {callAccepted && !isVideo && (
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32 border-4 border-white/10">
                                <AvatarFallback className="text-4xl">{call.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl text-white font-semibold">{call.name}</h2>
                            <p className="text-white/60">Connected</p>
                        </div>
                    )}
                </div>

                {/* My Video (Small PIP) - Show during calling too so I can see myself */}
                {isVideo && (
                    <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        className="absolute top-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden shadow-xl border border-white/20 cursor-grab active:cursor-grabbing z-20"
                    >
                        <video playsInline ref={myVideo} autoPlay muted className="w-full h-full object-cover" />
                    </motion.div>
                )}

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 z-20">
                    <Button size="icon" variant="ghost" className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/20'}`} onClick={toggleMute}>
                        {isMuted ? <MicOff /> : <Mic />}
                    </Button>

                    {isVideo && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`rounded-full h-12 w-12 ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/20'}`}
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideoOff /> : <Video />}
                        </Button>
                    )}
                    <Button size="icon" variant="destructive" className="rounded-full h-14 w-14 shadow-lg hover:bg-red-600" onClick={leaveCall}>
                        <PhoneOff className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
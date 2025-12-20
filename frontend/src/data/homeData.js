import { Shield, Zap, Users, Lock, Video, Phone, Mic, Globe, Send, MessageCircle } from "lucide-react"

export const features = [
    {
        icon: Shield,
        title: "End-to-End Encryption",
        description: "Your messages are secured with military-grade encryption. Nobody can read your conversations except you and your recipients.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Real-time messaging with zero lag. Messages are delivered instantly, keeping conversations flowing naturally.",
    },
    {
        icon: Users,
        title: "Group Chats",
        description: "Create groups with up to 1000 members. Perfect for teams, communities, and staying connected with everyone.",
    },
    {
        icon: Lock,
        title: "Privacy First",
        description: "Your data stays yours. We don't sell your information or track your activities. Complete privacy guaranteed.",
    },
]

export const communicationFeatures = [
    {
        icon: Video,
        title: "Crystal Clear Video Calls",
        description: "HD video calling with up to 50 participants. Screen sharing, virtual backgrounds, and real-time reactions make every call memorable.",
        color: "from-blue-500 to-cyan-500",
        stats: "50+ participants",
        image: "video"
    },
    {
        icon: Phone,
        title: "Voice Calls That Connect",
        description: "Crystal clear audio quality for one-on-one or group voice calls. Stay connected even on low bandwidth with adaptive audio technology.",
        color: "from-violet-500 to-purple-500",
        stats: "HD Audio Quality",
        image: "voice"
    },
    {
        icon: Mic,
        title: "Voice Messages",
        description: "Send voice messages when typing isn't convenient. Perfect for quick updates, personal touches, or when you're on the go.",
        color: "from-pink-500 to-rose-500",
        stats: "Up to 15 min",
        image: "mic"
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connect with anyone, anywhere in the world. Automatic translation, low latency servers across continents.",
        color: "from-emerald-500 to-teal-500",
        stats: "100+ Countries",
        image: "globe"
    }
]

export const testimonials = [
    {
        name: "Sarah Chen",
        role: "Product Designer",
        avatar: "SC",
        content: "VoxenApp has completely transformed how our remote team communicates. The video quality is incredible and the interface is so intuitive.",
        rating: 5
    },
    {
        name: "Marcus Johnson",
        role: "Startup Founder",
        avatar: "MJ",
        content: "We switched from three different apps to just VoxenApp. Voice messages and instant translations have been game-changers for our global team.",
        rating: 5
    },
    {
        name: "Emily Rodriguez",
        role: "Marketing Director",
        avatar: "ER",
        content: "The security features give me peace of mind when discussing sensitive campaigns. Plus, the group video calls never lag, even with 30+ people.",
        rating: 5
    },
    {
        name: "David Kim",
        role: "Software Engineer",
        avatar: "DK",
        content: "Finally, a chat app that respects privacy. End-to-end encryption, no data selling, and it's blazing fast. What more could you want?",
        rating: 5
    }
]

export const liveConversation = [
    { sender: "Alex", message: "Hey team! Just pushed the new feature", time: "2:34 PM", avatar: "A" },
    { sender: "Sarah", message: "Amazing work! Let me test it out", time: "2:35 PM", avatar: "S" },
    { sender: "Mike", message: "The video call quality is incredible now", time: "2:36 PM", avatar: "M" },
    { sender: "Alex", message: "Thanks! We optimized the compression", time: "2:37 PM", avatar: "A" },
]

export const plans = [
    {
        name: "Free",
        price: "₹0",
        features: ["Unlimited 1-on-1 chats", "Group chats (up to 50)", "Voice messages", "File sharing (10MB)", "Voice calls"],
    },
    {
        name: "Pro",
        price: "₹499",
        popular: true,
        features: ["Everything in Free", "Group chats (up to 500)", "File sharing (100MB)", "HD Video calls", "Screen sharing", "Custom themes", "Priority support"],
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: ["Everything in Pro", "Unlimited groups", "Advanced admin controls", "SSO integration", "Dedicated support", "Custom branding", "API access"],
    },
]

export const steps = [
    { step: "01", title: "Create Account", description: "Sign up with your email or phone number in seconds", icon: Users },
    { step: "02", title: "Add Contacts", description: "Find friends or share your unique link to connect", icon: Send },
    { step: "03", title: "Start Chatting", description: "Send messages, make calls, or start video chats instantly", icon: MessageCircle }
]

export const livePreviewFeatures = [
    { icon: Zap, title: "Instant Delivery", description: "Messages arrive in milliseconds, not seconds. Real-time sync across all your devices." },
    { icon: Shield, title: "Encrypted by Default", description: "Every message is end-to-end encrypted. Even we can't read your conversations." },
    { icon: Users, title: "Rich Presence", description: "See who's online, typing, or in a call. Stay connected with your team's activity." }
]
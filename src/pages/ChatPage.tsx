import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MoreVertical, Paperclip, ChevronLeft, Search, CornerDownLeft, X, Store, Package, Heart, MessageCircle, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'; 
import { useToast } from '@/components/ui/use-toast'; 


// --- PROP DEFINITION ---
interface ChatPageProps {
    onUpdateUnreadCount?: (count: number) => void;
}
// -----------------

// --- MOCK DATA REMAINS UNCHANGED ---
const CURRENT_USER_ID = 100;
const CURRENT_USER_PROFILE = {
    id: CURRENT_USER_ID,
    name: 'You (MarketPlace Buyer)',
    brandIdentity: 'Premium Tech Enthusiast',
    avatar: 'https://i.pravatar.cc/150?img=53',
    status: 'Verified Buyer',
    memberSince: 'Oct 2023',
    stats: { orders: 12, wishList: 8, reviews: 5 }
};

const initialMockUsers = [
  { 
    id: 1, 
    name: 'Alex Johnson (Seller)', 
    lastMessage: 'The laptop is ready for pickup.', 
    time: '10:30 AM', 
    unread: 2, 
    avatar: 'https://i.pravatar.cc/150?img=1',
    brandIdentity: 'Alpha Electronics',
    status: 'Top Rated Seller',
    memberSince: 'Jan 2022',
    stats: { listings: 45, sales: 210, rating: 4.8 }
  },
  { 
    id: 2, 
    name: 'MarketPlace Support', 
    lastMessage: 'Your refund has been processed.', 
    time: 'Yesterday', 
    unread: 0, 
    avatar: 'https://i.pravatar.cc/150?img=2',
    brandIdentity: 'Official Marketplace Team',
    status: 'Verified Staff',
    memberSince: '2020',
    stats: { tickets: 999, solved: 950, uptime: 100 }
  },
  { 
    id: 3, 
    name: 'EcoGadgets Trader', 
    lastMessage: 'Checking on your custom order status now.', 
    time: 'Just now', 
    unread: 1, 
    avatar: 'https://i.pravatar.cc/150?img=4',
    brandIdentity: 'Sustainable Goods Hub',
    status: 'Eco-Certified Trader',
    memberSince: 'Mar 2023',
    stats: { listings: 12, sales: 55, rating: 4.2 }
  },
  { 
    id: 4, 
    name: 'Vintage Finds Emporium', 
    lastMessage: 'The antique camera ships tomorrow.', 
    time: '4:20 PM', 
    unread: 0, 
    avatar: 'https://i.pravatar.cc/150?img=12',
    brandIdentity: 'Nostalgia Niche',
    status: 'Curator',
    memberSince: 'Sep 2021',
    stats: { listings: 88, sales: 120, rating: 4.9 }
  },
  { 
    id: 5, 
    name: 'AutoParts King', 
    lastMessage: 'We have the part in stock.', 
    time: '1:15 PM', 
    unread: 5, 
    avatar: 'https://i.pravatar.cc/150?img=15',
    brandIdentity: 'High Performance Supplies',
    status: 'Pro Seller',
    memberSince: 'Feb 2024',
    stats: { listings: 300, sales: 500, rating: 4.0 }
  },
  { 
    id: 6, 
    name: 'Boutique Threads', 
    lastMessage: 'The blue dress is back in stock!', 
    time: 'Yesterday', 
    unread: 0, 
    avatar: 'https://i.pravatar.cc/150?img=7',
    brandIdentity: 'Chic Style Co.',
    status: 'Trend Setter',
    memberSince: 'May 2022',
    stats: { listings: 60, sales: 350, rating: 4.5 }
  },
];

const initialMockMessages = [
  { id: 1, senderId: 1, text: 'Hi! I saw you were interested in the phone. It is a brand new iPhone 14.', time: '10:28 AM', isMine: false, isRead: true, senderName: 'Alex Johnson' },
  { id: 2, senderId: CURRENT_USER_ID, text: 'Yes! I am! Is it still available and what color is it?', time: '10:29 AM', isMine: true, isRead: true, senderName: CURRENT_USER_PROFILE.name },
  { id: 3, senderId: 1, text: 'Absolutely. It is the deep purple version. The laptop is ready for pickup.', time: '10:30 AM', isMine: false, isRead: true, senderName: 'Alex Johnson' },
  { id: 4, senderId: CURRENT_USER_ID, text: 'Great! Can I arrange a viewing this afternoon? I will be free around 4 PM.', time: '10:31 AM', isMine: true, isRead: false, senderName: CURRENT_USER_PROFILE.name },
];
// -----------------

// --- USER PROFILE MODAL COMPONENT ---
interface UserProfileModalProps {
    user: typeof initialMockUsers[0] | typeof CURRENT_USER_PROFILE;
    onClose: () => void;
    onReportUser: (userName: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onReportUser }) => {
    const isSeller = 'listings' in user.stats;
    const stat1 = isSeller ? { label: 'Listings', icon: <Store className="w-4 h-4" />, value: user.stats.listings } : { label: 'Orders', icon: <Package className="w-4 h-4" />, value: user.stats.orders };
    const stat2 = isSeller ? { label: 'Sales', icon: <Badge className="w-4 h-4" />, value: user.stats.sales } : { label: 'Wishlist', icon: <Heart className="w-4 h-4" />, value: user.stats.wishList };
    const stat3 = isSeller ? { label: 'Rating', icon: <MessageCircle className="w-4 h-4" />, value: user.stats.rating } : { label: 'Reviews', icon: <MessageCircle className="w-4 h-4" />, value: user.stats.reviews };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            
            <Card className="glass-medium backdrop-blur-3xl border border-glass-border w-full max-w-sm relative z-10 shadow-2xl">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
                
                <CardHeader className="flex flex-col items-center text-center p-6">
                    <Avatar className="h-20 w-20 mb-3 border-4 border-[#ff902b] shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white text-xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                    <CardDescription className="text-[#ff902b] font-semibold mt-1">{user.brandIdentity}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 p-6 pt-0">
                    <div className="flex justify-around text-center border-b border-glass-border pb-4">
                        <div className="text-sm">
                            <p className="font-semibold text-muted-foreground">Status</p>
                            <p className="text-lg font-bold">{user.status}</p>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-muted-foreground">Member Since</p>
                            <p className="text-lg font-bold">{user.memberSince}</p>
                        </div>
                    </div>

                    <h4 className="text-lg font-semibold text-center mt-4">Key Statistics</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        {[stat1, stat2, stat3].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center p-2 rounded-lg glass-light">
                                <span className="text-[#ff902b]">{stat.icon}</span>
                                <p className="text-xl font-bold mt-1">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex flex-col space-y-2">
                        <Button 
                            variant="outline" 
                            className="w-full border-glass-border hover:bg-hover-orange/10 hover:text-[#ff9203]"
                            onClick={() => {
                                onReportUser(user.name); 
                                onClose(); 
                            }}
                        >
                            Report User
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
// -----------------


// --- CHAT PAGE COMPONENT ---
export function ChatPage({ onUpdateUnreadCount = () => {} }: ChatPageProps) {
    const [users, setUsers] = useState(initialMockUsers);
    const [activeChat, setActiveChat] = useState(initialMockUsers[0]);
    const [messages, setMessages] = useState(initialMockMessages);
    const [message, setMessage] = useState('');
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false); 
    const [profileModal, setProfileModal] = useState<{ isOpen: boolean, user: any | null }>({ isOpen: false, user: null });
    
    const { toast } = useToast(); 

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Calculate Total Unread Count for the PARENT/NAVBAR
    useEffect(() => {
        const sum = users.reduce((acc, user) => acc + user.unread, 0);
        onUpdateUnreadCount(sum); 
    }, [users, onUpdateUnreadCount]); 

    // Unread count reset effect (Runs when chat is opened/switched)
    useEffect(() => {
        const userIndex = users.findIndex(u => u.id === activeChat.id);
        
        if (userIndex !== -1 && users[userIndex].unread > 0) {
             setUsers(prevUsers => 
                prevUsers.map((u, index) => 
                    index === userIndex ? { ...u, unread: 0 } : u
                )
             );
        }
    }, [activeChat.id, users]); 
    
    // Handles updating unread count for the active chat partner
    const handleIncomingMessage = (newMessageText: string) => {
        const chatPartnerId = activeChat.id;
        
        setUsers(prevUsers => {
            return prevUsers.map(user => {
                if (user.id === chatPartnerId) {
                    return { 
                        ...user, 
                        lastMessage: newMessageText,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: user.unread + 1
                    };
                }
                return user;
            });
        });
    };

    // Auto-reply logic 
    const sendReply = (text: string) => {
        const replyMessage = {
            id: Date.now() + 1, 
            senderId: activeChat.id,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: false,
            isRead: true, 
            senderName: activeChat.name
        };
        
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, replyMessage]);
            handleIncomingMessage(text);
        }, 1500);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const sentMessage = message.trim();
        if (sentMessage) {
            const newMessage = {
                id: Date.now(), 
                senderId: CURRENT_USER_ID,
                text: sentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMine: true,
                isRead: false, 
                senderName: CURRENT_USER_PROFILE.name
            };
            
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessage('');

            setTimeout(() => {
                setMessages(prevMessages => 
                    prevMessages.map(msg => msg.id === newMessage.id ? { ...msg, isRead: true } : msg)
                );
            }, 1000); 

            const replyText = `I hear you about the ${activeChat.brandIdentity}! Let me check that for you right away.`;
            sendReply(replyText); 
        }
    };

    const handleChatSelect = (user) => {
        setActiveChat(user);
        setMessages(initialMockMessages.map(msg => ({ 
            ...msg, 
            senderName: msg.isMine ? CURRENT_USER_PROFILE.name : user.name 
        }))); 
        
        if (window.innerWidth < 768) {
            setIsMobileChatOpen(true);
        }
    };
    
    const openProfileModal = (user: typeof initialMockUsers[0] | typeof CURRENT_USER_PROFILE) => {
        setProfileModal({ isOpen: true, user });
    };

    // Function to handle reporting a user and showing a toast
    const handleReportUser = (userName: string) => {
        console.log(`User ${userName} reported.`); 
        toast({
            title: "User Reported",
            description: `Thank you for your report about "${userName}". Our team will review it shortly.`,
            variant: "default", 
            duration: 3000,
        });
    };

    return (
        <>
        <div className="flex flex-col h-[calc(100vh-64px)] p-4 bg-background/50">

            <div className="flex flex-1 overflow-hidden rounded-xl border border-glass-border shadow-xl">
                
                {/* 1. CONVERSATION SIDEBAR */}
                <div 
                    className={`w-full md:w-80 lg:w-96 glass-medium border-r border-glass-border flex-shrink-0 transition-transform duration-300 ${isMobileChatOpen ? 'hidden md:block' : 'block'}`}
                >
                    <div className="p-4 border-b border-glass-border">
                        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Messages</h2>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search chats..." className="input-glass pl-10" />
                        </div>
                    </div>
                    
                    {/* Conversation List */}
                    <ScrollArea className="h-[calc(100%-100px)]"> 
                        {users.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center p-4 cursor-pointer transition-colors ${
                                    activeChat.id === user.id 
                                        ? 'bg-hover-orange/20 border-l-4 border-[#ff902b]' 
                                        : 'hover:bg-hover-orange/10'
                                }`}
                                onClick={() => handleChatSelect(user)}
                            >
                                <Avatar className="h-10 w-10 mr-3 cursor-pointer" onClick={(e) => {
                                    e.stopPropagation(); 
                                    openProfileModal(user);
                                }}>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="bg-gradient-primary text-white">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm truncate">{user.name}</p>
                                        <span className="text-xs text-muted-foreground ml-2">{user.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>
                                        {user.unread > 0 && (
                                            <Badge className="badge-glass bg-destructive h-5 w-5 text-xs flex items-center justify-center rounded-full ml-2">
                                                {user.unread}
                                            </Badge>
                                        )}
                                    </div>
                                    {/* REMOVED THE CULPRIT BRACE HERE */}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* 2. CHAT WINDOW REMAINS UNCHANGED */}
                <div className={`flex-1 flex flex-col ${isMobileChatOpen ? 'block' : 'hidden md:flex'}`}>
                    
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-glass-border glass-medium flex-shrink-0">
                        <div className="flex items-center cursor-pointer" onClick={() => openProfileModal(activeChat)}>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="md:hidden mr-2"
                                onClick={(e) => { e.stopPropagation(); setIsMobileChatOpen(false); }}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={activeChat.avatar} />
                                <AvatarFallback className="bg-gradient-primary text-white">
                                    {activeChat.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold">{activeChat.name}</h3>
                                <p className="text-xs text-green-500">Active now</p> 
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon-sm">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* Chat Messages Area */}
                    <ScrollArea className="flex-1 p-6 space-y-4 sm:space-y-6"> 
                        {messages.map((msg, index) => {
                            const profile = msg.isMine ? CURRENT_USER_PROFILE : activeChat;

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} ${!msg.isMine && index >= initialMockMessages.length ? 'animate-message-fade-in' : ''}`}
                                >
                                    {/* Avatar for the other person's messages (Hidden on small screens) */}
                                    {!msg.isMine && (
                                        <Avatar 
                                            className="h-8 w-8 mr-2 mt-auto flex-shrink-0 cursor-pointer hidden sm:block" 
                                            onClick={() => openProfileModal(activeChat)}
                                        >
                                            <AvatarImage src={profile.avatar} />
                                            <AvatarFallback className="bg-gradient-primary text-white">
                                                {profile.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    
                                    <div 
                                        // Blurred background applied to all messages
                                        className={`max-w-xs sm:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md backdrop-blur-3xl border border-glass-border ${
                                            msg.isMine 
                                                ? 'bg-gradient-primary/80 text-white rounded-br-none' // My messages (orange-blurred)
                                                : 'bg-background/80 text-foreground rounded-tl-none'  // Their messages (light/dark-blurred)
                                        }`}
                                    >
                                        {/* Display Brand Identity in the bubble */}
                                        {!msg.isMine && (
                                            <p className={`text-xs font-semibold mb-1 text-[#ff902b]`}>
                                                {activeChat.brandIdentity}
                                            </p>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        <div className={`text-xs mt-1 flex items-center justify-end ${msg.isMine ? 'text-white/80' : 'text-muted-foreground'}`}>
                                            {msg.time}
                                            {/* Double Blue Tick for Sent Messages when isRead is true */}
                                            {msg.isMine && msg.isRead && (
                                                <CheckCheck className="w-4 h-4 ml-1 text-blue-400" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Avatar for the current user's messages (Hidden on small screens) */}
                                    {msg.isMine && (
                                        <Avatar 
                                            className="h-8 w-8 ml-2 mt-auto flex-shrink-0 cursor-pointer hidden sm:block"
                                            onClick={() => openProfileModal(CURRENT_USER_PROFILE)}
                                        >
                                            <AvatarImage src={profile.avatar} />
                                            <AvatarFallback className="bg-gradient-primary text-white">
                                                {profile.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </ScrollArea>

                    {/* Chat Input Footer */}
                    <div className="p-4 border-t border-glass-border glass-medium flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                            <Button variant="ghost" size="icon-sm" type="button">
                                <Paperclip className="w-5 h-5 text-muted-foreground" />
                            </Button>
                            <Input
                                type="text"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="input-glass flex-1 pr-12 h-12"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <Button 
                                type="submit" 
                                variant="glass-primary" 
                                size="icon-sm" 
                                className="w-10 h-10"
                                disabled={!message.trim()}
                            >
                                <CornerDownLeft className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        {/* User Profile Modal */}
        {profileModal.isOpen && profileModal.user && (
            <UserProfileModal 
                user={profileModal.user} 
                onClose={() => setProfileModal({ isOpen: false, user: null })} 
                onReportUser={handleReportUser}
            />
        )}
        </>
    );
}
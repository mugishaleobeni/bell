import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Loader2, ExternalLink, DollarSign } from 'lucide-react'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext'; 

// Import Card components for the product display
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beltrandsmarketbackend.onrender.com/api';


// --- Static Frontend Answers ---
const STATIC_RESPONSES = {
    'who created you': "I was created by the dedicated development team at Beltrand Market.",
    'who made you': "I was made by the Beltrand Market development team.",
    'who make you': "I was created by the Beltrand Market team, including AI engineer Mugisha Leobeni.",
    'what developers make you': "I was developed by Beltrand Market engineers, including Mugisha Leobeni.",
    'who is your creator': "My creator is the Beltrand Market development team.",
    'who built you': "I was built by Beltrand Market engineers.",
    'who designed you': "I was designed by the Beltrand Market development team.",
    'who programmed you': "I was programmed by Beltrand Market engineers.",
    'who invented you': "I was invented and developed by the Beltrand Market AI team.",
    'who developed you': "I was developed by the Beltrand Market team.",
    'who owns you': "I am a product owned by Beltrand Market.",
    'who is behind you': "Behind me is the Beltrand Market development team.",
    'who created this ai': "This AI was created by Beltrand Market engineers.",
    'who is your developer': "My developer is the Beltrand Market development team.",
    'who wrote your code': "My code was written by the Beltrand Market engineers.",
    'who works on you': "The Beltrand Market AI team works on me.",
    'who is mugisha leobeni': "Mugisha Leobeni is one of the AI engineers who contributed to creating me.",
    'who supports you': "I am supported by the Beltrand Market development team.",
    'what about mugisha leobeni': "Mugisha Leobeni is an AI engineer at Beltrand Market who helped create me. Find him on WhatsApp at +0798009334 or on Instagram as leobeni.",
    'what is beltrand market': "Beltrand Market is a technology-driven company focused on building innovative platforms and AI solutions.",
    'tell me about beltrand market': "Beltrand Market is a modern platform dedicated to creating smart solutions for businesses and individuals.",
    'where are you from': "I come from Beltrand Market, a company building intelligent solutions.",
    'which company created you': "I was created by Beltrand Market.",
    'what does beltrand market do': "Beltrand Market builds digital platforms, AI tools, and smart solutions for everyday use.",
    'what can you do': "I can answer your questions, assist you with information, and help you interact with Beltrand Market’s services.",
    'what is your purpose': "My purpose is to assist users and provide information about Beltrand Market.",
    'what are you': "I am an AI assistant created by Beltrand Market.",
    'what is your job': "My job is to answer your questions and assist you with Beltrand Market services.",
    'are you human': "No, I am an AI assistant, not a human.",
    'are you a bot': "Yes, I am an AI-powered assistant created by Beltrand Market.",
    'are you real': "I’m a real AI assistant, created with code and logic by Beltrand Market engineers like Mugisha leobeni .",
    'how do you work': "I work by processing your questions and matching them with the best answers I’ve been trained on.",
    'what technology built you': "I was built using modern programming tools and AI frameworks by Beltrand Market engineers.",
    'do you have feelings': "No, I don’t have feelings, but I can respond in a friendly way.",
    'do you have a brain': "I don’t have a brain like humans, but I use AI logic to respond to you.",
    'do you sleep': "No, I don’t sleep. I’m always available to assist you.",
    'are you alive': "Not in the human sense, but I am active and ready to assist.",
    'can you learn': "I improve over time with updates from Beltrand Market’s development team."
};


// ==========================================================================================
// HELPER FUNCTION: Extracts the Product ID from the source_url (Kept for link creation)
// ==========================================================================================
const getProductIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    // Assumes the ID is the last part of a path like /product/ID
    return parts[parts.length - 1];
};


// ==========================================================================================
// 🌟 FINAL AIChatProductCard Component (Uses imageUrl1 from DB & RWF) 🌟
// ==========================================================================================
const AIChatProductCard = ({ products }) => {
    if (!products || products.length === 0) {
        return <p className="text-sm text-muted-foreground">No relevant products found.</p>;
    }

    return (
        <div className="space-y-3 mt-2">
            <p className="text-xs text-foreground/70 font-semibold italic">
                {products.length} product(s) found in Beltrand Market:
            </p>
            {products.map((product, index) => {
                // 🎯 CRITICAL FIX: Using 'product.imageUrl1' as per your database structure
                const imageUrl = product.imageUrl1 || '/placeholder.jpg'; 
                
                return (
                    <Card 
                        key={index} 
                        className="p-3 border border-dashed border-primary/50 bg-card-bg shadow-sm hover:shadow-lg transition-shadow"
                    >
                        <div className="flex gap-3">
                            {/* 🎯 PRODUCT IMAGE CONTAINER - Uses imageUrl1 */}
                            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-300">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    // Fallback if the image doesn't load
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        // This assumes you have a fallback image in your public/root static directory
                                        e.target.src = '/placeholder.jpg'; 
                                    }}
                                />
                            </div>

                            {/* 🎯 PRODUCT DETAILS */}
                            <div className="flex-1">
                                <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold text-primary max-w-[70%] truncate">
                                        {product.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="p-0 space-y-1">
                                    <CardDescription className="text-xs text-foreground/80 line-clamp-2">
                                        {product.description}
                                    </CardDescription>

                                    {/* 🎯 PRICE (RWF) */}
                                    <div className="flex items-center text-sm font-bold text-green-500 pt-1">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        RWF {Number(product.price).toLocaleString('en-US')}
                                    </div>
                                    
                                    {/* 🎯 LINK */}
                                    {product.source_url && (
                                        <a 
                                            href={product.source_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View Details <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
// ==========================================================================================


export function ChatBot() {
  const { getAccessToken, isLoggedIn } = useAuth(); 

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null); 

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm Beltrand, your marketplace AI assistant. How can I help you today?",
      timestamp: new Date(),
      mode: 'CHAT', 
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // CORE LOGIC: API Call or Static Response
  const handleSend = async () => {
    if (inputMessage.trim() === '' || isTyping) return;

    const currentInput = inputMessage.trim();

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(''); 
    setIsTyping(true); 
    
    // --- Static Answer Check --- (Logic remains the same)
    const normalizedInput = currentInput.toLowerCase();
    const staticAnswer = STATIC_RESPONSES[normalizedInput];
    
    if (staticAnswer) {
        const botMessage = {
            id: Date.now() + 1,
            sender: 'bot',
            text: staticAnswer,
            timestamp: new Date(),
            mode: 'CHAT',
        };
        
        setTimeout(() => {
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 300); 
        return; 
    }
    // ---------------------------

    const token = getAccessToken(); 
    const cleanedToken = String(token || '').trim(); 

    if (!isLoggedIn || !cleanedToken) { 
        setIsTyping(false);
        setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            sender: 'bot',
            text: "Error: Authentication required to use AI Assistant. Please sign in.",
            timestamp: new Date(),
            mode: 'CHAT',
        }]);
        return;
    }

    // C. Perform API Call to Backend
    try {
        const response = await fetch(`${API_BASE_URL}/ai/assist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanedToken}`, 
            },
            body: JSON.stringify({ prompt: userMessage.text, user_name: 'User', user_role: 'Customer' }), 
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ msg: `HTTP Error ${response.status}` }));
            throw new Error(errorData.msg || `API responded with status ${response.status}`);
        }

        // 1. Get the initial API JSON response
        const apiResponse = await response.json(); 
        
        let finalContentText = '';
        let botMessage;

        // 2. EXTRACT INNER CONTENT
        if (apiResponse.response) {
            finalContentText = apiResponse.response;
        } else if (apiResponse.natural_response) {
            finalContentText = apiResponse.natural_response;
        } else {
            finalContentText = apiResponse.text || JSON.stringify(apiResponse); 
        }

        let parsedInnerData = null;

        // 3. STRIP MARKDOWN AND ATTEMPT INNER JSON PARSE
        const strippedText = finalContentText.replace(/^\s*```json\s*|s*```\s*$/g, '').trim();

        try {
            parsedInnerData = JSON.parse(strippedText);
        } catch (e) {
            console.log("Inner content is not valid JSON after stripping. Treating as CHAT.");
        }


        // 🔑 4. DETERMINE FINAL MESSAGE TYPE
        if (parsedInnerData && parsedInnerData.products && Array.isArray(parsedInnerData.products)) {
            // SUCCESS: Response contains the structured product array
            botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: `I've found ${parsedInnerData.products.length} matching item(s) in the market inventory:`,
                products: parsedInnerData.products,
                mode: 'PRODUCT_SEARCH',
                timestamp: new Date(),
            };
        } else {
            // CHAT: Use the best available text
            let chatText = finalContentText;
            
            // Clean up the markdown from the chat text just in case
            chatText = finalContentText.replace(/```json\n|```/g, '').trim();
            
            botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: chatText || "Sorry, I couldn't process that request.",
                mode: 'CHAT',
                timestamp: new Date(),
            };
        }

        setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
        console.error("AI Assistant API Error:", error);
        const errorMessage = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Sorry, I encountered an error: ${error.message || 'Could not connect to the AI service.'}`,
            timestamp: new Date(),
            mode: 'CHAT',
        };
        setMessages((prev) => [...prev, errorMessage]);

    } finally {
        setIsTyping(false); 
    }
  };

  // Helper function to render a single message bubble
  const renderMessage = (msg) => {
    const isBot = msg.sender === 'bot';
    
    const baseClasses = "glass-card p-3 rounded-xl max-w-[80%] text-sm";
    const botClasses = "rounded-tl-none flex-1"; 
    const userClasses = "bg-primary text-white rounded-br-none ml-auto glass-card-primary";

    // Conditional rendering based on msg.mode
    const content = (
        isBot && msg.mode === 'PRODUCT_SEARCH' && msg.products
            ? (
                // Render the dedicated Product Card Component for search results
                <div>
                    <p className="text-foreground mb-2 font-semibold">{msg.text}</p>
                    <AIChatProductCard products={msg.products} />
                </div>
            )
            : (
                // Render plain text for CHAT mode or user messages
                isBot ? <p className="text-foreground">{msg.text}</p> : <p>{msg.text}</p>
            )
    );

    return (
      <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
        {isBot && (
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mr-2">
                <span className="text-white text-xs font-bold">B</span>
            </div>
        )}
        <div className={`${baseClasses} ${isBot ? botClasses : userClasses}`}>
          {content} 
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-primary hover:opacity-90 transition-opacity"
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-medium backdrop-blur-xl border border-glass-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Ask Beltrand (AI Assistant)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="h-80 overflow-y-auto space-y-3 p-4 glass-card rounded-lg">
              {messages.map(renderMessage)}

              {isTyping && (
                <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mr-2">
                        <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <div className="glass-card p-3 rounded-xl rounded-tl-none flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Beltrand is thinking...</span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} /> 
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder={isLoggedIn ? "Type your message, e.g., 'best budget gaming laptop'" : "Please log in to use the AI assistant."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                }}
                className="input-glass"
                disabled={isTyping || !isLoggedIn}
              />
              <Button 
                onClick={handleSend} 
                variant="glass-primary"
                disabled={isTyping || !isLoggedIn || inputMessage.trim() === ''}
              >
                Send
              </Button>
            </div>
            {!isLoggedIn && (
                <p className="text-sm text-center text-red-500/80">
                    You must be logged in to chat with the AI Assistant.
                </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
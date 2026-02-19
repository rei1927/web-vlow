import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile, Paperclip, CheckCheck, Settings, Home, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

const INITIAL_MESSAGES = [
    {
        id: 1,
        text: "Halo! 👋 Saya Vlow AI Assistant. Ada yang bisa saya bantu untuk bisnis kamu hari ini?",
        sender: 'bot',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
];

const MAX_MESSAGES_PER_IP = 15;

const getIpAddress = async () => {
    try {
        // Try primary service
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            return data.ip;
        }
        throw new Error("Primary IP fetch failed");
    } catch (error) {
        console.warn("Primary IP fetch failed, trying fallback...", error);
        try {
            // Try fallback service
            const response = await fetch('https://api.db-ip.com/v2/free/self');
            if (response.ok) {
                const data = await response.json();
                return data.ipAddress;
            }
        } catch (err2) {
            console.error("All IP fetch services failed:", err2);
            // Fallback to a generated ID stored in LocalStorage to ensure tracking works
            let fallbackId = localStorage.getItem('vlow_device_id');
            if (!fallbackId) {
                fallbackId = 'unknown-' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('vlow_device_id', fallbackId);
            }
            return fallbackId;
        }
    }
    return null;
};

const checkAndIncrementRateLimit = async (ip) => {
    if (!ip) return true; // Fail open if IP fetch fails (or block, depending on security needs)

    try {
        // 1. Check existing log
        const { data: logs, error: fetchError } = await supabase
            .from('simulator_logs')
            .select('*')
            .eq('ip_address', ip)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error("Error checking logs:", fetchError);
            return true; // Fail open
        }

        if (logs) {
            // Check if limit reached
            if (logs.message_count >= MAX_MESSAGES_PER_IP) {
                return false; // Block
            }

            // Increment count
            const { error: updateError } = await supabase
                .from('simulator_logs')
                .update({
                    message_count: logs.message_count + 1,
                    last_activity: new Date().toISOString()
                })
                .eq('id', logs.id);

            if (updateError) console.error("Error updating log:", updateError);
        } else {
            // First time for this IP
            const { error: insertError } = await supabase
                .from('simulator_logs')
                .insert([{ ip_address: ip, message_count: 1 }]);

            if (insertError) console.error("Error inserting log:", insertError);
        }

        return true; // Allow
    } catch (err) {
        console.error("Rate limit error:", err);
        return true;
    }
};

const BOT_RESPONSES = [
    "Menarik! Boleh ceritakan lebih detail tentang kebutuhan bisnis kamu?",
    "Tentu, Vlow.AI bisa membantu otomatisasi chat WhatsApp kamu 24/7.",
    "Fitur kami mencakup broadcast, auto-reply cerdas, dan integrasi CRM.",
    "Kamu bisa coba gratis sekarang dengan klik tombol 'Coba Gratis' di halaman utama!",
    "Apakah ada hal lain yang ingin kamu tanyakan?",
];

export default function Simulator() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const [systemPrompt, setSystemPrompt] = useState(""); // Init empty, will fetch
    const [agentName, setAgentName] = useState("Vlow.AI Assistant"); // Default name
    const [n8nWebhook, setN8nWebhook] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showToast, setShowToast] = useState(false); // Toast notification state
    const [isConfigOpen, setIsConfigOpen] = useState(false); // Mobile config toggle
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch system prompt on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // 1. Try to get from LocalStorage first (User's custom session)
                const storedPrompt = localStorage.getItem('vlow_system_prompt');
                const storedAgentName = localStorage.getItem('vlow_agent_name');

                if (storedAgentName) setAgentName(storedAgentName);

                // 2. Fetch "Global Default" from Supabase
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .eq('id', 1)
                    .single();

                console.log("Supabase Fetch Result:", { data, error });

                if (data) {
                    setN8nWebhook(data.n8n_webhook_url || "");

                    // Only set system prompt if USER HAS STORED IT or if Supabase has a non-default one?
                    // User requested: "harus kosong, hanya ada pesan bayangan"
                    // So we only load if localStorage has it. 
                    // If localStorage is empty, we leave it empty (to show placeholder).
                    if (storedPrompt) {
                        setSystemPrompt(storedPrompt);
                    }
                } else {
                    if (storedPrompt) {
                        setSystemPrompt(storedPrompt);
                    }
                    if (error) console.error("Error fetching defaults:", error);
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
                const storedPrompt = localStorage.getItem('vlow_system_prompt');
                if (storedPrompt) setSystemPrompt(storedPrompt);

                const storedAgentName = localStorage.getItem('vlow_agent_name');
                if (storedAgentName) setAgentName(storedAgentName);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdateConfig = async () => {
        setIsSaved(false); // Reset saved state
        try {
            // Save to LocalStorage (User Session only)
            // Save to LocalStorage (User Session only)
            localStorage.setItem('vlow_system_prompt', systemPrompt);
            localStorage.setItem('vlow_agent_name', agentName);
            console.log("System prompt saved to LocalStorage");

            setIsSaved(true);
            setShowToast(true); // Show toast
            setTimeout(() => {
                setIsSaved(false);
                setShowToast(false); // Hide toast
            }, 3000); // 3 seconds visibility

            setMessages(INITIAL_MESSAGES); // Optional: Reset chat to apply new "concept"
            // Ensure config panel closes on mobile for better UX? Optional. 
            // setIsConfigOpen(false); 
        } catch (err) {
            console.error("Error saving config:", err);
            alert("Gagal menyimpan konfigurasi.");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText("");
        setIsTyping(true);




        try {
            let botResponseText = "";

            if (n8nWebhook) {
                // Call n8n Webhook
                const response = await fetch(n8nWebhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-System-Prompt': systemPrompt // Send system prompt in header
                    },
                    body: JSON.stringify({
                        message: inputText,
                        sessionId: 'test-session-' + Date.now(), // Basic session ID
                        systemPrompt: systemPrompt || "Kamu adalah asisten virtual yang ramah dan membantu untuk Vlow.AI." // Use default if empty
                    })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                console.log("n8n Response:", data); // Debug log

                // Handle n8n returning an array (common) or object
                const responseData = Array.isArray(data) ? data[0] : data;

                // Try to find the text response in various common fields
                botResponseText = responseData.output ||
                    responseData.text ||
                    responseData.message ||
                    responseData.content ||
                    (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));

                // If n8n returns default "Workflow was started", user needs to change Webhook settings
                if (botResponseText === "Workflow was started") {
                    botResponseText = "⚠️ Workflow started but no response returned. Please add a 'Respond to Webhook' node in n8n or set Webhook to 'Respond: Using Last Node'.";
                }
            } else {
                // Fallback to random response if no webhook configured
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                botResponseText = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
            }

            const newBotMessage = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            console.error("Error calling AI agent:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Maaf, terjadi kesalahan saat menghubungkan ke AI Agent.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center h-[85vh]">

                {/* Mobile Config Toggle */}

                {/* Left Panel - Configuration */}
                <div className={`w-full lg:w-1/3 flex flex-col gap-6 ${isConfigOpen ? 'h-auto' : 'h-fit'} lg:h-full transition-all duration-300`}>
                    <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-slate-100 flex-1 flex flex-col transition-all duration-300">
                        {/* Header - Clickable on Mobile */}
                        <div className="flex items-center justify-between cursor-pointer lg:cursor-default" onClick={() => setIsConfigOpen(!isConfigOpen)}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Konfigurasi AI Agent</h1>
                                    <p className="text-sm text-slate-500">Sesuaikan perilaku agent kamu</p>
                                </div>
                            </div>
                            <div className="lg:hidden text-slate-400">
                                {isConfigOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                            </div>
                        </div>

                        {/* Content - Collapsible on Mobile */}
                        <div className={`flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar mt-6 transition-all duration-300 ${isConfigOpen ? 'flex' : 'hidden lg:flex'}`}>
                            {/* n8n Webhook URL input hidden for security */}

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Nama Agent</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                    placeholder="Contoh: CS Toko Kucing"
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm font-semibold text-slate-700">System Prompt</label>
                                {isLoading ? (
                                    <div className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                                        Loading prompt...
                                    </div>
                                ) : (
                                    <textarea
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                                        placeholder="Kamu adalah asisten virtual yang ramah dan membantu untuk Vlow.AI..."
                                    />
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    Prompt ini akan menjadi instruksi utama bagi AI agent dalam merespon pesan.
                                </p>
                                <div className="flex justify-end mt-2">
                                    <Button onClick={handleUpdateConfig} size="sm" className="gap-2 transition-all duration-300">
                                        {isSaved ? <CheckCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                        {isSaved ? "Tersimpan!" : "Simpan Konfigurasi"}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <Link to="/">
                                    <Button variant="outline" className="w-full justify-center gap-2">
                                        <Home className="w-4 h-4" /> Kembali ke Beranda
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Phone Simulator */}
                <div className="w-full lg:w-1/3 h-full flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 h-full flex flex-col relative ring-8 ring-slate-900/5">

                        {/* Header */}
                        <div className="bg-[#075e54] text-white p-3 px-4 flex items-center gap-3 z-10 shrink-0 shadow-md">
                            <Link to="/" className="lg:hidden p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/30">
                                {agentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-base truncate">{agentName}</h2>
                                <p className="text-xs text-green-100 truncate font-medium">
                                    {isTyping ? "sedang mengetik..." : "Online"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <Video className="w-5 h-5 cursor-pointer hover:text-white" />
                                <Phone className="w-5 h-5 cursor-pointer hover:text-white" />
                                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" />
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-[#efe7dd] overflow-y-auto p-4 relative scrollbar-hide"
                            style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', opacity: 1 }}>
                            <div className="space-y-3 pb-2">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] rounded-lg p-2 px-3 relative shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-[14.2px] leading-[19px] ${msg.sender === 'user'
                                                ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'
                                                : 'bg-white text-gray-900 rounded-tl-none'
                                                }`}>
                                                <p className="break-words">{msg.text}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1 opacity-60 select-none">
                                                    <span className="text-[10px] uppercase">{msg.timestamp}</span>
                                                    {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm inline-flex items-center gap-1.5 h-[36px]">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2 shrink-0 z-10 min-h-[62px]">
                            <button className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-black/5 transition-colors">
                                <Smile className="w-6 h-6" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-black/5 transition-colors -ml-1">
                                <Paperclip className="w-6 h-6" />
                            </button>
                            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ketik pesan..."
                                    className="flex-1 py-2.5 px-4 rounded-lg border-none focus:ring-0 focus:outline-none bg-white shadow-sm text-[15px] placeholder:text-slate-400"
                                />
                                {inputText.trim() ? (
                                    <button
                                        type="submit"
                                        className="p-2.5 rounded-full bg-[#00a884] text-white hover:bg-[#008f70] shadow-sm transition-transform active:scale-95 flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5 translate-x-0.5 translate-y-0.5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="p-2.5 rounded-full text-gray-500 hover:bg-black/5 transition-colors flex items-center justify-center"
                                    >
                                        <div className="w-6 h-6 border-2 border-gray-500 rounded-lg flex items-center justify-center">
                                            <div className="w-1 h-3 bg-gray-500 rounded-full" />
                                        </div>
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* Toast Notification */ }
    <AnimatePresence>
        {showToast && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50"
            >
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <CheckCheck className="w-4 h-4 text-white" />
                </div>
                <p className="font-medium text-sm">Konfigurasi tersimpan, silahkan memulai chat</p>
            </motion.div>
        )}
    </AnimatePresence>
        </div >
    );
}

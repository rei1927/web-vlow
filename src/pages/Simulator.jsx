import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile, Paperclip, CheckCheck, Settings, Home, Save } from 'lucide-react';
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
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP:", error);
        return null;
    }
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
    const [n8nWebhook, setN8nWebhook] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch system prompt on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // 1. Try to get from LocalStorage first (User's custom session)
                const storedPrompt = localStorage.getItem('vlow_system_prompt');

                // 2. Fetch "Global Default" from Supabase
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .eq('id', 1)
                    .single();

                console.log("Supabase Fetch Result:", { data, error });

                if (data) {
                    setN8nWebhook(data.n8n_webhook_url || "");

                    // If user has a stored prompt, use it. Otherwise use global default.
                    if (storedPrompt) {
                        setSystemPrompt(storedPrompt);
                    } else {
                        setSystemPrompt(data.system_prompt || "Kamu adalah asisten virtual yang ramah dan membantu untuk Vlow.AI.");
                    }
                } else {
                    if (storedPrompt) {
                        setSystemPrompt(storedPrompt);
                    } else {
                        setSystemPrompt("Kamu adalah asisten virtual yang ramah dan membantu untuk Vlow.AI.");
                    }
                    if (error) console.error("Error fetching defaults:", error);
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
                const storedPrompt = localStorage.getItem('vlow_system_prompt');
                if (storedPrompt) setSystemPrompt(storedPrompt);
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
            localStorage.setItem('vlow_system_prompt', systemPrompt);
            console.log("System prompt saved to LocalStorage");

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
            setMessages(INITIAL_MESSAGES); // Optional: Reset chat to apply new "concept"
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
                        systemPrompt: systemPrompt // Also send in body as fallback
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

                {/* Left Panel - Configuration */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-[2rem] shadow-xl p-6 border border-slate-100 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Konfigurasi AI Agent</h1>
                                <p className="text-sm text-slate-500">Sesuaikan perilaku agent kamu</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            {/* n8n Webhook URL input hidden for security */}

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
                                        placeholder="Definisikan bagaimana AI agent kamu harus bersikap..."
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
                                V
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-base truncate">Vlow.AI Assistant</h2>
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
    );
}

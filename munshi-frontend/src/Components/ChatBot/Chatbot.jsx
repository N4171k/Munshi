import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, Send, Bot, User } from "lucide-react";
import { getChatResponse } from "../../services/chat.service";
import { useSelector } from "react-redux";
import MarkDownRenderer from "../UI/MarkdownRenderer";
import RemoveMarkdown from "remove-markdown";
import { addMessageToChatHistory } from "../../services/database.service";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { content: "Hi! I'm Munshi, your financial assistant. How can I help you today?", sender: "bot" }
    ]);

    const [input, setInput] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const language = useSelector((state) => state.ui.language);
    const user = useSelector((state) => state.user);

    const recognitionRef = useRef(null);
    const transcriptRef = useRef("");
    const sendRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = {
            content: input,
            sender: "user",
            date: new Date().toISOString()
        };

        const added = await addMessageToChatHistory(newMessage);
        if (!added) return;

        setMessages(prev => [...prev, newMessage]);
        setInput("");
        setIsTyping(true);

        const response = await getChatResponse(user, input, messages, language);

        const resMessage = {
            content: response.answer,
            sender: "bot",
            date: new Date().toISOString()
        };

        const added2 = await addMessageToChatHistory(resMessage);
        if (!added2) return;

        setIsTyping(false);
        setMessages(prev => [...prev, resMessage]);
    };

    const toggleVoiceInput = () => {
        if (!isListening) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) return;

            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                transcriptRef.current = transcript;
                setInput(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (transcriptRef.current.trim() !== "") {
                    sendRef.current.click();
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
            setIsListening(true);
        } else {
            recognitionRef.current.stop();
        }
    };

    const speakText = (text) => {
        const plainText = RemoveMarkdown(text);

        const utterance = new SpeechSynthesisUtterance(plainText);

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        utterance.rate = 1.2;

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="flex h-full w-full flex-col bg-[#0B0B0F] text-gray-200">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : ""
                            }`}
                    >

                        {msg.sender === "bot" && (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow">
                                <Bot size={16} />
                            </div>
                        )}

                        <div
                            className={`max-w-[70%] px-4 py-3 text-sm rounded-2xl backdrop-blur-lg ${msg.sender === "user"
                                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black rounded-br-sm"
                                : "bg-[#16161C] border border-[#2A2A33] text-gray-200 rounded-bl-sm"
                                }`}
                        >
                            {msg.sender === "bot" ? (
                                <MarkDownRenderer message={msg.content} />
                            ) : (
                                msg.content
                            )}
                        </div>

                        {msg.sender === "bot" && (
                            <button
                                onClick={() => speakText(msg.content)}
                                className="text-gray-400 hover:text-yellow-400 transition"
                            >
                                <Volume2 size={16} />
                            </button>
                        )}

                        {msg.sender === "user" && (
                            <div className="w-9 h-9 rounded-full bg-[#1A1A22] flex items-center justify-center border border-[#333]">
                                <User size={16} />
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-full bg-yellow-600 flex items-center justify-center">
                            <Bot size={16} />
                        </div>

                        <div className="bg-[#16161C] border border-[#2A2A33] rounded-xl px-4 py-3 flex gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-[#1F1F27] bg-[#0B0B0F]">

                <div className="flex items-center gap-3 bg-[#15151B] border border-[#2A2A33] rounded-xl px-3 py-2">

                    <button
                        onClick={toggleVoiceInput}
                        className={`p-2 rounded-lg ${isListening
                            ? "bg-red-600 text-white"
                            : "text-gray-400 hover:text-yellow-400"
                            }`}
                    >
                        <Mic size={18} />
                    </button>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Munshi anything..."
                        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <button
                        ref={sendRef}
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className={`p-2 rounded-lg ${input.trim()
                            ? "bg-yellow-600 text-black hover:bg-yellow-500"
                            : "bg-[#2A2A33] text-gray-500"
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>

                {isSpeaking && (
                    <button
                        onClick={stopSpeaking}
                        className="mt-3 w-full bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Stop Speaking
                    </button>
                )}
            </div>
        </div>
    );
};

export default Chatbot;
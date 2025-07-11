'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDXcOjcyJoVZ3sB6YlYud6qyjKqphAY4HI';

interface Message {
  role: 'user' | 'model';
  content: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [fileName, setFileName] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    };
    document.body.appendChild(script);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        text += pageText + '\n';
      }

      setPdfText(text);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage: Message = { role: 'user', content: input.trim() };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  const formattedMessages = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  // Add current input
  let inputForAPI = input.trim();

  // If PDF was uploaded, append its text for context
  if (pdfText.trim()) {
    inputForAPI += `\n\nContext from PDF:\n${pdfText}`;
  }

  formattedMessages.push({
    role: 'user',
    parts: [{ text: inputForAPI }],
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: 'text/plain',
        },
      }),
    });

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '❌ I didn\'t understand that.';

    const botMessage: Message = {
      role: 'model',
      content: aiText,
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Gemini error:', error);
    setMessages((prev) => [
      ...prev,
      { role: 'model', content: '⚠️ Failed to get response from AI.' },
    ]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-transparent px-4 py-6 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text mb-4"
        >
           T E S S E R A C T
        </motion.h1>

  <Card className="bg-zinc-900/70 w-full max-w-3xl flex flex-col h-[600px] border border-purple-600 rounded-2xl shadow-[0_0_20px_rgba(165,180,252,0.1)]">
    <CardContent className="flex flex-col flex-grow p-4 overflow-hidden">
      <ScrollArea className="h-full overflow-y-auto pr-2">
        <div className="space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[75%] text-sm break-words ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-gray-200 border border-zinc-700'
                        : 'bg-zinc-900 text-gray-200 border border-zinc-700'
                    }`}
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-gray-400 border border-zinc-700 px-4 py-2 rounded-xl text-sm max-w-[75%] animate-pulse">
                    AI is typing...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex flex-col gap-2 border-t border-zinc-800 p-4 bg-zinc-900"
        >
          <div className="flex gap-2 items-center">
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex items-center gap-2 px-2 py-1 text-sm font-medium bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors"
            >
              📂 <span>Choose PDF</span>
            </label>
            <Input
              id="pdf-upload"
              accept="application/pdf"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              //className="text-sm border-none bg-zinc-800 text-gray-300 file:text-gray-400 file:bg-zinc-700"
            />
            {fileName && (
              <div className="max-w-[200px] text-sm text-gray-400 italic truncate">
                📄 {fileName}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 text-sm bg-zinc-800 text-white border border-zinc-700 focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              className="text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white"
              disabled={loading}
            >
              {loading ? '...' : 'Send'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};



export default ChatBot;

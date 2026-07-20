import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Paperclip,
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Mic,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockConversations = [
  { id: '1', name: 'Admin (Support)', role: 'Support Team', lastMessage: 'Please make sure to get the signboard photo clearly.', time: '10:42 AM', unread: 2, online: true },
  { id: '2', name: 'Vendor: Tech Hub', role: 'Electronics', lastMessage: 'I will be at the shop around 11 AM.', time: 'Yesterday', unread: 0, online: false },
  { id: '3', name: 'Admin (Approvals)', role: 'Approvals Team', lastMessage: 'Resubmission approved for Spice Corner.', time: 'Monday', unread: 0, online: true },
  { id: '4', name: 'Team Lead - East', role: 'Field Operations', lastMessage: 'New batch of vendors assigned to you.', time: 'Sunday', unread: 5, online: false },
  { id: '5', name: 'Vendor: Spice Corner', role: 'Food & Spices', lastMessage: 'Thanks for the verification!', time: 'Last week', unread: 0, online: false },
];

const mockMessages = [
  { id: '1', sender: 'Admin (Support)', text: 'Hi, are you at the Central Market yet?', time: '10:30 AM', isMe: false },
  { id: '2', sender: 'Me', text: 'Yes, just arrived. Heading to Tech Hub now.', time: '10:35 AM', isMe: true },
  { id: '3', sender: 'Admin (Support)', text: 'Great. Please make sure to get the signboard photo clearly.', time: '10:42 AM', isMe: false },
  { id: '4', sender: 'Me', text: 'Got it! I\'ll capture a clear shot of the signboard and the full storefront.', time: '10:43 AM', isMe: true },
  { id: '5', sender: 'Admin (Support)', text: 'Perfect. Also check if the vendor has updated their business hours on the sign.', time: '10:45 AM', isMe: false },
];

export default function Messages() {
  const [activeConvo, setActiveConvo] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold tracking-tight text-[#1F2937]">Messages</h1>
        <p className="text-[#6B7280] text-sm">Communicate with admins and vendors in real time.</p>
      </div>

      <Card className="flex-1 border-[#E5E7EB] shadow-sm flex overflow-hidden min-h-0 rounded-[16px]">
        {/* Threads Sidebar */}
        <div className={cn(
          "border-r border-[#E5E7EB] flex flex-col bg-white",
          showMobileChat ? "hidden sm:flex" : "w-full sm:w-80"
        )}>
          <div className="p-4 border-b border-[#F1F5F9]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-[#F8FAFC] border-[#E5E7EB] rounded-[10px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map(convo => (
              <div
                key={convo.id}
                onClick={() => {
                  setActiveConvo(convo);
                  setShowMobileChat(true);
                }}
                className={cn(
                  "p-4 border-b border-[#F1F5F9] cursor-pointer transition-all duration-200",
                  activeConvo.id === convo.id
                    ? 'bg-[#173B7B]/5 border-l-[3px] border-l-[#173B7B]'
                    : 'hover:bg-[#F8FAFC] border-l-[3px] border-l-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-11 w-11 border border-[#E5E7EB]">
                      <AvatarFallback className={cn(
                        "font-heading font-bold text-sm",
                        convo.role.includes('Admin')
                          ? 'bg-[#173B7B] text-white'
                          : 'bg-[#F36E09]/10 text-[#F36E09]'
                      )}>
                        {convo.name.split(' ')[0][0]}{convo.name.split(' ').pop()?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {convo.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={cn(
                        "text-sm truncate",
                        activeConvo.id === convo.id ? "font-semibold text-[#1F2937]" : "font-medium text-[#1F2937]"
                      )}>
                        {convo.name}
                      </h4>
                      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 ml-2">{convo.time}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unread > 0 && (
                    <div className="h-5 min-w-[20px] bg-[#F36E09] text-white rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 px-1.5">
                      {convo.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex flex-col bg-[#F8FAFC] relative",
          showMobileChat ? "flex w-full" : "hidden sm:flex flex-1"
        )}>
          {/* Chat Header */}
          <div className="h-16 border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 bg-white">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]"
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-[#173B7B]/10">
                  <AvatarFallback className={cn(
                    "font-heading font-bold text-sm",
                    activeConvo.role.includes('Admin')
                      ? 'bg-[#173B7B] text-white'
                      : 'bg-[#F36E09]/10 text-[#F36E09]'
                  )}>
                    {activeConvo.name.split(' ')[0][0]}{activeConvo.name.split(' ').pop()?.[0]}
                  </AvatarFallback>
                </Avatar>
                {activeConvo.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1F2937]">{activeConvo.name}</h3>
                <p className="text-xs text-[#9CA3AF]">
                  {activeConvo.online ? (
                    <span className="text-emerald-500 font-medium">Active now</span>
                  ) : (
                    activeConvo.role
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]"
                onClick={() => handleCall('voice')}
                data-testid="button-voice-call"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]"
                onClick={() => handleCall('video')}
                data-testid="button-video-call"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Active Call Banner */}
          <AnimatePresence>
            {isCallActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  "flex items-center justify-between px-4 sm:px-6 py-3",
                  callType === 'video'
                    ? "bg-gradient-to-r from-[#173B7B] to-[#044E75]"
                    : "bg-gradient-to-r from-[#173B7B] to-[#044E75]"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {callType === 'video' ? (
                        <Video className="h-5 w-5 text-white" />
                      ) : (
                        <Phone className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {callType === 'video' ? 'Video' : 'Voice'} Call with {activeConvo.name}
                      </p>
                      <p className="text-white/70 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          </span>
                          Connected &middot; 00:00
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={endCall}
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full px-5 h-9 shadow-lg shadow-red-500/25"
                  >
                    End Call
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="text-center">
              <span className="text-[11px] font-medium text-[#9CA3AF] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">Today</span>
            </div>
            {mockMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn("flex", msg.isMe ? 'justify-end' : 'justify-start')}
              >
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  msg.isMe
                    ? 'bg-[#173B7B] text-white rounded-br-md shadow-md shadow-[#173B7B]/10'
                    : 'bg-white text-[#1F2937] rounded-bl-md border border-[#E5E7EB] shadow-sm'
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={cn(
                    "text-[10px] block mt-1.5",
                    msg.isMe ? 'text-white/60' : 'text-[#9CA3AF]'
                  )}>
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#9CA3AF] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px] hidden sm:flex"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#9CA3AF] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px] hidden sm:flex"
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#F8FAFC] border-[#E5E7EB] rounded-[10px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#173B7B] focus:ring-[#173B7B]/10 h-11"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-[#9CA3AF] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px] sm:hidden"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="rounded-[10px] bg-[#173B7B] hover:bg-[#044E75] text-white shadow-md shadow-[#173B7B]/20 h-11 w-11"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

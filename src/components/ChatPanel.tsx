import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/hooks/useOnlineGame";
import { auth } from "@/lib/firebase";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, type: "text" | "emoji") => Promise<void>;
  partnerName: string;
}

const QUICK_EMOJIS = ["😂", "❤️", "🔥", "😘", "👍", "😍", "🙈", "💋", "😈", "🥵"];

const ChatPanel = ({ messages, onSendMessage, partnerName }: ChatPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = auth.currentUser?.uid;

  // Track unread messages when panel is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const newMessages = messages.filter(
        (m) => m.timestamp > lastReadTimestamp && m.senderId !== userId
      );
      setUnreadCount(newMessages.length);
    }
  }, [messages, isOpen, lastReadTimestamp, userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Mark as read when opening
  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setLastReadTimestamp(Date.now());
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowEmojiPicker(false);
  };

  const handleSendText = async () => {
    if (!inputValue.trim()) return;
    await onSendMessage(inputValue.trim().slice(0, 200), "text");
    setInputValue("");
    setShowEmojiPicker(false);
  };

  const handleSendEmoji = async (emoji: string) => {
    await onSendMessage(emoji, "emoji");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className={`fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-colors hover:bg-primary/90 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-50 flex h-[450px] w-[320px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  Chat with {partnerName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                    <div className="mb-2 text-4xl">💬</div>
                    <p className="text-sm text-muted-foreground">
                      No messages yet
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Send a message or emoji!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.senderId === userId;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                            message.type === "emoji"
                              ? "bg-transparent text-3xl"
                              : isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.type === "text" && (
                            <>
                              {!isMe && (
                                <p className="mb-0.5 text-xs font-medium text-muted-foreground">
                                  {message.senderName}
                                </p>
                              )}
                              <p className="text-sm break-words">{message.content}</p>
                              <p
                                className={`mt-0.5 text-[10px] ${
                                  isMe
                                    ? "text-primary-foreground/60"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </>
                          )}
                          {message.type === "emoji" && (
                            <span>{message.content}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Quick Emoji Bar */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/30 bg-muted/20"
                >
                  <div className="flex flex-wrap justify-center gap-1 p-2">
                    {QUICK_EMOJIS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSendEmoji(emoji)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl transition-colors hover:bg-muted"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="flex items-center gap-2 border-t border-border/30 bg-muted/20 p-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`h-9 w-9 shrink-0 ${
                  showEmojiPicker ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.slice(0, 200))}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="h-9 flex-1 border-border/30 bg-background/50"
                maxLength={200}
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSendText}
                disabled={!inputValue.trim()}
                className="h-9 w-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatPanel;

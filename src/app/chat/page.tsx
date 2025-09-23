'use client'

import React from 'react'
import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider, ChatModelAdapter, useLocalRuntime } from '@assistant-ui/react';
import { decodeBase64 } from '@/lib/chat-utils';

const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    // Get the last user message to send to your backend
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('No user message found');
    }

    // Extract text content from the message
    const messageContent = lastMessage.content
      .filter((content) => content.type === 'text')
      .map((content) => (content as { type: 'text'; text: string }).text)
      .join('');

    try {
      // Call your existing backend API
      const response = await fetch('/api/chat/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
        }),
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            // Handle streaming chunks
            if (line.startsWith('convid:')) {
              // Handle conversation ID if needed for your use case
              // const conversationId = line.substring(7);
              // You could store this in context or handle it as needed
            } else if (line.startsWith('c:')) {
              const contentChunk = line.substring(2); // Remove 'c:' prefix
              const decodedChunk = decodeBase64(contentChunk);
              accumulatedContent += decodedChunk;
              
              // Yield the accumulated content
              yield {
                content: [{ type: "text", text: accumulatedContent }],
              };
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Handle abort gracefully
        return;
      }
      throw error;
    }
  },
};

function ChatPage() {
  const runtime = useLocalRuntime(MyModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
    <div className='h-screen'>
      <Thread />
    </div>
    </AssistantRuntimeProvider>
  )
}

export default ChatPage
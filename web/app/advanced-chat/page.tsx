"use client";

import React, { useState, useCallback } from 'react';

// ========== CLIENT-SIDE COMPONENT ==========

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: Array<{
    type: 'text' | 'tool-weather' | 'tool-mediaProcess' | 'tool-budget';
    text?: string;
    toolResult?: any;
  }>;
}

interface ChatConfig {
  executionMode: 'streaming' | 'advanced-loop' | 'manual-loop';
  budgetLimit: number;
  qualityThreshold: number;
  maxSteps: number;
  enableTools: boolean;
}

export default function AdvancedChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig>({
    executionMode: 'streaming',
    budgetLimit: 1.00,
    qualityThreshold: 0.8,
    maxSteps: 10,
    enableTools: true
  });

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text }]
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Send to our Next.js API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          executionMode: config.executionMode,
          config: {
            budgetLimit: config.budgetLimit,
            qualityThreshold: config.qualityThreshold,
            maxSteps: config.maxSteps,
            enableTools: config.enableTools
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        parts: []
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'text' || data.type === 'content') {
                assistantMessage.parts.push({
                  type: 'text',
                  text: data.content || data.text
                });
              } else if (data.type?.startsWith('tool-')) {
                assistantMessage.parts.push({
                  type: data.type,
                  toolResult: data.toolResult
                });
              }
              
              setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1]?.role === 'user') {
                  newMessages.push(assistantMessage);
                } else {
                  newMessages[newMessages.length - 1] = assistantMessage;
                }
                return newMessages;
              });

            } catch (e) {
              // Parse error, continue
              console.warn('Failed to parse streaming data:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        parts: [{
          type: 'text',
          text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    setInput('');
  }, [messages, config, isLoading]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setInput('');
  }, []);

  const updateConfig = useCallback((updates: Partial<ChatConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced AI Chat with Loop Control
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Experience AI SDK v6 patterns with streaming, tools, and advanced loop control
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Execution Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Execution Mode
              </label>
              <select
                value={config.executionMode}
                onChange={(e) => updateConfig({ executionMode: e.target.value as any })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="streaming">Streaming</option>
                <option value="advanced-loop">Advanced Loop</option>
                <option value="manual-loop">Manual Loop</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget Limit ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10.00"
                value={config.budgetLimit}
                onChange={(e) => updateConfig({ budgetLimit: parseFloat(e.target.value) })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality Threshold
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={config.qualityThreshold}
                onChange={(e) => updateConfig({ qualityThreshold: parseFloat(e.target.value) })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Steps
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.maxSteps}
                onChange={(e) => updateConfig({ maxSteps: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enable Tools
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.enableTools}
                  onChange={(e) => updateConfig({ enableTools: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Tools Enabled</span>
              </label>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="h-96 overflow-y-auto p-6 space-y-4 border-b border-gray-200 dark:border-gray-700">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="text-lg mb-2">🤖 Welcome to Advanced AI Chat!</p>
                <p className="text-sm">
                  Try asking about the weather, media processing, or just chat naturally.
                  <br />
                  Current mode: <strong>{config.executionMode}</strong>
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  {/* Role indicator */}
                  <div className="text-xs opacity-75 mb-1">
                    {message.role === 'user' ? '👤 You' : '🤖 AI'}
                  </div>
                  
                  {/* Message parts */}
                  {message.parts.map((part, index) => (
                    <div key={index}>
                      {part.type === 'text' && (
                        <div className="whitespace-pre-wrap">{part.text}</div>
                      )}
                      {(part.type === 'tool-weather' || part.type === 'tool-mediaProcess' || part.type === 'tool-budget') && (
                        <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                          <div className="font-medium mb-1">
                            🔧 Tool: {part.type.replace('tool-', '')}
                          </div>
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(part.toolResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Message metadata */}
                  {message.role === 'assistant' && (
                    <div className="mt-2 text-xs opacity-50 border-t border-current pt-1">
                      Mode: {config.executionMode}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Form */}
          <div className="p-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getPlaceholderForMode(config.executionMode)}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
              <button
                type="button"
                onClick={resetConversation}
                className="px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                🔄
              </button>
            </form>
            
            {/* Quick suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {getSuggestions(config.executionMode).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== UTILITY FUNCTIONS ==========

function getPlaceholderForMode(mode: string): string {
  switch (mode) {
    case 'streaming':
      return "Ask me anything... (streaming with tools)";
    case 'advanced-loop':
      return "Describe a media processing task... (advanced loop control)";
    case 'manual-loop':
      return "Enter a complex request... (manual loop control)";
    default:
      return "Type your message...";
  }
}

function getSuggestions(mode: string): string[] {
  switch (mode) {
    case 'streaming':
      return [
        "What's the weather in New York?",
        "Tell me about artificial intelligence",
        "Help me plan a weekend trip"
      ];
    case 'advanced-loop':
      return [
        "Process audio file: title 'Summer Vibes' by DJ Mix",
        "Generate video from music track 'Ocean Waves'",
        "Analyze and enhance media content"
      ];
    case 'manual-loop':
      return [
        "Complex multi-step task with budget tracking",
        "Execute workflow with quality control",
        "Run automated pipeline with optimization"
      ];
    default:
      return ["Hello!", "How are you?", "Tell me something interesting"];
  }
}
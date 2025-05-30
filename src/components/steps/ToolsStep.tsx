
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  actions: number;
  enabled: boolean;
  code: string;
  defaultCode: string;
}

const defaultCodes = {
  "task-actions": `// Task Actions Configuration
function handleTaskAction(action, data) {
  switch(action) {
    case 'create':
      return createTask(data.title, data.description, data.dueDate);
    case 'update':
      return updateTask(data.id, data.updates);
    case 'assign':
      return assignTask(data.taskId, data.userId);
    default:
      console.log('Unknown action:', action);
  }
}

// Custom task creation logic
function createTask(title, description, dueDate) {
  // Your custom task creation logic here
  console.log('Creating task:', { title, description, dueDate });
}`,

  "ai-assistant": `// AI Assistant Configuration
const aiConfig = {
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 1000
};

function processAIRequest(prompt, context) {
  // Custom AI processing logic
  const enhancedPrompt = \`
    Context: \${context}
    User Request: \${prompt}
    
    Please provide a helpful response.
  \`;
  
  return callAI(enhancedPrompt, aiConfig);
}`,

  "media": `// Media Processing Configuration
function processMedia(file, options = {}) {
  const { type, size, format } = options;
  
  switch(file.type) {
    case 'image':
      return processImage(file, format);
    case 'video':
      return processVideo(file, format);
    case 'document':
      return processDocument(file);
    default:
      return { error: 'Unsupported file type' };
  }
}

function processImage(image, format = 'jpeg') {
  // Custom image processing logic
  console.log('Processing image:', image.name);
}`,

  "slack": `// Slack Integration Configuration
const slackConfig = {
  defaultChannel: '#general',
  messageFormat: 'markdown'
};

function sendSlackMessage(channel, message, options = {}) {
  const formattedMessage = {
    channel: channel || slackConfig.defaultChannel,
    text: message,
    ...options
  };
  
  // Custom Slack message logic
  console.log('Sending to Slack:', formattedMessage);
  return postToSlack(formattedMessage);
}`,

  "gmail": `// Gmail Integration Configuration
const emailConfig = {
  defaultSubject: 'Automated Message',
  signature: 'Sent by AI Agent'
};

function sendEmail(to, subject, body, options = {}) {
  const email = {
    to: to,
    subject: subject || emailConfig.defaultSubject,
    body: body + '\\n\\n' + emailConfig.signature,
    ...options
  };
  
  // Custom email logic
  console.log('Sending email:', email);
  return sendGmailMessage(email);
}`
};

const availableTools: Tool[] = [
  {
    id: "task-actions",
    name: "Task Actions",
    description: "Use your agent to manage tasks in your projects, update due dates, assignments, and more.",
    icon: "🧑‍🤝‍🧑",
    actions: 5,
    enabled: true,
    code: defaultCodes["task-actions"],
    defaultCode: defaultCodes["task-actions"]
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Access AI capabilities for content generation and analysis.",
    icon: "🤖",
    actions: 2,
    enabled: false,
    code: defaultCodes["ai-assistant"],
    defaultCode: defaultCodes["ai-assistant"]
  },
  {
    id: "media",
    name: "Media",
    description: "Handle image processing, file uploads, and multimedia content.",
    icon: "🎬",
    actions: 3,
    enabled: true,
    code: defaultCodes["media"],
    defaultCode: defaultCodes["media"]
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages, create channels, and manage Slack communications.",
    icon: "💬",
    actions: 5,
    enabled: false,
    code: defaultCodes["slack"],
    defaultCode: defaultCodes["slack"]
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send emails, read messages, and manage Gmail functionality.",
    icon: "📧",
    actions: 3,
    enabled: false,
    code: defaultCodes["gmail"],
    defaultCode: defaultCodes["gmail"]
  }
];

export const ToolsStep = ({ data, onUpdate }: any) => {
  const [tools, setTools] = useState<Tool[]>(availableTools);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool =>
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  const updateToolCode = (toolId: string, code: string) => {
    setTools(tools.map(tool =>
      tool.id === toolId ? { ...tool, code } : tool
    ));
  };

  const toggleToolExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Available Tools</h3>
        <p className="text-gray-600">Select the tools your agent can use and configure their behavior with custom code.</p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`transition-colors ${
              tool.enabled ? "border-blue-200 bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <CardContent className="p-0">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleTool(tool.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{tool.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{tool.name}</h4>
                      <span className="text-sm text-gray-500">{tool.actions} actions</span>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={() => toggleTool(tool.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {tool.enabled && (
                <CodeEditor
                  code={tool.code}
                  onCodeChange={(code) => updateToolCode(tool.id, code)}
                  defaultCode={tool.defaultCode}
                  isExpanded={expandedTools.has(tool.id)}
                  onToggleExpanded={() => toggleToolExpanded(tool.id)}
                  placeholder={`Configure ${tool.name} behavior...`}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {tools.filter(t => t.enabled).length} of {tools.length} tools selected
      </div>
    </div>
  );
};

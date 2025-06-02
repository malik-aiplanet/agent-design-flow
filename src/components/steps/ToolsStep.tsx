
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";

interface Tool {
  id: string;
  name: string;
  description: string;
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
}`,

  "database": `// Database Operations Configuration
function queryDatabase(query, params = {}) {
  // Custom database query logic
  console.log('Executing query:', query, params);
  
  switch(query.type) {
    case 'SELECT':
      return executeSelect(query, params);
    case 'INSERT':
      return executeInsert(query, params);
    case 'UPDATE':
      return executeUpdate(query, params);
    default:
      return { error: 'Unsupported query type' };
  }
}`,

  "calendar": `// Calendar Integration Configuration
const calendarConfig = {
  defaultDuration: 60,
  timezone: 'UTC'
};

function createEvent(title, startTime, options = {}) {
  const event = {
    title,
    startTime,
    duration: options.duration || calendarConfig.defaultDuration,
    timezone: options.timezone || calendarConfig.timezone,
    ...options
  };
  
  // Custom calendar logic
  console.log('Creating calendar event:', event);
  return scheduleEvent(event);
}`,

  "webhooks": `// Webhook Configuration
function handleWebhook(event, payload) {
  // Custom webhook processing logic
  console.log('Processing webhook:', event, payload);
  
  switch(event) {
    case 'data.received':
      return processDataReceived(payload);
    case 'user.action':
      return processUserAction(payload);
    default:
      return { status: 'unhandled' };
  }
}`,

  "notifications": `// Notification System Configuration
const notificationConfig = {
  channels: ['email', 'push', 'sms'],
  defaultChannel: 'email'
};

function sendNotification(message, recipient, options = {}) {
  const notification = {
    message,
    recipient,
    channel: options.channel || notificationConfig.defaultChannel,
    priority: options.priority || 'normal',
    ...options
  };
  
  // Custom notification logic
  console.log('Sending notification:', notification);
  return deliverNotification(notification);
}`
};

const availableTools: Tool[] = [
  {
    id: "task-actions",
    name: "Task Management",
    description: "Create, update, and manage tasks in your projects",
    actions: 5,
    enabled: true,
    code: defaultCodes["task-actions"],
    defaultCode: defaultCodes["task-actions"]
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Access AI capabilities for content generation and analysis",
    actions: 2,
    enabled: false,
    code: defaultCodes["ai-assistant"],
    defaultCode: defaultCodes["ai-assistant"]
  },
  {
    id: "media",
    name: "Media Processing",
    description: "Handle image processing, file uploads, and multimedia content",
    actions: 3,
    enabled: true,
    code: defaultCodes["media"],
    defaultCode: defaultCodes["media"]
  },
  {
    id: "slack",
    name: "Slack Integration",
    description: "Send messages, create channels, and manage Slack communications",
    actions: 5,
    enabled: false,
    code: defaultCodes["slack"],
    defaultCode: defaultCodes["slack"]
  },
  {
    id: "gmail",
    name: "Gmail Integration",
    description: "Send emails, read messages, and manage Gmail functionality",
    actions: 3,
    enabled: false,
    code: defaultCodes["gmail"],
    defaultCode: defaultCodes["gmail"]
  },
  {
    id: "database",
    name: "Database Operations",
    description: "Query and manage database operations and data storage",
    actions: 4,
    enabled: false,
    code: defaultCodes["database"],
    defaultCode: defaultCodes["database"]
  },
  {
    id: "calendar",
    name: "Calendar Management",
    description: "Schedule events and manage calendar integrations",
    actions: 2,
    enabled: false,
    code: defaultCodes["calendar"],
    defaultCode: defaultCodes["calendar"]
  },
  {
    id: "webhooks",
    name: "Webhook Processing",
    description: "Handle incoming webhooks and external integrations",
    actions: 3,
    enabled: false,
    code: defaultCodes["webhooks"],
    defaultCode: defaultCodes["webhooks"]
  },
  {
    id: "notifications",
    name: "Notification System",
    description: "Send notifications via email, SMS, and push notifications",
    actions: 4,
    enabled: false,
    code: defaultCodes["notifications"],
    defaultCode: defaultCodes["notifications"]
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
    <div className="space-y-8 max-w-5xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Tools & Integrations</h3>
        <p className="text-gray-600 text-lg">Select the tools your agent can use and configure their behavior with custom code.</p>
      </div>

      {/* Tool Grid - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              tool.enabled ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CardContent className="p-0">
              <div 
                className="flex items-start justify-between p-4 cursor-pointer"
                onClick={() => toggleTool(tool.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{tool.name}</h4>
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={() => toggleTool(tool.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{tool.description}</p>
                  <div className="text-xs text-gray-500">
                    {tool.actions} action{tool.actions !== 1 ? 's' : ''}
                  </div>
                </div>
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

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
        <span>{tools.filter(t => t.enabled).length} of {tools.length} tools selected</span>
        <span className="text-xs">Tools can be reconfigured anytime after deployment</span>
      </div>
    </div>
  );
};

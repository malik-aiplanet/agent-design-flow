import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "./tools/ToolCard";
import { ToolConfigurationDrawer } from "./tools/ToolConfigurationDrawer";
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
const availableTools: Tool[] = [{
  id: "task-actions",
  name: "Task Management",
  description: "Create, update, and manage tasks in your projects",
  actions: 5,
  enabled: true,
  code: defaultCodes["task-actions"],
  defaultCode: defaultCodes["task-actions"]
}, {
  id: "ai-assistant",
  name: "AI Assistant",
  description: "Access AI capabilities for content generation and analysis",
  actions: 2,
  enabled: false,
  code: defaultCodes["ai-assistant"],
  defaultCode: defaultCodes["ai-assistant"]
}, {
  id: "media",
  name: "Media Processing",
  description: "Handle image processing, file uploads, and multimedia content",
  actions: 3,
  enabled: true,
  code: defaultCodes["media"],
  defaultCode: defaultCodes["media"]
}, {
  id: "slack",
  name: "Slack Integration",
  description: "Send messages, create channels, and manage Slack communications",
  actions: 5,
  enabled: false,
  code: defaultCodes["slack"],
  defaultCode: defaultCodes["slack"]
}, {
  id: "gmail",
  name: "Gmail Integration",
  description: "Send emails, read messages, and manage Gmail functionality",
  actions: 3,
  enabled: false,
  code: defaultCodes["gmail"],
  defaultCode: defaultCodes["gmail"]
}, {
  id: "database",
  name: "Database Operations",
  description: "Query and manage database operations and data storage",
  actions: 4,
  enabled: false,
  code: defaultCodes["database"],
  defaultCode: defaultCodes["database"]
}, {
  id: "calendar",
  name: "Calendar Management",
  description: "Schedule events and manage calendar integrations",
  actions: 2,
  enabled: false,
  code: defaultCodes["calendar"],
  defaultCode: defaultCodes["calendar"]
}, {
  id: "webhooks",
  name: "Webhook Processing",
  description: "Handle incoming webhooks and external integrations",
  actions: 3,
  enabled: false,
  code: defaultCodes["webhooks"],
  defaultCode: defaultCodes["webhooks"]
}, {
  id: "notifications",
  name: "Notification System",
  description: "Send notifications via email, SMS, and push notifications",
  actions: 4,
  enabled: false,
  code: defaultCodes["notifications"],
  defaultCode: defaultCodes["notifications"]
}];
export const ToolsStep = ({
  data,
  onUpdate
}: any) => {
  const [tools, setTools] = useState<Tool[]>(availableTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool => tool.id === toolId ? {
      ...tool,
      enabled: !tool.enabled
    } : tool));
  };
  const updateToolCode = (toolId: string, code: string) => {
    setTools(tools.map(tool => tool.id === toolId ? {
      ...tool,
      code
    } : tool));
  };
  const openConfiguration = (toolId: string) => {
    setSelectedToolId(toolId);
    setIsDrawerOpen(true);
  };
  const closeConfiguration = () => {
    setIsDrawerOpen(false);
    setSelectedToolId(null);
  };
  const filteredTools = tools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedTool = selectedToolId ? tools.find(t => t.id === selectedToolId) : null;
  return <div className="space-y-8 max-w-6xl">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-900">Tools & Integrations</h3>
        <p className="text-gray-600 text-lg">
          Select the tools your agent can use and configure their behavior.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map(tool => <ToolCard key={tool.id} tool={tool} onToggle={toggleTool} onConfigure={openConfiguration} />)}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
        <span>{tools.filter(t => t.enabled).length} of {tools.length} tools selected</span>
        
      </div>

      {/* Configuration Drawer */}
      <ToolConfigurationDrawer isOpen={isDrawerOpen} onClose={closeConfiguration} tool={selectedTool} onCodeChange={updateToolCode} />
    </div>;
};
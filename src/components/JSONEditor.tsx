
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileText, Play } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface JSONEditorProps {
  data: any;
  title: string;
  onUpdate?: (data: any) => void;
  readOnly?: boolean;
}

export const JSONEditor = ({ data, title, onUpdate, readOnly = true }: JSONEditorProps) => {
  const [jsonValue, setJsonValue] = useState(() => JSON.stringify(data, null, 2));
  const [currentView, setCurrentView] = useState<"form" | "json">("form");
  const [error, setError] = useState<string | null>(null);

  const handleJSONChange = (value: string) => {
    setJsonValue(value);
    setError(null);
    
    if (!readOnly && onUpdate) {
      try {
        const parsed = JSON.parse(value);
        onUpdate(parsed);
      } catch (e) {
        setError("Invalid JSON format");
      }
    }
  };

  const handleTest = () => {
    console.log("Testing configuration:", data);
    // Add test logic here
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              className="h-8 px-3 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "form" | "json")}>
          <div className="px-6 border-b">
            <TabsList className="h-8">
              <TabsTrigger value="form" className="text-xs h-6 px-3">
                <FileText className="h-3 w-3 mr-1" />
                Form Editor
              </TabsTrigger>
              <TabsTrigger value="json" className="text-xs h-6 px-3">
                <Code className="h-3 w-3 mr-1" />
                JSON Editor
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="form" className="p-6 m-0">
            <div className="text-sm text-gray-600">
              Form editor interface would go here. For now, showing JSON view.
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm font-mono text-gray-700 max-h-80 overflow-y-auto">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="p-0 m-0">
            <div className="relative">
              <Textarea
                value={jsonValue}
                onChange={(e) => handleJSONChange(e.target.value)}
                readOnly={readOnly}
                className="font-mono text-sm border-0 rounded-none bg-gray-900 text-green-400 min-h-80 resize-none focus:ring-0 focus:border-0"
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4aa',
                  lineHeight: '1.4'
                }}
              />
              {error && (
                <div className="absolute bottom-2 left-2 text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded">
                  {error}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const outputFormats = [
  { id: "json", label: "JSON", description: "Structured data format" },
  { id: "text", label: "TEXT", description: "Plain text response" },
  { id: "markdown", label: "MARKDOWN", description: "Formatted text with markup" }
];

export const OutputStep = ({ data, onUpdate }: any) => {
  const [selectedFormat, setSelectedFormat] = useState("json");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Output Format</h3>
        <p className="text-gray-600">Choose how your agent will format its responses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {outputFormats.map((format) => (
              <Button
                key={format.id}
                variant={selectedFormat === format.id ? "default" : "outline"}
                onClick={() => setSelectedFormat(format.id)}
                className="flex-1 h-auto p-4 flex-col items-center"
              >
                <span className="font-medium">{format.label}</span>
                <span className="text-xs text-gray-500 mt-1">{format.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            {selectedFormat === "json" && (
              <pre>{`{
  "response": "Sample agent response",
  "confidence": 0.95,
  "timestamp": "2024-01-01T00:00:00Z"
}`}</pre>
            )}
            {selectedFormat === "text" && (
              <div>Sample agent response in plain text format.</div>
            )}
            {selectedFormat === "markdown" && (
              <div>
                <strong>Sample agent response</strong> in <em>markdown</em> format with formatting.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

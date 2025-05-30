
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OutputFormatCard = () => {
  const [outputFormat, setOutputFormat] = useState<string[]>(["json"]);

  const toggleOutputFormat = (format: string) => {
    setOutputFormat(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Output Format</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          {["json", "markdown"].map(format => (
            <button
              key={format}
              onClick={() => toggleOutputFormat(format)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                outputFormat.includes(format)
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

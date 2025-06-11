import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileType } from "lucide-react";

interface OutputFormatCardProps {
    outputFormat?: string[];
    onUpdate?: (data: { outputFormat: string[] }) => void;
}

export const OutputFormatCard = ({ outputFormat, onUpdate }: OutputFormatCardProps) => {
  const selectedFormats = outputFormat || ["json"];

  const toggleOutputFormat = (format: string) => {
    const newFormats = selectedFormats.includes(format)
        ? selectedFormats.filter(f => f !== format)
        : [...selectedFormats, format];
    onUpdate?.({ outputFormat: newFormats });
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FileType className="h-4 w-4 text-green-600" />
          </div>
          Output Format
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Select preferred response formats
        </Label>
        <div className="flex gap-3">
          {[
            { key: "json", label: "JSON", desc: "Structured data format" },
            { key: "markdown", label: "Markdown", desc: "Rich text format" },
            { key: "text", label: "Text", desc: "Simple text response" }
          ].map(format => (
            <button
              key={format.key}
              onClick={() => toggleOutputFormat(format.key)}
              className={`p-4 rounded-lg font-medium transition-all border-2 text-left ${
                selectedFormats.includes(format.key)
                  ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="font-semibold">{format.label}</div>
              <div className="text-xs opacity-75 mt-1">{format.desc}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

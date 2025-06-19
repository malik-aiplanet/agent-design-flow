import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Form } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InputList from "../input-list";
import Wand from "@/components/icons/wand";
import Sparkle from "@/components/icons/sparkle";
import { Badge } from "@/components/ui/badge";

const dummy_inputs: InputData[] = [
  {
    provider: "autogen_core.io.TextInput",
    component_type: "input",
    version: 1,
    component_version: 1,
    description: "Text input component for direct text input",
    label: "TextInput",
    placeholder: "Placeholder Text",
    config: { content: "Hello, world!", encoding: "utf-8" },
  },
  {
    provider: "autogen_core.io.URLInput",
    component_type: "input",
    version: 1,
    component_version: 1,
    description: "URL input component for fetching data from APIs",
    label: "URLInput",
    placeholder: "Placeholder Text",
    config: {
      url: "https://api.example.com/data",
      headers: { Authorization: "Bearer token" },
      timeout: 30,
      verify_ssl: true,
    },
  },
  {
    provider: "autogen_core.io.FileInput",
    component_type: "input",
    version: 1,
    component_version: 1,
    description: "File input component for uploading files",
    placeholder: "",
    label: "FileInput",
    config: {
      name: "hello.pdf",
      encoding: "utf-8",
      file_type: "pdf",
    },
  },
];

interface FileUploadUIProps {
  onFilesChange: (files: FileType[]) => void;
  onGenerate: (files: FileType[]) => void;
  maxFiles: number;
}

const TextGeneration: React.FC<FileUploadUIProps> = ({
  onFilesChange,
  onGenerate,
  maxFiles,
}) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [showOutput, setShowOutput] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsGenerating(true);
    setShowOutput(true);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 52) {
          clearInterval(interval);
          return 52;
        }
        return prev + 1;
      });
    }, 50);

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    // Process form data here

    onGenerate(files);
  };

  const handleFileChange = (inputLabel: string) => (file: File | null) => {
    if (file) {
      // Handle file upload
      console.log(`File uploaded for ${inputLabel}:`, file);
    }
  };

  const handleRemoveFile = (inputLabel: string) => () => {
    // Handle file removal
    console.log(`File removed for ${inputLabel}`);
  };

  return (
    <div className="flex flex-col items-center h-full bg-gray-50 p-8">
      <div className="flex flex-col gap-6.5 w-full max-w-4xl">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Candidate Report Generator
          </h1>
          <p className="text-gray-600 mt-1">
            Creates clear, structured reports summarizing candidate details,
            assessments, to support informed hiring decisions.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center border-b border-b-gray-200 p-4">
            <div className="flex gap-1 items-center">
              <Wand className="h-6 w-6" />
              <h2 className="text-xl -tracking-[1%] leading-7 font-semibold">
                Inputs
              </h2>
            </div>
            <Button className="flex gap-2 items-center bg-teal-800 hover:bg-teal-800/80 cursor-pointer">
              <Sparkle className="h-6 w-6" />
              <p>Generate</p>
            </Button>
          </div>
          <Form className="pb-8" method="post" onSubmit={handleGenerate}>
            {/* Inputs Section */}
            <InputList inputs={dummy_inputs} />
          </Form>
        </div>

        {/* Output Section */}
        {showOutput && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-6 border-b border-b-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl -tracking-[1%] leading-7 font-semibold">
                  Output
                </h2>
              </div>
              <Badge className="bg-green-300/40" variant={"secondary"}>
                In Progress
              </Badge>
            </div>
            <p>Content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextGeneration;

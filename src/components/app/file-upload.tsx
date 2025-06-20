import Upload from "@/components/icons/upload";

type FileUploadBoxProps = {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  id: string;
  fileName?: string;
  accept?: string;
};

export default function FileUploadBox({
  file,
  onFileChange,
  onRemove,
  id,
  fileName,
  accept = ".pdf,.doc,.docx",
}: FileUploadBoxProps) {
  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        onChange={onFileChange}
        accept={accept}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="block w-full p-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">
            {file ? file.name : fileName}
          </span>
          {file && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="text-xs text-gray-500 hover:text-red-600 mt-1"
            >
              Remove
            </button>
          )}
        </div>
      </label>
    </div>
  );
}

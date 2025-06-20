import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploadBox from "@/components/app/file-upload";

type Props = {
  inputs: InputData[];
};

export default function InputList(props: Props) {
  return (
    <>
      {props.inputs.map((di) => {
        if (di.component.label === "TextInput") {
          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <Input className="" type="text" name={di.component.label} />
            </div>
          );
        } else if (di.component.label === "URLInput") {
          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <Input className="" type="text" name={di.component.label} />
            </div>
          );
        } else if (di.component.label === "FileInput") {
          const onRemove = () => {};
          const onFileChange = () => {};

          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <FileUploadBox
                file={null}
                id={di.component.config.encoding}
                fileName={di.component.config.name}
                accept={di.component.config.file_type}
                onFileChange={onFileChange}
                onRemove={onRemove}
              />
            </div>
          );
        }
      })}
    </>
  );
}

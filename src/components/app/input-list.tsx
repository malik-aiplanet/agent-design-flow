import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploadBox from "@/components/app/file-upload";
import { useAppStore } from "@/lib/app-store";

export default function InputList() {
  const store = useAppStore();
  const inputs = store.team.team_inputs;

  const updateInput = (input: TeamData["team_inputs"][number]) => {
    const modifiedInputs = [...store.team.team_inputs];
    const i = store.team.team_inputs.findIndex((di) => di.id === input.id);
    console.log(`${input.id}  ${modifiedInputs[i].id}`);

    modifiedInputs[i].component = input.component;

    store.setTeam({ ...store.team, team_inputs: [...modifiedInputs] });
  };

  return (
    <>
      {inputs.map((di) => {
        if (di.component.label === "TextInput") {
          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateInput({
              ...di,
              component: {
                ...di.component,
                config: {
                  content: e.target.value,
                  encoding: "utf-8",
                },
              } as TextInput,
            });
          };

          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <Input
                onChange={onChange}
                className=""
                type="text"
                name={di.component.label}
              />
            </div>
          );
        } else if (di.component.label === "URLInput") {
          const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateInput({
              ...di,
              component: {
                ...di.component,
                config: {
                  url: e.target.value,
                },
              } as URLInput,
            });
          };

          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <Input
                onChange={onChange}
                className=""
                type="text"
                name={di.component.label}
              />
            </div>
          );
        } else if (di.component.label === "FileInput") {
          const onRemove = () =>
            updateInput({
              ...di,
              component: {
                ...di.component,
                config: {},
              } as FileInput,
            });
          const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            updateInput({
              ...di,
              component: {
                ...di.component,
                config: {
                  name: e.target.files.item(0)?.name,
                  encoding: "utf-8",
                  file_type: e.target.files.item(0)?.type,
                },
              } as FileInput,
            });

          return (
            <div key={di.id} className="px-8 pt-8 flex flex-col gap-2">
              <Label htmlFor={di.component.label}>{di.component.label}</Label>
              <FileUploadBox
                file={null}
                id={di.id}
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
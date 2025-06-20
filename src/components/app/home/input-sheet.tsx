import React from "react";
import { cn } from "@/lib/utils";
import InputList from "../input-list";

type Props = {
  inputs: InputData[];
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InputsSheet({ inputs, collapse, setCollapse }: Props) {
  return (
    <div className="min-w-96 h-full right-0 bg-white">
      <div
        title="Toggle Inputs"
        className={cn(
          "flex gap-4 items-center p-4 transition-all",
          collapse ? "min-w-2" : "min-w-lg"
        )}
      >
        {!collapse && <span className="font-semibold text-lg">Inputs</span>}
      </div>
      <hr className="border-t-1 border-t-gray-300" />
      <div>{!collapse && <InputList inputs={inputs} />}</div>
    </div>
  );
}

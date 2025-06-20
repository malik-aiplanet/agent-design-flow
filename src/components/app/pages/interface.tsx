import ChatInterface from "@/components/app/home/chat-interface";
import TextGeneration from "@/components/app/home/text-genreration";
import { get_client_env } from "@/lib/env";
import axios from "axios";
import InputsSheet from "@/components/app/home/input-sheet";
import { useEffect, useState } from "react";
import { SocketProvider } from "@/contexts/SocketContext";
import { useParams, type Params } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/app-store";

export const loader = async (params: Readonly<Params<string>>) => {
  const env = get_client_env();
  const teamId = params.teamId;
  const conversationId = params.conversationId;

  const token_type = localStorage.getItem("token_type");
  const access_token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `${token_type} ${access_token}`,
  };

  if (typeof conversationId !== "undefined") {
    const app_data_response = await axios.get<AppData>(
      `${env.backend_url}/private/sessions/${conversationId}`,
      { headers }
    );

    return app_data_response.data;
  }

  return null;
};

export default function Interface() {
  const [collapse, setCollapse] = useState(false);
  const params = useParams();
  const store = useAppStore();

  const { data: loaderData, isLoading } = useQuery({
    queryKey: [params.conversationId],
    queryFn: () => loader(params),
  });

  useEffect(() => {
    if (isLoading) return;

    store.setSelectedApp(loaderData);
  }, [isLoading]);

  // TODO: implement these
  const handleFilesChange = (files: FileType[]) => {
    // TODO: send files to backend
  };

  const handleGenerate = (files: FileType[]) => {
    console.log("Generating with files:", files);
    // Process files here
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <SocketProvider>
      <div className="flex flex-1 min-w-0 min-h-0 overflow-hidden">
        <div className="flex-1 bg-neutral-100 overflow-auto">
          {loaderData && <ChatInterface app={loaderData} />}

          {/* {loaderData.component_type === "FileInput" && (
            <TextGeneration
              onFilesChange={handleFilesChange}
              onGenerate={handleGenerate}
              maxFiles={10}
            />
          )} */}
        </div>
        {/* Inputs sheet */}
        {store.team && (
          <InputsSheet collapse={collapse} setCollapse={setCollapse} />
        )}
      </div>
    </SocketProvider>
  );
}

import { Outlet, type Params, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import Header from "@/components/app/header";
import Sidebar from "@/components/app/sidebar";
import axios from "axios";
import { get_client_env } from "@/lib/env";
import { useAppStore } from "@/lib/app-store";
import { useQuery } from "@tanstack/react-query";

export const loader = async (params: Readonly<Params<string>>) => {
  // check if authenticated

  const env = get_client_env();

  const token_type = localStorage.getItem("token_type");
  const access_token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `${token_type} ${access_token}`,
  };

  const user_data_response = await axios.get<UserData>(
    `${env.backend_url}/private/users/me`,
    { headers }
  );

  const team_response = await axios.get<TeamData>(
    `${env.backend_url}/private/teams/${params.teamId}`,
    { headers }
  );

  // TODO fetch by team
  const sessions_response = await axios.get<FetchApps>(
    `${env.backend_url}/private/sessions/?team_id=${params.teamId}`,
    { headers }
  );

  const current_session_id =
    params.conversationId ?? sessions_response.data.items.length > 0
      ? sessions_response.data.items[0].id
      : null;

  return {
    current_session_id,
    team: team_response.data,
    sessions: sessions_response.data.items,
    user_data: user_data_response.data,
    // outputs: outputs_response.data.items,
  };
};

export default function HomeRoute() {
  const navigate = useNavigate();
  const params = useParams();

  const store = useAppStore();

  const { data: loader_data, isLoading } = useQuery({
    queryKey: [params.teamId],
    queryFn: () => loader(params),
    initialData: {
      team: null,
      current_session_id: null,
      sessions: [],
      user_data: null,
    },
  });

  useEffect(() => {
    if (isLoading) return;

    store.setApps(loader_data.sessions);
    store.setTeam(loader_data.team);

    // redirect to the app page
    if (loader_data.current_session_id) {
      navigate(`/chat/${params.teamId}/${loader_data.current_session_id}`);
    }
  }, [isLoading, loader_data]);

  return (
    store.team && (
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <div className="flex justify-between min-h-0 h-full">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    )
  );
}

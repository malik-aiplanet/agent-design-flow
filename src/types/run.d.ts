type RunData = {
    id: string;
    task: Record<string, any>;
    team_config: Record<string, any>;
    status: "active" | "pending" | "complete" | "stopped" | "error";
    session_id: string;
    user_id: string;
    team_result: Record<string, any>;
    error_message: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean
}
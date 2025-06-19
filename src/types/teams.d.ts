type ComponentType = "TextInput" | "FileInput" | "URLInput"

interface BaseInput {
    provider: string;
    component_type: string;
    version: number;
    component_version: number;
    description: string;
    label: ComponentType;
}

interface TextInput extends BaseInput {
    label: "TextInput";
    config: {
        content: string;
        encoding: string;
    }
}

interface URLInput extends BaseInput {
    label: "URLInput";
    config: {
        url: string;
        headers: { [key: string]: string };
        timeout: number;
        verify_ssl: boolean;
    }
}

interface FileInput extends BaseInput {
    label: "FileInput";
    config: {
        name: string;
        encoding: string;
        file_type: string;
    }
}

type InputData = {
    id: string;
    organization_id: string;
    component: TextInput | URLInput | FileInput;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}

type ModelData = {
    component_type: "model";
    component_version: number;
    config: {
        api_key: string;
        model: string;
        },
    description: string;
    label: string;
    provider: string;
    version: number;
}

type TeamConfig = {
    allow_repeated_speaker: boolean,
    emit_team_events: boolean,
    max_selector_attempts: number,
    max_turns: number,
    model_client: ModelData,
    model_client_streaming: boolean,
    participants: [],
    selector_prompt: string;
}

type OrganizationData = {
    created_at: Date;
    description: string;
    id: string;
    is_deleted: boolean;
    name: string;
    updated_at: Date;
}

type TeamData = {
    component: {
        component_type: "team";
        component_version: number;
        config: TeamConfig;
        description: string;
        label: string;
        provider: string;
        version: number;
    };
    id: string;
    created_at: Date;
    updated_at: Date;
    is_delted: boolean;
    model: {
        created_at: Date;
        description: string;
        id: string;
        is_deleted: boolean;
        name: string;
        updated_at: Date
    };
    model_ids: string;
    organization_id: string;
    organization: OrganizationData
    team_inputs: InputData[]
}
type ComponentType = "TextInput" | "FileInput" | "URLInput"
type InputsData = {
    component: {
        component_type: string;
        component_version: number;
        config: {
            encoding: string;
            file_path: string;
            file_type: string;
        };
        description: string;
        label: ComponentType;
        provider: string;
        version: number;
    };
    created_at: string;
    updated_at: string;
    id: string;
    is_deleted: boolean;
    organization_id: string;
}


type FetchInputsData = {
    items: InputsData[];
    page: number;
    pages: number;
    size: number;
    total: number;
}

type OutputsData = {
    created_at: Date;
    description: string;
    id: number;
    is_deleted: boolean;
    name: string;
    uploaded_at: Date;
}
type FetchOutputsData = {
    items: OutputsData[];
    page: number;
    pages: number;
    size: number;
    total: number;
}

type AppData = {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    description?: string;
    is_deleted: boolean;
    type?: ComponentType;
}

type FetchApps = {
    items: AppData[];
    page: number;
    pages: number;
    size: number;
    total: number;
}
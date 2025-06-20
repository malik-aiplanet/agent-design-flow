type LoginResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

type RegisterResponse = {
    bio: string;
    created_at: Date;
    descrpition: string;
    email: string;
    id: string;
    is_deleted: boolean;
    role: string;
    status: string;
    updated_at: Date;
    name: string;
    organization_id: string;
    
    organization: {
        created_at: Date;
        description: string;
        id: string;
        is_deleted: boolean;
        name: string;
        updated_at: Date;
    };
}

type UserData = {
    name: string;
    bio: string;
    email: string;
    role: string;
    organizatin_id: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
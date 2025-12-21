export interface PresenceResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            username: string;
            global_name: string;
            avatar_url: string;
        };
        presence: {
            status: string;
            activities: PresenceActivity[];
        };
    };
}

export interface PresenceActivity {
    type: number;
    state: string;
    name: string;
    details: string;
    timestamps?: {
        start: number;
        end?: number;
    };
    assets?: {
        large_image: string;
        large_text: string;
        large_url?: string;
    };
    application_id?: string;
}
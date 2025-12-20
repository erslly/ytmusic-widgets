export interface LanyardResponse {
    data: {
        activities: LanyardActivity[];
    };
    success: boolean;
}

export interface LanyardActivity {
    type: number;
    state: string;
    name: string;
    id: string;
    details: string;
    timestamps?: {
        start: number;
        end?: number;
    };
    assets?: {
        large_image: string;
        large_text: string;
    };
    application_id?: string;
}
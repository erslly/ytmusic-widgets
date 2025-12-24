export enum ErrorType {
    INVALID_USER_ID = 'INVALID_USER_ID',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    API_ERROR = 'API_ERROR',
    TIMEOUT = 'TIMEOUT',
    RATE_LIMIT = 'RATE_LIMIT',
    NETWORK_ERROR = 'NETWORK_ERROR',
    GENERIC_ERROR = 'GENERIC_ERROR'
}

export interface ErrorSVGData {
    type: ErrorType;
    message: string;
    details?: string;
}

export class APIError extends Error {
    constructor(
        message: string,
        public type: ErrorType,
        public statusCode?: number,
        public details?: string
    ) {
        super(message);
        this.name = 'APIError';
    }
}

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
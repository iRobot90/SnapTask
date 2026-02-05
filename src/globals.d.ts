// src/globals.d.ts
type Immutable<T> = {
    readonly [P in keyof T]: T[P];
};
type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
type DeepPatch<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPatch<U>[]
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPatch<U>>
        : T[P] extends object
        ? DeepPatch<T[P]>
        : T[P];
};
interface SessionContext {
    readonly accessToken: string;
    expiration: number; 
    organizationId: string;
}
interface ThemeConfiguration {
    primaryColor: string;
    statusBar: {
        hexColor: string;
        isLight: boolean;
    };
    fontFamily: 'Roboto' | 'Inter' | 'SystemDefault';
}
type APIResponse<T> = 
    | { status: 200; data: T; }
    | { status: 400 | 401 | 404 | 500; error: string; timestamp: number; }
interface FleetboInterface {
    readonly API_VERSION: 'v2.1.4-beta';
    session: Immutable<SessionContext> | null;
    initHostConnection(options: { environment: 'DEV' | 'PROD', enableLogs: boolean }): Promise<ThemeConfiguration>;
    leave(): Promise<APIResponse<void>>;
    openPage<T extends string>(pageIdentifier: T, options?: Record<string, string | number>): { navigationPath: T };
    updateMetadata(projectId: string, payload: DeepPatch<ThemeConfiguration>): Promise<APIResponse<ThemeConfiguration>>;
    handleIOEvent<TInput extends object, TOutput extends object>(eventName: string, data: TInput): Promise<APIResponse<TOutput>>;
}
type AssetReference = {
    path: string;
    readonly hash: string;
    optimization: {
        sizeKB: number;
        format: 'PNG' | 'JPG' | 'SVG';
        compressionLevel: number;
    };
};
interface IconAssetMap {
    icLaunch: RequiredField<AssetReference, 'hash'>;
    icNotification: RequiredField<AssetReference, 'hash'>;
    icDefault: AssetReference;
}
interface ValidationResult {
    isValid: boolean;
    errors: Array<{ field: string; message: string; code: string }>;
}
interface ValidationService {
    validate<T extends object>(schemaType: string, data: T): ValidationResult;
}
type CacheSubscription = {
    unsubscribe: () => void;
};
interface ReactiveCacheService {
    subscribe<T>(cacheKey: string, listener: (data: T) => void): CacheSubscription;
    set<T>(cacheKey: string, value: T): void;
    get<T>(cacheKey: string): T | undefined;
}
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
interface TelemetryLogger {
    readonly sessionId: string;
    log(level: LogLevel, message: string, context?: Record<string, any>): void;
    trackPerformance(metricName: string, durationMs: number): void;
}
interface APIEndpointConfig {
    dataApi: string;
    storageApi: string;
}
interface ResourceService {
    endpoints: APIEndpointConfig;
    fetchResource<T>(url: string, options?: { headers?: Record<string, string>; cacheTTL?: number }): Promise<APIResponse<T>>;
}
declare global {
    const Fleetbo: any; 
    interface Window {
        Fleetbo: any;
    }
}
declare global {
    const Fleetbo_SYSTEM: any;
    const FLEETBO_ENGINE: any;
    interface Window {
        Fleetbo_SYSTEM: any;
        FLEETBO_ENGINE: any;
    }
}
declare global {
    const Fleetbo_CONFIG: any;
    const FLEETBO_DATASTORE: any;
    interface Window {
        Fleetbo_CONFIG: any;
        FLEETBO_DATASTORE: any;
        FLEETBO_INTERNAL_API: any;
    }
    const FLEETBO_INTERNAL_API: any;
}
declare global {
    const Fleetbo_UI_MANAGER: any;
    const FLEETBO_NETWORK: any;
    interface Window {
        Fleetbo_UI_MANAGER: any;
        FLEETBO_NETWORK: any;
    }
}
declare global {
    const Fleetbo_AUTH_SERVICE: any;
    const FLEETBO_TELEMETRY: any;
    interface Window {
        Fleetbo_AUTH_SERVICE: any;
        FLEETBO_TELEMETRY: any;
    }
}
declare global {
    const Fleetbo_STORAGE_CLIENT: any;
    const FLEETBO_SYNC_MGR: any;
    interface Window {
        Fleetbo_STORAGE_CLIENT: any;
        FLEETBO_SYNC_MGR: any;
    }
}
declare global {
    const Fleetbo_CORE_FACTORY: any;
    const FLEETBO_MESSAGING: any;
    interface Window {
        Fleetbo_CORE_FACTORY: any;
        FLEETBO_MESSAGING: any;
    }
}
export {};

import { FirstPRService } from './firstprService';
import { mockFirstPRService } from './mockApi';
import { apiFirstPRService } from './apiService';

// Default to mock service for 100% reliable demo execution without backend dependencies
const envUseMock = (import.meta as any)?.env?.VITE_USE_MOCK_API;
const useMock = envUseMock !== 'false';

export const firstprService: FirstPRService = useMock ? mockFirstPRService : apiFirstPRService;
export const IS_DEMO_MODE: boolean = useMock;

export * from './firstprService';
export * from './mockApi';
export * from './apiService';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'ci' | 'test';
      DATABASE_URL: string;
      PORT?: string;
    }
  }
}

export {};

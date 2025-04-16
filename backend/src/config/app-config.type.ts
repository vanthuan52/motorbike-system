export type AppConfig = {
  name: string;
  timezone: string;
  nodeEnv: string;
  apiPrefix: string;
  http: {
    host: string;
    port: string | number;
  };
};

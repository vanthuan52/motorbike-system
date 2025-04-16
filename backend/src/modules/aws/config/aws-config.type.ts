export type AwsConfig = {
  s3: {
    presignExpired: string;
    config: {
      public: {
        credential: {
          key: string;
          secret: string;
        };
        bucket: string;
        region: string;
        baseUrl: string;
        cdnUrl: string;
      };
      private: {
        credential: {
          key: string;
          secret: string;
        };
        bucket: string;
        region: string;
        baseUrl: string;
      };
    };
  };
};

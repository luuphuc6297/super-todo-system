import { registerAs } from '@nestjs/config'

export default registerAs(
  'app',
  (): Record<string, any> => {
    // Get environment from NODE_ENV or APP_ENV
    const envFromVars = process.env.NODE_ENV || process.env.APP_ENV;
    
    // If environment is not explicitly set to development or testing, treat as production
    const env = envFromVars === 'development' || envFromVars === 'testing' 
      ? envFromVars 
      : 'production';
    
    return {
      // Use determined environment
      env,
      name: process.env.APP_NAME || 'Super Todo System',

      http: {
        // Enable HTTP by default, but respect APP_HTTP_ENABLE if set
        enable: process.env.APP_HTTP_ENABLE === 'true' || process.env.APP_HTTP_ENABLE === undefined,
        // Use configured host for local development
        host: process.env.APP_HTTP_HOST || 'localhost',
        // Use PORT for Railway, otherwise use APP_HTTP_PORT or default to 8080
        port: Number(process.env.PORT || process.env.APP_HTTP_PORT) || 8080,
      },

      globalPrefix: process.env.APP_GLOBAL_PREFIX || 'api',

      versioning: {
        enable: process.env.APP_VERSIONING_ENABLE === 'true',
        prefix: process.env.APP_VERSIONING_PREFIX || 'v',
        version: process.env.APP_VERSIONING_VERSION || '1',
      },
    };
  }
)

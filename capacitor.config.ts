import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'open-minded-front-end',
  webDir: 'dist/open-minded-front-end/en-US',
  server: {
    androidScheme: 'https'
  }
};

export default config;

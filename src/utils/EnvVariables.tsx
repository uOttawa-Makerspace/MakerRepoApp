const APP_RELEASE_TYPE = "Beta";
const APP_VERSION = "1.0.0";

const dev = {
  api_url: "http://localhost:3000",
  // api_url: "https://staging.makerepo.com",
  app_release_type: APP_RELEASE_TYPE,
  app_version: APP_VERSION,
};

const production = {
  api_url: "https://makerepo.com",
  app_release_type: APP_RELEASE_TYPE,
  app_version: APP_VERSION,
};

const config = process.env.NODE_ENV === "production" ? production : dev;

// eslint-disable-next-line import/no-anonymous-default-export
export default config;

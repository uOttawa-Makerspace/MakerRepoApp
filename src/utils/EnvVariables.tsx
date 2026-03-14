const APP_RELEASE_TYPE = "Production";
const APP_VERSION = "1.3.1";

const dev = {
  api_url: "http://localhost:3000",
  app_release_type: APP_RELEASE_TYPE,
  app_version: APP_VERSION,
};

const staging = {
  api_url: "https://staging.makerepo.com",
  app_release_type: APP_RELEASE_TYPE,
  app_version: APP_VERSION,
};

const production = {
  api_url: "https://makerepo.com",
  app_release_type: APP_RELEASE_TYPE,
  app_version: APP_VERSION,
};

function getConfig() {
  const appEnv = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;

  switch (appEnv) {
    case "production":
      return production;
    case "staging":
      return staging;
    default:
      return dev;
  }
}

const config = getConfig();

export default config;
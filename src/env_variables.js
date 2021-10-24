const dev = {
    api_url: "http://localhost:3000",
}

const production = {
    api_url: "https://staging.makerepo.com"
}

const config = process.env.NODE_ENV === 'production'
    ? production
    : dev;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    config
}
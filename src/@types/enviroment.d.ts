declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URL: string;
            ENV: string
        }
    }
}

export { };

import { z } from "zod"

const schema = z.object({
    backend_url: z.string().url(),
    websocket_url: z.string().url(),
    // user_deployment_secret: z.string(),
})

type Env = z.infer<typeof schema>

// `process.env` for server variables
// `import.meta.env` for client variables (need to be prefixed by `VITE_`)


export function get_client_env(): Env {
    return schema.parse({
        backend_url: import.meta.env.VITE_BACKEND_URL,
        websocket_url: import.meta.env.VITE_WEBSOCKET_URL,
        // user_deployment_secret: import.meta.env.VITE_USER_DEPLOYMENT_SECRET,
    })
}

export function get_server_env(): Env {
    return schema.parse({
        backend_url: process.env.BACKEND_URL,
        websocket_url: process.env.WEBSOCKET_URL,
        // user_deployment_secret: process.env.USER_DEPLOYMENT_SECRET,
    })
}
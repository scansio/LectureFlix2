import dotenv from 'dotenv'

dotenv.config()

const serverConfig: { [key: string]: { scheme: string; port: number } } = {
  SCHEDULING_SERVER: {
    scheme: process.env.SCHEDULING_SERVER_SCHEME || 'scheduling',
    port: (process.env.SCHEDULING_SERVER_PORT as any) || 6098,
  },
  MAIN_SERVER: {
    scheme: process.env.MAIN_SERVER_SCHEME || 'main',
    port: (process.env.MAIN_SERVER_PORT as any) || 3003,
  },
  REPO_HOOK_SERVER: {
    scheme: process.env.REPO_HOOK_SERVER_SCHEME || 'hook',
    port: (process.env.REPO_HOOK_SERVER_PORT as any) || 3002,
  },
  CDN_SERVER: {
    scheme: process.env.CDN_SCHEME || 'cdn',
    port: (process.env.CDN_PORT as any) || 2024,
  },
  SOCKET_SERVER: {
    scheme: process.env.SOCKET_SERVER_SCHEME || 'socket',
    port: (process.env.SOCKET_SERVER_PORT as any) || 2025,
  },
}

export default serverConfig

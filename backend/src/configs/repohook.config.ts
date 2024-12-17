const Config = {
  credential: {
    username: 'admin',
    password: '1234',
  },
  base: '../../',
  customBase: [],
}

export default Config

export interface Config {
  credential: Credential
  base: string
  customBase: { [k: string]: string }
}

export interface Credential {
  username: string
  password: string
  [k: string]: string
}

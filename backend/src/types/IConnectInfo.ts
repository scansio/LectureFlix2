export default interface IConnectInfo {
  endpoint: string
  statusCode: number | string
  errorCode?: number | string
  uid?: number
  status: boolean
  message: string
}

import IAny from './IAny'
import IConnectInfo from './IConnectInfo'

//Response Structure Interface
export default interface IResStruct {
  connection: IConnectInfo
  data: IAny
}

import IUser from '../../types/IUser'

export default interface BaseInitFunction {
  init(): Promise<boolean | null | IUser | undefined>
  initConstruct(): Promise<void>
}

import IPaginatingMetadata from './IPaginatingMetadata'

interface IPaginating<T> {
  metadata: IPaginatingMetadata
  results: T[]
}

export default IPaginating

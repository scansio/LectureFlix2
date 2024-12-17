import ISampleResponse from './ISampleResponse'

export interface IPathMethodMetadata {
  summary: string
  sampleResponses?: ISampleResponse[]
  sampleRequests?: ISampleResponse[]
}

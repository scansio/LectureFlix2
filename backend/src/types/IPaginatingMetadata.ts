interface IPaginatingMetadata {
  totalPages: number
  totalResults: number
  resultCount: number
  currentPage: number
  nextPage: number
  previousPage: number
  hasNext: boolean
  hasPrevious: boolean
  size: number
  url: string
  query: string
  nextUrl: string
  previousUrl: string
}

export default IPaginatingMetadata

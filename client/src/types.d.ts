declare module 'marked-metadata' {
  interface MetadataObject {
    [key: string]: string
  }

  class MarkedMetaData {
    constructor(file: string)

    defineTokens(initial: string, last: string): void
    getTokens(): string[]
    getFile(): string
    metadata(): MetadataObject | Error
    markdown(config?: { crop?: string }): string
  }

  export = MarkedMetaData
}

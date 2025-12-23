declare module 'short-uid' {
  class ShortUID {
    constructor(options?: { debug?: boolean });
    randomUUID(length?: number): string;
  }
  export default ShortUID;
}

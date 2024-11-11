export class MatchMedia {
  mqlRecords: Record<string, MediaQueryList> = {}

  register(query: string, handler: (predicate: { matches: boolean }) => void) {
    if (this.mqlRecords[query]) {
      this.addMqlListener(query, handler)
    } else {
      this.mqlRecords[query] = window.matchMedia(query)
      this.addMqlListener(query, handler)
    }
    if (this.mqlRecords[query].matches) {
      handler({ matches: true })
    }
  }

  unregister(
    query: string,
    handler: (predicate: { matches: boolean }) => void
  ) {
    if (this.mqlRecords[query]) {
      this.removeMqlListener(query, handler)
    }
  }

  private addMqlListener(
    query: string,
    handler: (predicate: { matches: boolean }) => void
  ) {
    try {
      this.mqlRecords[query].addEventListener('change', handler)
    } catch (_) {
      try {
        this.mqlRecords[query].addListener(handler)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private removeMqlListener(
    query: string,
    handler: (predicate: { matches: boolean }) => void
  ) {
    try {
      this.mqlRecords[query].removeEventListener('change', handler)
    } catch (_) {
      try {
        this.mqlRecords[query].removeListener(handler)
      } catch (e) {
        console.error(e)
      }
    }
  }
}

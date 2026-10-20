declare module '#app' {
  interface PageMeta {
    /** The header floats transparently over a full-bleed hero until the page scrolls. */
    headerOverlay?: boolean
    /** Checkout variant: no navigation or search, no footer. */
    checkoutChrome?: boolean
  }
}

export {}

/**
 * Represents one hop in the message chain from source to shell-host.
 * Each entry is added/enriched as the message traverses iframe layers.
 *
 * Data is captured from two sources:
 * - Self-reported: initHref, locationHref, isModal (set by the sender)
 * - Parent-enriched: uuid, outletName, extensionAssignmentId, iframeSrc (set by the parent who owns the iframe)
 */
export interface TraceEntry {
  uuid?: string; // Routing UUID assigned by parent at registerOutlet()
  outletName?: string; // Human-readable name from registerOutlet(iframe, name)
  extensionAssignmentId?: string; // SAP extension assignment ID (if set on iframe element)
  iframeSrc?: string; // iframe.src attribute (set by parent, child can't access its own)
  initHref?: string; // URL when ShellSdk.init() was called (self-reported)
  locationHref?: string; // URL at emit/forward time (self-reported, may differ after SPA navigation)
  isModal?: boolean; // True if sender is inside a shell modal (self-reported)
}

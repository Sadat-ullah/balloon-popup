// Cross-platform safe tactile haptic feedback utility
export const triggerHaptic = (durationMs: number = 35) => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Ignore browsers where vibration is blocked or unsupported
    }
  }
};

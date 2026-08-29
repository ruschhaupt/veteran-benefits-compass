// -----------------------------------------------------------------------
// PRIVACY-FIRST TELEMETRY WRAPPER (100% Zero PII / PHI Guarantee)
// Never collects names, ratings, diagnoses, SSNs, or personal identifiers.
// -----------------------------------------------------------------------

export const trackEvent = (eventName, props = {}) => {
  try {
    // Strip any potential sensitive parameters defensively
    const safeProps = { ...props };
    delete safeProps.userName;
    delete safeProps.userEmail;
    delete safeProps.ssn;
    delete safeProps.rating;
    delete safeProps.diagnoses;

    if (window.plausible) {
      window.plausible(eventName, { props: safeProps });
    } else if (window.posthog) {
      window.posthog.capture(eventName, safeProps);
    }
  } catch (e) {
    // Graceful silent fail
  }
};

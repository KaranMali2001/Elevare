import * as Sentry from "@sentry/browser";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],

  tracesSampleRate: 1,

  replaysSessionSampleRate: 0.1,
  tracePropagationTargets: ["localhost"],
  replaysOnErrorSampleRate: 1.0,

  debug: false,
});

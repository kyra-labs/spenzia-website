import type { M3eSnackbarHost } from '@kyralabs/m3e-elements/snackbar-host.js';
import { LoadingIndicator } from '@kyralabs/m3e-react';
import { type SubmitEvent, useRef, useState } from 'react';

interface Props {
  /** "hero" or "footer": prefixes the input id, as in the original markup. */
  id: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ERROR_STATUS = 'Please enter a valid email address.';
const SUCCESS_STATUS = "Thanks — you're on the list. We'll email you at launch.";

/** The --m3e-sys-motion-duration-long1 token in ms: how long the LoadingIndicator shows. */
function requestDuration(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--m3e-sys-motion-duration-long1')
    .trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith('ms') ? value : value * 1000;
}

/**
 * The <m3e-snackbar-host> for the result, shared by both forms and loaded on the first submit so
 * the page pays nothing for it up front. Appended to <body>: a revealed section's transform would
 * contain a fixed host.
 */
async function snackbarHost(): Promise<M3eSnackbarHost> {
  await import('@kyralabs/m3e-elements/snackbar-host.js');
  let host = document.querySelector<M3eSnackbarHost>('m3e-snackbar-host.site-snackbars');
  if (!host) {
    host = document.createElement('m3e-snackbar-host') as M3eSnackbarHost;
    host.className = 'site-snackbars';
    document.body.append(host);
  }
  return host;
}

/**
 * Waitlist form island (client:only): an m3e outlined text field (the m3e-css markup, whose
 * label float, notch and colours are CSS only) with error text, the M3 LoadingIndicator while the
 * signup "sends" and a snackbar with the result.
 *
 * Behavior ported from the old assets/js/app.js, including that nothing is sent anywhere yet:
 * there is no waitlist backend. Wire a real endpoint into onSubmit to make it real.
 */
export default function WaitlistForm({ id }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const inputId = `${id}-email`;
  const errorId = `${id}-email-error`;

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = input.current?.value.trim() ?? '';
    if (!EMAIL.test(email)) {
      setIsError(true);
      input.current?.focus();
      return;
    }
    setIsLoading(true);
    const host = snackbarHost();
    window.setTimeout(() => {
      setIsLoading(false);
      form.reset();
      // If the snackbar chunk can't load (offline, a stale tab after a deploy), nothing is shown.
      host.then((h) => h.showSnackbar(SUCCESS_STATUS)).catch(() => undefined);
    }, requestDuration());
  };

  return (
    <form className="waitlist-form" noValidate onSubmit={onSubmit}>
      <div className="m3e-text-field m3e-text-field--outlined waitlist-field">
        <div className="m3e-text-field__container">
          <label className="m3e-text-field__label" htmlFor={inputId}>
            Email address
          </label>
          <input
            ref={input}
            className="m3e-text-field__input"
            id={inputId}
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            aria-invalid={isError ? true : undefined}
            aria-describedby={isError ? errorId : undefined}
            onInput={() => setIsError(false)}
          />
          <fieldset className="m3e-text-field__outline" aria-hidden="true">
            <legend className="m3e-text-field__notch">
              <span>Email address</span>
            </legend>
          </fieldset>
        </div>
        {isError ? (
          <div className="m3e-text-field__supporting">
            <span className="m3e-text-field__supporting-text" id={errorId} role="alert">
              {ERROR_STATUS}
            </span>
          </div>
        ) : null}
      </div>
      <button
        className="m3e-button m3e-button--size-m"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading ? true : undefined}
      >
        {isLoading ? (
          <span className="waitlist-form__indicator" aria-hidden="true">
            <LoadingIndicator aria-label="Sending" />
          </span>
        ) : null}
        Get notified
      </button>
    </form>
  );
}

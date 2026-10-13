import { LoadingIndicator } from '@kyralabs/m3e-react';
import { type SubmitEvent, useRef, useState } from 'react';

interface Props {
  /** "hero" or "footer": prefixes the input id, as in the original markup. */
  id: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The --m3e-sys-motion-duration-long1 token in ms: how long the LoadingIndicator shows. */
function requestDuration(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--m3e-sys-motion-duration-long1')
    .trim();
  const value = Number.parseFloat(raw);
  return raw.endsWith('ms') ? value : value * 1000;
}

/**
 * Waitlist form island (client:only): the M3 LoadingIndicator while the signup "sends".
 *
 * Behavior ported from the old assets/js/app.js, including that nothing is sent anywhere yet:
 * there is no waitlist backend. Native `required`/`type="email"` validation runs first, as before.
 * Wire a real endpoint into onSubmit to make it real.
 */
export default function WaitlistForm({ id }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = input.current?.value.trim() ?? '';
    if (!EMAIL.test(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setStatus("Thanks — you're on the list. We'll email you at launch.");
      form.reset();
    }, requestDuration());
  };

  return (
    <>
      <form className="waitlist-form" onSubmit={onSubmit}>
        <label className="visually-hidden" htmlFor={`${id}-email`}>
          Email address
        </label>
        <input
          ref={input}
          className="waitlist-input"
          id={`${id}-email`}
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
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
      <div className="form-status" role="status" aria-live="polite">
        {status}
      </div>
    </>
  );
}

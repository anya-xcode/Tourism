import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

/** Google sign-in, rendered only when a client id is configured. */
export function GoogleButton({
  onCredential,
  onError,
  text,
}: {
  onCredential: (r: CredentialResponse) => void;
  onError: () => void;
  text: 'continue_with' | 'signup_with';
}) {
  if (!googleEnabled) return null;
  return (
    <>
      <div className="my-6 flex items-center gap-4 text-sm font-semibold text-iron-3" aria-hidden="true">
        <span className="h-px flex-1 bg-rule-strong" />
        or
        <span className="h-px flex-1 bg-rule-strong" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin onSuccess={onCredential} onError={onError} shape="rectangular" theme="outline" size="large" text={text} width="360" />
      </div>
    </>
  );
}

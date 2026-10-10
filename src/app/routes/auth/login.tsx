import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { loginInputSchema, useLogin } from '@/lib/auth';

import type { FormEvent } from 'react';

const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const login = useLogin({
    onSuccess: () => {
      navigate(redirectTo || paths.app.dashboard.getHref(), { replace: true });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = loginInputSchema.safeParse({ password });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }

    login.mutate(parsed.data);
  };

  const serverError = isAxiosError(login.error)
    ? (login.error.response?.data?.message as string | undefined)
    : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        className="flex w-full max-w-sm flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin password to manage projects.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input
            autoComplete="current-password"
            autoFocus
            className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        {(validationError || serverError) && (
          <p className="text-sm text-destructive" role="alert">
            {validationError || serverError}
          </p>
        )}

        <Button isLoading={login.isPending} type="submit">
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginRoute;

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout, Field, FormError } from '@/components/account/AuthLayout';
import { useAuth, type Role } from '@/hooks/useAuth';
import { apiErrorMessage } from '@/lib/api';
import { navigate } from '@/lib/router';

export function SignUp() {
  const { signUp } = useAuth();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<Role>('buyer');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await signUp({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      });
      navigate(user.role === 'seller' ? '/seller' : '/buyer');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a buyer or a seller"
      footer={
        <>
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium underline-offset-2 hover:underline"
            style={{ color: 'var(--fg-1)' }}
            onClick={() => navigate('/signin')}
          >
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <FormError message={error} />
        <Field label="Username" htmlFor="username">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="I want to" htmlFor="role">
          <div className="grid grid-cols-2 gap-2" id="role">
            {(['buyer', 'seller'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="rounded-lg px-3 py-2 text-[13px] font-medium capitalize transition-colors"
                style={{
                  background:
                    role === r ? 'var(--accent-primary)' : 'var(--surface-sunken)',
                  color: role === r ? 'var(--surface-raised)' : 'var(--fg-1)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {r === 'buyer' ? 'Buy products' : 'Sell products'}
              </button>
            ))}
          </div>
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}

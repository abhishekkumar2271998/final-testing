import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Field, FormError } from '@/components/account/AuthLayout';
import { DashboardShell } from '@/components/account/DashboardShell';
import { useAuth, type Profile as ProfileData } from '@/hooks/useAuth';
import { api, apiErrorMessage } from '@/lib/api';

const EMPTY: ProfileData = {
  display_name: '',
  bio: '',
  avatar_url: '',
  phone: '',
  location: '',
};

export function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = React.useState<ProfileData>(EMPTY);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (user?.profile) setForm({ ...EMPTY, ...user.profile });
  }, [user]);

  const update = (key: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { data } = await api.patch<ProfileData>('/profile/', {
        display_name: form.display_name,
        bio: form.bio,
        avatar_url: form.avatar_url,
        phone: form.phone,
        location: form.location,
      });
      setForm({ ...EMPTY, ...data });
      setUser((u) => (u ? { ...u, profile: { ...u.profile, ...data } } : u));
      setSaved(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell active="/profile">
      <h1
        className="mb-1 text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--fg-1)' }}
      >
        Your profile
      </h1>
      <p className="mb-6 text-[14px]" style={{ color: 'var(--fg-2)' }}>
        Signed in as {user?.username} ({user?.email})
      </p>

      <form
        onSubmit={onSave}
        className="max-w-[520px] rounded-xl px-6 py-6"
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <FormError message={error} />
        <Field label="Display name" htmlFor="display_name">
          <Input
            id="display_name"
            value={form.display_name}
            onChange={update('display_name')}
          />
        </Field>
        <Field label="Bio" htmlFor="bio">
          <Textarea
            id="bio"
            rows={3}
            value={form.bio}
            onChange={update('bio')}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" value={form.phone} onChange={update('phone')} />
          </Field>
          <Field label="Location" htmlFor="location">
            <Input
              id="location"
              value={form.location}
              onChange={update('location')}
            />
          </Field>
        </div>
        <Field label="Avatar URL" htmlFor="avatar_url">
          <Input
            id="avatar_url"
            value={form.avatar_url}
            onChange={update('avatar_url')}
            placeholder="https://…"
          />
        </Field>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
          {saved && (
            <span className="text-[13px]" style={{ color: 'var(--fg-2)' }}>
              Saved
            </span>
          )}
        </div>
      </form>
    </DashboardShell>
  );
}

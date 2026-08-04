import { UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatAccountDate } from '../utils/date';
import { Button } from '../components/common/Button';

export function ProfilePage() {
  const { user, signOutUser } = useAuth();

  if (!user) return null;

  return (
    <section className="glass max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="flex items-center gap-4">
        {user.photoURL ? (
          <img src={user.photoURL} alt="User avatar" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <UserCircle className="h-16 w-16 text-slate-300" />
        )}
        <div>
          <p className="text-xl font-semibold">{user.displayName ?? 'Anonymous User'}</p>
          <p className="text-sm text-slate-300">{user.email}</p>
        </div>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between rounded-xl bg-white/5 px-3 py-2">
          <dt className="text-slate-300">Account Created</dt>
          <dd>{formatAccountDate(user.metadata.creationTime)}</dd>
        </div>
        <div className="flex justify-between rounded-xl bg-white/5 px-3 py-2">
          <dt className="text-slate-300">Last Sign In</dt>
          <dd>{formatAccountDate(user.metadata.lastSignInTime)}</dd>
        </div>
      </dl>

      <Button variant="danger" onClick={() => void signOutUser()}>
        Logout
      </Button>
    </section>
  );
}
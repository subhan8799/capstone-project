import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { firebaseInitError } from '../firebase/config';
import { useAuthConfiguration } from '../hooks/useAuthConfiguration';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFields = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const { loading: authConfigLoading, ready: authConfigReady, message: authConfigMessage } = useAuthConfiguration();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  const authUnavailableMessage = firebaseInitError ?? authConfigMessage;

  const from = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname ?? '/';

  const onSubmit = handleSubmit(async (values) => {
    if (authUnavailableMessage) {
      toast.error(authUnavailableMessage);
      return;
    }

    try {
      await signIn(values.email, values.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed.');
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      {authUnavailableMessage ? (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {authUnavailableMessage}
        </div>
      ) : null}
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input id="email" type="email" label="Email" {...register('email')} error={errors.email?.message} />
        <Input id="password" type="password" label="Password" {...register('password')} error={errors.password?.message} />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || authConfigLoading || !authConfigReady || Boolean(authUnavailableMessage)}
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <Button
        variant="secondary"
        className="w-full"
        disabled={isSubmitting || authConfigLoading || !authConfigReady || Boolean(authUnavailableMessage)}
        onClick={async () => {
          if (authUnavailableMessage) {
            toast.error(authUnavailableMessage);
            return;
          }

          try {
            await signInWithGoogle();
            navigate('/', { replace: true });
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Google sign-in failed.');
          }
        }}
      >
        Continue with Google
      </Button>
      <div className="flex justify-between text-sm text-slate-300">
        <Link to="/forgot-password" className="hover:text-white">
          Forgot Password?
        </Link>
        <Link to="/register" className="hover:text-white">
          Create account
        </Link>
      </div>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { firebaseInitError } from '../firebase/config';
import { useAuthConfiguration } from '../hooks/useAuthConfiguration';

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
    email: z.string().email('Enter a valid email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type RegisterFields = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { loading: authConfigLoading, ready: authConfigReady, message: authConfigMessage } = useAuthConfiguration();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({ resolver: zodResolver(registerSchema) });

  const authUnavailableMessage = firebaseInitError ?? authConfigMessage;

  const onSubmit = handleSubmit(async (values) => {
    if (authUnavailableMessage) {
      toast.error(authUnavailableMessage);
      return;
    }

    try {
      await signUp(values.email, values.password, values.displayName);
      toast.success('Account created.');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed.');
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {authUnavailableMessage ? (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {authUnavailableMessage}
        </div>
      ) : null}
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input id="displayName" label="Display Name" {...register('displayName')} error={errors.displayName?.message} />
        <Input id="email" type="email" label="Email" {...register('email')} error={errors.email?.message} />
        <Input id="password" type="password" label="Password" {...register('password')} error={errors.password?.message} />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || authConfigLoading || !authConfigReady || Boolean(authUnavailableMessage)}
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </Button>
      </form>
      <p className="text-sm text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-300 hover:text-brand-200">
          Login
        </Link>
      </p>
    </div>
  );
}
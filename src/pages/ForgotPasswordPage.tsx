import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({ email: z.string().email('Enter a valid email.') });

type ForgotFields = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFields>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword(values.email);
      toast.success('Reset link sent. Check your inbox.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email.');
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input id="email" type="email" label="Email" {...register('email')} error={errors.email?.message} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      <Link to="/login" className="text-sm text-brand-300 hover:text-brand-200">
        Back to login
      </Link>
    </div>
  );
}
import { useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleOptions = ['viewer', 'editor', 'admin'] as const;

const userSettingsSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  notifications: z.boolean(),
  role: z
    .string()
    .min(1, 'Select a role.')
    .refine((value) => roleOptions.includes(value as (typeof roleOptions)[number]), 'Select a valid role.'),
});

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;

export type UserSettingsFormProps = {
  defaultValues?: Partial<UserSettingsFormValues>;
  disabled?: boolean;
  onSave?: (values: UserSettingsFormValues) => Promise<void>;
};

const initialValues: UserSettingsFormValues = {
  name: '',
  email: '',
  notifications: false,
  role: '',
};

async function mockSaveUserSettings(_values: UserSettingsFormValues): Promise<void> {
  return Promise.resolve();
}

export function UserSettingsForm({
  defaultValues,
  disabled = false,
  onSave = mockSaveUserSettings,
}: UserSettingsFormProps) {
  const nameId = useId();
  const emailId = useId();
  const notificationsId = useId();
  const roleId = useId();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      ...initialValues,
      ...defaultValues,
    },
  });

  const isFormDisabled = disabled || isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await onSave(values);
      reset(values);
      setSubmitSuccess('Settings saved successfully.');
    } catch (error) {
      const fallbackMessage = 'Unable to save settings. Please try again.';
      const message = error instanceof Error && error.message.trim() ? error.message : fallbackMessage;
      setSubmitError(message);
    }
  });

  const nameErrorId = errors.name ? `${nameId}-error` : undefined;
  const emailErrorId = errors.email ? `${emailId}-error` : undefined;
  const roleErrorId = errors.role ? `${roleId}-error` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset disabled={isFormDisabled} aria-busy={isSubmitting}>
        <legend>User settings</legend>

        <div>
          <label htmlFor={nameId}>Name</label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={nameErrorId}
            {...register('name')}
          />
          {errors.name ? (
            <p id={nameErrorId} role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={emailErrorId}
            {...register('email')}
          />
          {errors.email ? (
            <p id={emailErrorId} role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={notificationsId}>Enable notifications</label>
          <input id={notificationsId} type="checkbox" {...register('notifications')} />
        </div>

        <div>
          <label htmlFor={roleId}>Role</label>
          <select
            id={roleId}
            aria-invalid={errors.role ? 'true' : 'false'}
            aria-describedby={roleErrorId}
            {...register('role')}
          >
            <option value="">Select a role</option>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role ? (
            <p id={roleErrorId} role="alert">
              {errors.role.message}
            </p>
          ) : null}
        </div>

        {submitError ? (
          <p role="alert" aria-live="assertive">
            {submitError}
          </p>
        ) : null}

        {submitSuccess ? (
          <p role="status" aria-live="polite">
            {submitSuccess}
          </p>
        ) : null}

        <button type="submit" disabled={isFormDisabled}>
          {isSubmitting ? 'Saving...' : 'Save settings'}
        </button>
      </fieldset>
    </form>
  );
}

export { userSettingsSchema, roleOptions };
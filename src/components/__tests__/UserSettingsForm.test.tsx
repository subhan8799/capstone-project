import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UserSettingsForm } from '../UserSettingsForm';

function createDeferredPromise() {
  let resolvePromise: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  return { promise, resolve: resolvePromise };
}

describe('UserSettingsForm', () => {
  it('renders accessible labels and keyboard-focusable inputs', async () => {
    const user = userEvent.setup();

    render(<UserSettingsForm />);

    await user.tab();
    expect(screen.getByLabelText('Name')).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Email')).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Enable notifications')).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Role')).toHaveFocus();
  });

  it('shows validation errors with accessible state when fields are invalid', async () => {
    const user = userEvent.setup();

    render(<UserSettingsForm />);

    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const roleSelect = screen.getByLabelText('Role');

    expect(await screen.findByText('Name must be at least 2 characters.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Select a role.')).toBeInTheDocument();

    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(roleSelect).toHaveAttribute('aria-invalid', 'true');

    expect(nameInput).toHaveAttribute('aria-describedby');
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(roleSelect).toHaveAttribute('aria-describedby');
  });

  it('submits valid values, disables the form while saving, and announces success', async () => {
    const deferred = createDeferredPromise();
    const onSave = vi.fn(() => deferred.promise);
    const user = userEvent.setup();

    render(<UserSettingsForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Name'), 'Subhan');
    await user.type(screen.getByLabelText('Email'), 'subhan@example.com');
    await user.click(screen.getByLabelText('Enable notifications'));
    await user.selectOptions(screen.getByLabelText('Role'), 'editor');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Subhan',
      email: 'subhan@example.com',
      notifications: true,
      role: 'editor',
    });

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(screen.getByLabelText('Name')).toBeDisabled();

    deferred.resolve();

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully.');
    });

    expect(screen.getByRole('button', { name: 'Save settings' })).toBeEnabled();
  });

  it('shows a fallback API error when submission fails without a useful message', async () => {
    const onSave = vi.fn().mockRejectedValue('network down');
    const user = userEvent.setup();

    render(<UserSettingsForm onSave={onSave} defaultValues={{ role: 'viewer' }} />);

    await user.type(screen.getByLabelText('Name'), 'Subhan');
    await user.type(screen.getByLabelText('Email'), 'subhan@example.com');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByRole('alert', { name: '' })).toBeInTheDocument();
    expect(screen.getByText('Unable to save settings. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save settings' })).toBeEnabled();
  });
});
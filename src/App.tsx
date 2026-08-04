import { UserSettingsForm } from './components/UserSettingsForm';

async function saveUserSettings() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 600);
  });
}

export default function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        background: '#f4f7fb',
        color: '#0f172a',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <section
        style={{
          width: 'min(100%, 32rem)',
          padding: '2rem',
          borderRadius: '1rem',
          background: '#ffffff',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '0.75rem' }}>User settings</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#475569' }}>
          Update your profile details, email preferences, and access role.
        </p>
        <UserSettingsForm
          defaultValues={{
            name: 'Subhan',
            email: 'subhan@example.com',
            notifications: true,
            role: 'editor',
          }}
          onSave={saveUserSettings}
        />
      </section>
    </main>
  );
}
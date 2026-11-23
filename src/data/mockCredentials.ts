export const DEMO_CREDENTIALS = {
  email: 'student@example.com',
  password: 'password2026',
} as const;

export const demoAccount = {
  id: 'demo-student',
  name: 'Student',
  email: DEMO_CREDENTIALS.email,
} as const;

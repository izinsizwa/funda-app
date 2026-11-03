import { Redirect } from 'expo-router';

import { useActiveProfile, useSession } from '@/state/session';

/** The one place that decides where you belong right now. */
export default function Index() {
  const signedIn = useSession((s) => s.signedIn);
  const profile = useActiveProfile();

  if (!signedIn) return <Redirect href="/sign-in" />;
  if (!profile) return <Redirect href="/who-is-learning" />;
  return <Redirect href={profile.role === 'parent' ? '/parent' : '/learner'} />;
}

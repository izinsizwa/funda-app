import { useSession } from '@/state/session';

// Every test starts signed out with an empty store.
beforeEach(() => {
  useSession.getState().signOut();
});

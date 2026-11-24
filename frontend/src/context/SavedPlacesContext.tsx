import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookmarkService } from '../services/BookmarkService';
import { useAuth } from './AuthContext';

interface SavedPlacesContextType {
  isSaved: (placeId: string) => boolean;
  /** Saves or unsaves; sends guests to sign in first. */
  toggle: (placeId: string) => Promise<void>;
  count: number;
}

const EMPTY: Set<string> = new Set();

const SavedPlacesContext = createContext<SavedPlacesContextType | undefined>(undefined);

/**
 * One shared set of the signed-in traveler's saved place ids, so every
 * Save control on the page agrees with the bookmarks API.
 */
export const SavedPlacesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // The set is tagged with its owner, so signing out (or switching account) never shows someone else's saves
  const [state, setState] = useState<{ owner: string; ids: Set<string> } | null>(null);
  const owner = user?._id ?? null;
  const saved = useMemo(() => (owner && state?.owner === owner ? state.ids : EMPTY), [owner, state]);
  const setSaved = useCallback(
    (update: Set<string> | ((cur: Set<string>) => Set<string>)) => {
      if (!owner) return;
      setState((cur) => {
        const base = cur?.owner === owner ? cur.ids : EMPTY;
        return { owner, ids: typeof update === 'function' ? update(base) : update };
      });
    },
    [owner],
  );

  useEffect(() => {
    if (!owner) return;
    let cancelled = false;
    BookmarkService.getAll('place')
      .then((list) => {
        if (cancelled) return;
        const ids = list
          .map((bm: { placeId?: { _id?: string } | string }) =>
            typeof bm.placeId === 'string' ? bm.placeId : bm.placeId?._id,
          )
          .filter((id): id is string => Boolean(id));
        setSaved(new Set(ids));
      })
      .catch(() => {
        /* saved state is a convenience; the page still works without it */
      });
    return () => {
      cancelled = true;
    };
  }, [owner, setSaved]);

  const isSaved = useCallback((placeId: string) => saved.has(placeId), [saved]);

  const toggle = useCallback(
    async (placeId: string) => {
      if (!user) {
        navigate('/login', { state: { from: location.pathname + location.search } });
        return;
      }
      const wasSaved = saved.has(placeId);
      const next = new Set(saved);
      if (wasSaved) next.delete(placeId);
      else next.add(placeId);
      setSaved(next);
      try {
        const res = await BookmarkService.toggle(placeId, 'place');
        setSaved((cur) => {
          const fixed = new Set(cur);
          if (res.bookmarked) fixed.add(placeId);
          else fixed.delete(placeId);
          return fixed;
        });
      } catch {
        // Roll back the optimistic change
        setSaved((cur) => {
          const back = new Set(cur);
          if (wasSaved) back.add(placeId);
          else back.delete(placeId);
          return back;
        });
      }
    },
    [user, saved, setSaved, navigate, location.pathname, location.search],
  );

  return (
    <SavedPlacesContext.Provider value={{ isSaved, toggle, count: saved.size }}>
      {children}
    </SavedPlacesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSavedPlaces = () => {
  const ctx = useContext(SavedPlacesContext);
  if (!ctx) throw new Error('useSavedPlaces must be used within SavedPlacesProvider');
  return ctx;
};

import { create } from 'zustand';

import type {
  Profile,
} from '../types/profile.types';

interface ProfileState {
  profile: Profile | null;

  loading: boolean;

  error: string | null;

  setProfile: (
    profile: Profile,
  ) => void;

  setLoading: (
    loading: boolean,
  ) => void;

  setError: (
    error: string | null,
  ) => void;

  clearProfile: () => void;
}

export const useProfileStore =
  create<ProfileState>((set) => ({
    profile: null,

    loading: false,

    error: null,

    setProfile: (profile) =>
      set({
        profile,
        error: null,
      }),

    setLoading: (loading) =>
      set({
        loading,
      }),

    setError: (error) =>
      set({
        error,
      }),

    clearProfile: () =>
      set({
        profile: null,
        error: null,
      }),
  }));
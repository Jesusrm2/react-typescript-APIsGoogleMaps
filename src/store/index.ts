import { create } from 'zustand';
import { Ipersona } from '../api/types';

type Store = {
  authUser: Ipersona | null;
  requestLoading: boolean;
  setAuthUser: (user: Ipersona | null) => void;
  setRequestLoading: (isLoading: boolean) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  requestLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
}));

export default useStore;

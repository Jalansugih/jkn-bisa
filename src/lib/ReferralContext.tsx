import { createContext, useContext } from 'react';

export interface ReferralContextValue {
  isLoggedIn: boolean;
  loading: boolean;
  retry: () => void;
}

/** Status login + status muat kode referral, dibaca tombol "Bagikan" tanpa prop drilling. */
export const ReferralContext = createContext<ReferralContextValue>({
  isLoggedIn: false,
  loading: false,
  retry: () => {},
});

export const useReferralContext = () => useContext(ReferralContext);

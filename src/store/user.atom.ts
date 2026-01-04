import { atom } from "jotai"
import { createJSONStorage, atomWithStorage } from "jotai/utils";
import { StoredKeys } from "../utils/storedKeys";
import type { LoginResponse } from "../sdk/generated";

import { ApiSDK } from "../sdk";
export interface UserT {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_email_verified?: boolean;
  profile_picture_url?: string;
}

export const encryptedStorage = createJSONStorage<string | null>(
  () => localStorage,
);

export const storedAuthTokenAtom = atomWithStorage(
  StoredKeys.token,
  null,
  encryptedStorage,
  {
    getOnInit: true,
  },
);

export const storedUserData = createJSONStorage<LoginResponse | null>(
  () => localStorage,
);

export const loggedinUserAtom = atomWithStorage(
  StoredKeys.user,
  null,
  storedUserData,
  {
    getOnInit: true,
  },
);

export const userAtom = atomWithStorage<UserT | null>("userDetail", null);

export const userRoleAtom = atom<string | null>(null);

export const emailVerifiedAtom = atom<boolean>((get) => {
  const user = get(loggedinUserAtom);
  return user?.user?.is_email_verified ?? false;
});

export const userWalletAtom = atom(async () => {
  const response = await ApiSDK.WalletService.getMyWalletApiV1WalletGet();
  return {
    "symbol": response.currency,
    "isLocked": response.is_locked,
    "balance": response.balance
  };
});




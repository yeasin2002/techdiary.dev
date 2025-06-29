import { atom } from "jotai";

interface CookieConsentState {
  shown: boolean;
  accepted: boolean;
}

export const cookieConsentAtom = atom<CookieConsentState>({
  shown: false,
  accepted: false,
});
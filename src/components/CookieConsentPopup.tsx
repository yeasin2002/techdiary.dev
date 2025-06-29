"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAtom } from "jotai";
import { X } from "lucide-react";
import { cookieConsentAtom } from "@/store/cookie-consent.atom";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/use-translation";

export const CookieConsentPopup = () => {
  const { _t } = useTranslation();
  const [cookieConsent, setCookieConsent] = useAtom(cookieConsentAtom);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookie-consent");
    if (storedConsent) {
      setCookieConsent({ shown: true, accepted: storedConsent === "true" });
    }
  }, [setCookieConsent]);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setCookieConsent({ shown: true, accepted: true });
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setCookieConsent({ shown: true, accepted: false });
  };

  if (cookieConsent.shown) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border bg-background/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-2">
              {_t("Cookie Consent")}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {_t(
                'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.'
              )}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleAccept} size="sm" className="text-xs">
                {_t("Accept")}
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {_t("Decline")}
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDecline}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

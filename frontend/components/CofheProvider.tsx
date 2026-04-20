"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { cofheClient } from "@/lib/cofhe";

type CofheContextValue = {
  client: typeof cofheClient;
  ready: boolean;
  connecting: boolean;
  error: unknown | null;
  ensurePermit: () => Promise<void>;
};

const CofheContext = createContext<CofheContextValue | null>(null);

export default function CofheProvider({ children }: { children: React.ReactNode }) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [ready, setReady] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      if (!publicClient || !walletClient) {
        setReady(false);
        return;
      }
      setConnecting(true);
      setError(null);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await cofheClient.connect(publicClient as any, walletClient as any);
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setReady(false);
        }
      } finally {
        if (!cancelled) setConnecting(false);
      }
    }

    connect();
    return () => {
      cancelled = true;
    };
  }, [publicClient, walletClient]);

  const ensurePermit = useCallback(async () => {
    if (!ready) throw new Error("CoFHE client is not connected");
    await cofheClient.permits.getOrCreateSelfPermit();
  }, [ready]);

  const value = useMemo<CofheContextValue>(
    () => ({ client: cofheClient, ready, connecting, error, ensurePermit }),
    [ready, connecting, error, ensurePermit],
  );

  return <CofheContext.Provider value={value}>{children}</CofheContext.Provider>;
}

export function useCofheClient(): CofheContextValue {
  const ctx = useContext(CofheContext);
  if (!ctx) throw new Error("useCofheClient must be used inside <CofheProvider>");
  return ctx;
}

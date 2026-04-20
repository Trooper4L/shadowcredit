"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseAbiItem } from "viem";
import { CONTRACTS, CreditPassportABI } from "@/lib/contracts";

type PassportState = {
  tokenId: bigint | null;
  issuedAt: number | null;
  exists: boolean;
};

export function usePassport() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [state, setState] = useState<PassportState>({
    tokenId: null,
    issuedAt: null,
    exists: false,
  });
  const [loading, setLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!address || !publicClient) return;
      try {
        const tokenId = (await publicClient.readContract({
          address: CONTRACTS.CreditPassport,
          abi: CreditPassportABI,
          functionName: "passportOf",
          args: [address],
        })) as bigint;

        if (cancelled) return;

        if (tokenId === 0n) {
          setState({ tokenId: null, issuedAt: null, exists: false });
          return;
        }

        const issuedAt = (await publicClient.readContract({
          address: CONTRACTS.CreditPassport,
          abi: CreditPassportABI,
          functionName: "issuedAt",
          args: [tokenId],
        })) as bigint;

        if (cancelled) return;
        setState({
          tokenId,
          issuedAt: Number(issuedAt),
          exists: true,
        });
      } catch {
        if (!cancelled) setState({ tokenId: null, issuedAt: null, exists: false });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [address, publicClient, refreshTick]);

  const mint = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.CreditPassport,
        abi: CreditPassportABI,
        functionName: "mint",
        args: [],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      refresh();
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, refresh]);

  const burn = useCallback(async (tokenId: bigint) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.CreditPassport,
        abi: CreditPassportABI,
        functionName: "burn",
        args: [tokenId],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      refresh();
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, refresh]);

  return { ...state, mint, burn, loading, refresh };
}

"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { CONTRACTS, ShadowScorerABI } from "@/lib/contracts";

export function useShadowScorer() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<bigint | null>(null);

  const submitProfile = useCallback(async (
    paymentHistory: number,
    utilization: number,
    volume: number,
    repayments: number
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      // In production: encrypt with cofhejs then submit
      // const [payEnc, utilEnc, volEnc, repayEnc] = (await cofhejs.encrypt(...)).data!;
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "submitProfile",
        args: [
          { data: "0x" as `0x${string}`, securityZone: 0 },
          { data: "0x" as `0x${string}`, securityZone: 0 },
          { data: "0x" as `0x${string}`, securityZone: 0 },
          { data: "0x" as `0x${string}`, securityZone: 0 },
        ],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const computeScore = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "computeScore",
        args: [address],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const requestDecrypt = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "requestDecryptScore",
        args: [],
      });
      await publicClient!.waitForTransactionReceipt({ hash });

      // Poll for decryption result
      let attempts = 0;
      while (attempts < 15) {
        const [decryptedScore, isReady] = await publicClient!.readContract({
          address: CONTRACTS.ShadowScorer,
          abi: ShadowScorerABI,
          functionName: "getDecryptedScore",
          account: address,
        }) as [bigint, boolean];

        if (isReady) {
          setScore(decryptedScore);
          return decryptedScore;
        }
        attempts++;
        await new Promise(r => setTimeout(r, 2000));
      }
      throw new Error("Decryption timed out");
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  return { submitProfile, computeScore, requestDecrypt, score, loading };
}

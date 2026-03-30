"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { CONTRACTS, ScoreProverABI } from "@/lib/contracts";

export function useScoreProver() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);

  const grantConsent = useCallback(async (auditorAddress: `0x${string}`) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ScoreProver,
        abi: ScoreProverABI,
        functionName: "grantConsent",
        args: [auditorAddress],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const revokeConsent = useCallback(async (auditorAddress: `0x${string}`) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ScoreProver,
        abi: ScoreProverABI,
        functionName: "revokeConsent",
        args: [auditorAddress],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const requestRangeProof = useCallback(async (
    userAddress: `0x${string}`,
    low: number,
    high: number
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      // In production: encrypt bounds via cofhejs
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ScoreProver,
        abi: ScoreProverABI,
        functionName: "requestRangeProof",
        args: [
          userAddress,
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

  return { grantConsent, revokeConsent, requestRangeProof, loading };
}

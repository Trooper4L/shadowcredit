"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { Encryptable } from "@cofhe/sdk";
import { CONTRACTS, ScoreProverABI } from "@/lib/contracts";
import { useCofheClient } from "@/components/CofheProvider";

export function useScoreProver() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { client: cofhe, ready } = useCofheClient();
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
    high: number,
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    if (!ready) throw new Error("CoFHE client is not ready");
    setLoading(true);
    try {
      const [lowEnc, highEnc] = await cofhe
        .encryptInputs([
          Encryptable.uint64(BigInt(low)),
          Encryptable.uint64(BigInt(high)),
        ])
        .execute();

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ScoreProver,
        abi: ScoreProverABI,
        functionName: "requestRangeProof",
        args: [userAddress, lowEnc, highEnc],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, cofhe, ready]);

  return { grantConsent, revokeConsent, requestRangeProof, loading };
}

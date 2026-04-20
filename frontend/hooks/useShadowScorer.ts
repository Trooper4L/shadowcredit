"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { Encryptable, FheTypes } from "@cofhe/sdk";
import { CONTRACTS, ShadowScorerABI } from "@/lib/contracts";
import { useCofheClient } from "@/components/CofheProvider";

export function useShadowScorer() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { client: cofhe, ready, ensurePermit } = useCofheClient();
  const [loading, setLoading] = useState(false);

  const submitProfile = useCallback(async (
    paymentHistory: number,
    utilization: number,
    volume: number,
    repayments: number,
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    if (!ready) throw new Error("CoFHE client is not ready");
    setLoading(true);

    try {
      const [payEnc, utilEnc, volEnc, repayEnc] = await cofhe
        .encryptInputs([
          Encryptable.uint32(BigInt(paymentHistory)),
          Encryptable.uint32(BigInt(utilization)),
          Encryptable.uint64(BigInt(volume)),
          Encryptable.uint32(BigInt(repayments)),
        ])
        .execute();

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "submitProfile",
        args: [payEnc as any, utilEnc as any, volEnc as any, repayEnc as any],
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, cofhe, ready]);

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

  return { submitProfile, computeScore, loading };
}

/**
 * Off-chain reveal: decryptForView. No gas, no tx. Permit-gated.
 * Used in the UI to show the caller their own plaintext score.
 */
export function useDecryptScoreForDisplay() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { client: cofhe, ready, ensurePermit } = useCofheClient();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<bigint | null>(null);

  const reveal = useCallback(async () => {
    if (!address) throw new Error("Wallet not connected");
    if (!ready) throw new Error("CoFHE client is not ready");
    setLoading(true);
    try {
      await ensurePermit();

      const ctHash = (await publicClient!.readContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "getScoreHandle",
        account: address,
      })) as bigint;

      const plain = await cofhe
        .decryptForView(ctHash, FheTypes.Uint64)
        .withPermit()
        .execute();

      setScore(plain as bigint);
      return plain as bigint;
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, cofhe, ready, ensurePermit]);

  return { reveal, score, loading };
}

/**
 * On-chain reveal: decryptForTx + publishScore. Costs gas.
 * Used when the plaintext must be visible on-chain (analytics, integrations).
 */
export function useDecryptScoreForChain() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { client: cofhe, ready, ensurePermit } = useCofheClient();
  const [loading, setLoading] = useState(false);

  const publish = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    if (!ready) throw new Error("CoFHE client is not ready");
    setLoading(true);
    try {
      await ensurePermit();

      const ctHash = (await publicClient!.readContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "getScoreHandle",
        account: address,
      })) as bigint;

      const { decryptedValue, signature } = await cofhe
        .decryptForTx(ctHash)
        .withPermit()
        .execute();

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowScorer,
        abi: ShadowScorerABI,
        functionName: "publishScore",
        args: [decryptedValue, signature],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return { txHash: hash, score: decryptedValue };
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, cofhe, ready, ensurePermit]);

  return { publish, loading };
}

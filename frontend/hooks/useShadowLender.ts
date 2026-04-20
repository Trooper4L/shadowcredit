"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { Encryptable } from "@cofhe/sdk";
import { CONTRACTS, ShadowLenderABI, MockUSDCABI } from "@/lib/contracts";
import { useCofheClient } from "@/components/CofheProvider";

export function useShadowLender() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { client: cofhe, ready } = useCofheClient();
  const [loading, setLoading] = useState(false);

  const deposit = useCallback(async (amount: string) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const amountWei = parseUnits(amount, 6);

      const approveHash = await walletClient.writeContract({
        address: CONTRACTS.MockUSDC,
        abi: MockUSDCABI,
        functionName: "approve",
        args: [CONTRACTS.ShadowLender, amountWei],
      });
      await publicClient!.waitForTransactionReceipt({ hash: approveHash });

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowLender,
        abi: ShadowLenderABI,
        functionName: "deposit",
        args: [amountWei],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const encryptThreshold = useCallback(async (threshold: number | bigint) => {
    if (!ready) throw new Error("CoFHE client is not ready");
    const [thresholdEnc] = await cofhe
      .encryptInputs([Encryptable.uint64(BigInt(threshold))])
      .execute();
    return thresholdEnc;
  }, [cofhe, ready]);

  const requestLoan = useCallback(async (
    loanAmountUsdc: string,
    collateralEth: bigint,
    threshold: number | bigint,
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const amountWei = parseUnits(loanAmountUsdc, 6);
      const thresholdEnc = await encryptThreshold(threshold);

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowLender,
        abi: ShadowLenderABI,
        functionName: "requestLoan",
        args: [amountWei, thresholdEnc],
        value: collateralEth,
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, encryptThreshold]);

  const requestLoanViaPassport = useCallback(async (
    tokenId: bigint,
    loanAmountUsdc: string,
    collateralEth: bigint,
    threshold: number | bigint,
  ) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const amountWei = parseUnits(loanAmountUsdc, 6);
      const thresholdEnc = await encryptThreshold(threshold);

      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowLender,
        abi: ShadowLenderABI,
        functionName: "requestLoanViaPassport",
        args: [tokenId, amountWei, thresholdEnc],
        value: collateralEth,
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, encryptThreshold]);

  const repayLoan = useCallback(async () => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowLender,
        abi: ShadowLenderABI,
        functionName: "repayLoan",
        args: [],
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  const getPoolStats = useCallback(async () => {
    if (!publicClient) return null;
    const totalLiquidity = await publicClient.readContract({
      address: CONTRACTS.ShadowLender,
      abi: ShadowLenderABI,
      functionName: "totalLiquidity",
    });
    return { totalLiquidity };
  }, [publicClient]);

  return { deposit, requestLoan, requestLoanViaPassport, repayLoan, getPoolStats, loading };
}

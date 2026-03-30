"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { CONTRACTS, ShadowLenderABI, MockUSDCABI } from "@/lib/contracts";
import { parseUnits } from "viem";

export function useShadowLender() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);

  const deposit = useCallback(async (amount: string) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const amountWei = parseUnits(amount, 6); // USDC has 6 decimals

      // Approve first
      const approveHash = await walletClient.writeContract({
        address: CONTRACTS.MockUSDC,
        abi: MockUSDCABI,
        functionName: "approve",
        args: [CONTRACTS.ShadowLender, amountWei],
      });
      await publicClient!.waitForTransactionReceipt({ hash: approveHash });

      // Then deposit
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

  const requestLoan = useCallback(async (loanAmountUsdc: string, collateralEth: bigint) => {
    if (!walletClient || !address) throw new Error("Wallet not connected");
    setLoading(true);

    try {
      const amountWei = parseUnits(loanAmountUsdc, 6);

      // In production: encrypt threshold via cofhejs
      const hash = await walletClient.writeContract({
        address: CONTRACTS.ShadowLender,
        abi: ShadowLenderABI,
        functionName: "requestLoan",
        args: [amountWei, { data: "0x" as `0x${string}`, securityZone: 0 }],
        value: collateralEth,
      });
      await publicClient!.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

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

  return { deposit, requestLoan, repayLoan, getPoolStats, loading };
}

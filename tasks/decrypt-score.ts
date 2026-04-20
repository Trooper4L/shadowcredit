import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { createCofheConfig, createCofheClient } from "@cofhe/sdk/node";
import { HardhatSignerAdapter } from "@cofhe/sdk/adapters";
import { chains } from "@cofhe/sdk/chains";
import { FheTypes } from "@cofhe/sdk";

task("decrypt-score", "View your own encrypted credit score via off-chain decryptForView")
  .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const [user] = await ethers.getSigners();

    const config = createCofheConfig({
      supportedChains: [chains.arbSepolia, chains.hardhat, chains.localcofhe],
    });
    const client = createCofheClient(config);
    const { publicClient, walletClient } = await HardhatSignerAdapter(user);
    await client.connect(publicClient, walletClient);

    const deployments = JSON.parse(require("fs").readFileSync("./deployments.json"));
    const scorer = await ethers.getContractAt("ShadowScorer", deployments.ShadowScorer);

    console.log(`\nReading encrypted score handle for: ${user.address}`);
    const ctHash: bigint = await scorer.connect(user).getScoreHandle();

    console.log("Creating / reusing self permit...");
    await client.permits.getOrCreateSelfPermit();

    console.log("Decrypting off-chain (decryptForView)...");
    const score = await client
      .decryptForView(ctHash, FheTypes.Uint64)
      .withPermit()
      .execute();

    console.log(`\nYour Credit Score: ${score}`);
    console.log(`   Range: 300 (poor) -> 850 (excellent)`);
    console.log(`   Note: This is only visible to YOU. No one else can read this.\n`);
  });

task("publish-score", "Decrypt via decryptForTx and publish the plaintext on-chain")
  .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const [user] = await ethers.getSigners();

    const config = createCofheConfig({
      supportedChains: [chains.arbSepolia, chains.hardhat, chains.localcofhe],
    });
    const client = createCofheClient(config);
    const { publicClient, walletClient } = await HardhatSignerAdapter(user);
    await client.connect(publicClient, walletClient);

    const deployments = JSON.parse(require("fs").readFileSync("./deployments.json"));
    const scorer = await ethers.getContractAt("ShadowScorer", deployments.ShadowScorer);

    console.log(`\nPublishing on-chain decrypted score for: ${user.address}`);
    const ctHash: bigint = await scorer.connect(user).getScoreHandle();

    await client.permits.getOrCreateSelfPermit();

    const { decryptedValue, signature } = await client
      .decryptForTx(ctHash)
      .withPermit()
      .execute();

    console.log(`Decrypted value (will be public on-chain): ${decryptedValue}`);
    const tx = await scorer.connect(user).publishScore(decryptedValue, signature);
    await tx.wait();
    console.log(`Published! TX: ${tx.hash}`);
  });

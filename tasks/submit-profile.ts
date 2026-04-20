import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { createCofheConfig, createCofheClient } from "@cofhe/sdk/node";
import { HardhatSignerAdapter } from "@cofhe/sdk/adapters";
import { chains } from "@cofhe/sdk/chains";
import { Encryptable } from "@cofhe/sdk";

task("submit-profile", "Submit encrypted credit data for the connected wallet")
  .addParam("payment", "Payment history score 0-100")
  .addParam("utilization", "Credit utilization 0-100")
  .addParam("volume", "Total transaction volume (USDC cents)")
  .addParam("repayments", "Number of repaid loans")
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const [user] = await ethers.getSigners();

    console.log(`\nSubmitting encrypted profile for: ${user.address}`);

    const config = createCofheConfig({
      supportedChains: [chains.arbSepolia, chains.hardhat, chains.localcofhe],
    });
    const client = createCofheClient(config);
    const { publicClient, walletClient } = await HardhatSignerAdapter(user);
    await client.connect(publicClient, walletClient);

    const deployments = JSON.parse(require("fs").readFileSync("./deployments.json"));
    const scorer = await ethers.getContractAt("ShadowScorer", deployments.ShadowScorer);

    console.log("Encrypting inputs...");
    const [paymentEnc, utilizationEnc, volumeEnc, repaymentEnc] = await client
      .encryptInputs([
        Encryptable.uint32(BigInt(args.payment)),
        Encryptable.uint32(BigInt(args.utilization)),
        Encryptable.uint64(BigInt(args.volume)),
        Encryptable.uint32(BigInt(args.repayments)),
      ])
      .onStep((step) => console.log(`  Encrypt step: ${step}`))
      .execute();

    console.log("Submitting to ShadowScorer...");
    const tx = await scorer.submitProfile(
      paymentEnc,
      utilizationEnc,
      volumeEnc,
      repaymentEnc
    );
    await tx.wait();
    console.log(`Profile submitted! TX: ${tx.hash}`);

    console.log("Computing encrypted credit score...");
    const scoreTx = await scorer.computeScore(user.address);
    await scoreTx.wait();
    console.log(`Score computed! TX: ${scoreTx.hash}`);
    console.log("\nScore stored encrypted. Use 'decrypt-score' to view your own score.\n");
  });

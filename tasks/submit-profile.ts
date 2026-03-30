import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  cofhejs_initializeWithHardhatSigner,
  expectResultSuccess
} from "cofhe-hardhat-plugin";
import { cofhejs, Encryptable } from "cofhejs/node";

task("submit-profile", "Submit encrypted credit data for the connected wallet")
  .addParam("payment", "Payment history score 0-100")
  .addParam("utilization", "Credit utilization 0-100")
  .addParam("volume", "Total transaction volume (USDC cents)")
  .addParam("repayments", "Number of repaid loans")
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const [user] = await ethers.getSigners();

    console.log(`\nSubmitting encrypted profile for: ${user.address}`);

    await cofhejs_initializeWithHardhatSigner(user);

    const deployments = JSON.parse(require("fs").readFileSync("./deployments.json"));
    const scorer = await ethers.getContractAt("ShadowScorer", deployments.ShadowScorer);

    // Encrypt all inputs client-side BEFORE sending to contract
    console.log("Encrypting inputs...");
    const [paymentEnc, utilizationEnc, volumeEnc, repaymentEnc] = expectResultSuccess(
      await cofhejs.encrypt(
        (step: string) => console.log(`  Encrypt step: ${step}`),
        [
          Encryptable.uint32(BigInt(args.payment)),
          Encryptable.uint32(BigInt(args.utilization)),
          Encryptable.uint64(BigInt(args.volume)),
          Encryptable.uint32(BigInt(args.repayments)),
        ]
      )
    );

    console.log("Submitting to ShadowScorer...");
    const tx = await scorer.submitProfile(
      paymentEnc,
      utilizationEnc,
      volumeEnc,
      repaymentEnc
    );
    await tx.wait();
    console.log(`Profile submitted! TX: ${tx.hash}`);

    // Trigger score computation
    console.log("Computing encrypted credit score...");
    const scoreTx = await scorer.computeScore(user.address);
    await scoreTx.wait();
    console.log(`Score computed! TX: ${scoreTx.hash}`);
    console.log("\nScore is stored encrypted. Use 'decrypt-score' task to view your own score.\n");
  });

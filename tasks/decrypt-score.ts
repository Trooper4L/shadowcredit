import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { cofhejs_initializeWithHardhatSigner } from "cofhe-hardhat-plugin";

task("decrypt-score", "Request decryption and view your own encrypted credit score")
  .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const [user] = await ethers.getSigners();

    await cofhejs_initializeWithHardhatSigner(user);

    const deployments = JSON.parse(require("fs").readFileSync("./deployments.json"));
    const scorer = await ethers.getContractAt("ShadowScorer", deployments.ShadowScorer);

    console.log(`\nDecrypting score for: ${user.address}`);

    // Request decryption (async — CoFHE will resolve)
    const tx = await scorer.requestDecryptScore();
    await tx.wait();
    console.log("Decryption requested, waiting for CoFHE to resolve...");

    // Poll for result
    let attempts = 0;
    while (attempts < 30) {
      const [score, isReady] = await scorer.getDecryptedScore();
      if (isReady) {
        console.log(`\nYour Credit Score: ${score}`);
        console.log(`   Range: 300 (poor) -> 850 (excellent)`);
        console.log(`   Note: This is only visible to YOU. No one else can read this.\n`);
        return;
      }
      attempts++;
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log("Decryption timed out. Try again later.");
  });

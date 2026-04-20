import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from "fs";

task("deploy-shadowcredit", "Deploy all ShadowCredit contracts to the network")
  .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre;
    const [deployer] = await ethers.getSigners();

    console.log(`\nDeploying ShadowCredit to: ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

    // 1. Deploy MockUSDC
    console.log("1/4 Deploying MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const usdcAddress = await mockUSDC.getAddress();
    console.log(`   MockUSDC: ${usdcAddress}`);

    // 2. Deploy ShadowScorer
    console.log("2/4 Deploying ShadowScorer...");
    const ShadowScorer = await ethers.getContractFactory("ShadowScorer");
    const shadowScorer = await ShadowScorer.deploy();
    await shadowScorer.waitForDeployment();
    const scorerAddress = await shadowScorer.getAddress();
    console.log(`   ShadowScorer: ${scorerAddress}`);

    // 3. Deploy ShadowLender
    console.log("3/4 Deploying ShadowLender...");
    const minScore = 500; // Minimum score threshold
    const ShadowLender = await ethers.getContractFactory("ShadowLender");
    const shadowLender = await ShadowLender.deploy(scorerAddress, usdcAddress, minScore);
    await shadowLender.waitForDeployment();
    const lenderAddress = await shadowLender.getAddress();
    console.log(`   ShadowLender: ${lenderAddress}`);

    // 4. Deploy ScoreProver
    console.log("4/5 Deploying ScoreProver...");
    const ScoreProver = await ethers.getContractFactory("ScoreProver");
    const scoreProver = await ScoreProver.deploy(scorerAddress);
    await scoreProver.waitForDeployment();
    const proverAddress = await scoreProver.getAddress();
    console.log(`   ScoreProver: ${proverAddress}`);

    // 5. Deploy CreditPassport (the Vidix identity primitive)
    console.log("5/5 Deploying CreditPassport...");
    const CreditPassport = await ethers.getContractFactory("CreditPassport");
    const creditPassport = await CreditPassport.deploy(scorerAddress);
    await creditPassport.waitForDeployment();
    const passportAddress = await creditPassport.getAddress();
    console.log(`   CreditPassport: ${passportAddress}`);

    // Authorize ShadowLender + CreditPassport to read score handles in ShadowScorer
    console.log("\nSetting up permissions...");
    await shadowScorer.setAuthorizedSubmitter(lenderAddress, true);
    console.log(`   ShadowLender authorized in ShadowScorer`);
    await shadowScorer.setAuthorizedSubmitter(passportAddress, true);
    console.log(`   CreditPassport authorized in ShadowScorer`);
    await shadowLender.setPassport(passportAddress);
    console.log(`   CreditPassport registered on ShadowLender`);

    // Seed the lending pool with USDC
    console.log("Seeding lending pool...");
    const seedAmount = 10_000n * 10n**6n; // 10,000 USDC
    await mockUSDC.approve(lenderAddress, seedAmount);
    await shadowLender.deposit(seedAmount);
    console.log(`   Pool seeded with 10,000 mUSDC`);

    // Save addresses to file for frontend
    const addresses = {
      network: network.name,
      chainId: network.config.chainId,
      MockUSDC: usdcAddress,
      ShadowScorer: scorerAddress,
      ShadowLender: lenderAddress,
      ScoreProver: proverAddress,
      CreditPassport: passportAddress,
      deployedAt: new Date().toISOString()
    };

    fs.writeFileSync("./deployments.json", JSON.stringify(addresses, null, 2));
    console.log("\nAddresses saved to deployments.json");
    console.log("\nVidix deployed successfully!\n");
    console.log(JSON.stringify(addresses, null, 2));
  });

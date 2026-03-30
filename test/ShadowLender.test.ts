import { expect } from "chai";
import hre from "hardhat";
import { cofhejs, Encryptable } from "cofhejs/node";

describe("ShadowLender", () => {
  let scorer: any, lenderContract: any, mockUSDC: any;
  let owner: any, borrower: any, liquidityProvider: any;

  beforeEach(async () => {
    [owner, borrower, liquidityProvider] = await hre.ethers.getSigners();

    await hre.cofhe.initializeWithHardhatSigner(owner);

    // Deploy MockUSDC
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // Deploy ShadowScorer
    const ShadowScorer = await hre.ethers.getContractFactory("ShadowScorer");
    scorer = await ShadowScorer.deploy();
    await scorer.waitForDeployment();

    // Deploy ShadowLender
    const ShadowLender = await hre.ethers.getContractFactory("ShadowLender");
    lenderContract = await ShadowLender.deploy(
      await scorer.getAddress(),
      await mockUSDC.getAddress(),
      500 // min score threshold
    );
    await lenderContract.waitForDeployment();

    // Authorize lender in scorer
    await scorer.setAuthorizedSubmitter(await lenderContract.getAddress(), true);

    // Seed pool with USDC
    const seedAmount = 100_000n * 10n**6n;
    await mockUSDC.approve(await lenderContract.getAddress(), seedAmount);
    await lenderContract.deposit(seedAmount);
  });

  it("should allow lenders to deposit USDC", async () => {
    const depositAmount = 5_000n * 10n**6n;

    // Mint USDC for liquidity provider
    await mockUSDC.mint(liquidityProvider.address, depositAmount);
    await mockUSDC.connect(liquidityProvider).approve(await lenderContract.getAddress(), depositAmount);
    await lenderContract.connect(liquidityProvider).deposit(depositAmount);

    expect(await lenderContract.lenderDeposits(liquidityProvider.address)).to.equal(depositAmount);
  });

  it("should allow borrower with score to request a loan", async () => {
    // Submit borrower profile
    await hre.cofhe.initializeWithHardhatSigner(borrower);
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(85n),
        Encryptable.uint32(20n),
        Encryptable.uint64(500000n),
        Encryptable.uint32(3n),
      ])
    );

    await (await scorer.connect(borrower).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(borrower.address)).wait();

    // Request loan
    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(500n)])
    );

    const loanAmount = 1_000n * 10n**6n;
    const tx = await lenderContract.connect(borrower).requestLoan(loanAmount, thresholdEnc);
    await tx.wait();

    const request = await lenderContract.loanRequests(0);
    expect(request.borrower).to.equal(borrower.address);
    expect(request.amount).to.equal(loanAmount);
    expect(request.settled).to.be.false;
  });

  it("should disburse USDC when loan is approved", async () => {
    // Submit borrower profile + compute score
    await hre.cofhe.initializeWithHardhatSigner(borrower);
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(85n),
        Encryptable.uint32(20n),
        Encryptable.uint64(500000n),
        Encryptable.uint32(3n),
      ])
    );

    await (await scorer.connect(borrower).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(borrower.address)).wait();

    // Request loan
    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(500n)])
    );

    const loanAmount = 1_000n * 10n**6n;
    await (await lenderContract.connect(borrower).requestLoan(loanAmount, thresholdEnc)).wait();

    // Owner settles the loan as approved
    const balanceBefore = await mockUSDC.balanceOf(borrower.address);
    await lenderContract.connect(owner).settleLoan(0, true);
    const balanceAfter = await mockUSDC.balanceOf(borrower.address);

    expect(balanceAfter - balanceBefore).to.equal(loanAmount);
    expect(await lenderContract.hasActiveLoan(borrower.address)).to.be.true;
  });

  it("should allow borrower to repay loan", async () => {
    // Setup: submit profile, compute score, request + approve loan
    await hre.cofhe.initializeWithHardhatSigner(borrower);
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(85n),
        Encryptable.uint32(20n),
        Encryptable.uint64(500000n),
        Encryptable.uint32(3n),
      ])
    );

    await (await scorer.connect(borrower).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(borrower.address)).wait();

    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(500n)])
    );

    const loanAmount = 1_000n * 10n**6n;
    await (await lenderContract.connect(borrower).requestLoan(loanAmount, thresholdEnc)).wait();
    await lenderContract.connect(owner).settleLoan(0, true);

    // Repay: borrower needs USDC to repay
    await mockUSDC.connect(borrower).approve(await lenderContract.getAddress(), loanAmount);
    await lenderContract.connect(borrower).repayLoan();

    expect(await lenderContract.hasActiveLoan(borrower.address)).to.be.false;
  });

  it("should reject loan request from borrower without score", async () => {
    await hre.cofhe.initializeWithHardhatSigner(borrower);
    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(500n)])
    );

    await expect(
      lenderContract.connect(borrower).requestLoan(1000n * 10n**6n, thresholdEnc)
    ).to.be.revertedWith("No credit score");
  });
});

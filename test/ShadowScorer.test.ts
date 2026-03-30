import { expect } from "chai";
import hre from "hardhat";
import { cofhejs, Encryptable } from "cofhejs/node";

describe("ShadowScorer", () => {
  let scorer: any;
  let owner: any, user: any, lender: any;

  beforeEach(async () => {
    [owner, user, lender] = await hre.ethers.getSigners();

    // Initialize cofhejs with mock environment
    await hre.cofhe.initializeWithHardhatSigner(owner);

    const ShadowScorer = await hre.ethers.getContractFactory("ShadowScorer");
    scorer = await ShadowScorer.deploy();
    await scorer.waitForDeployment();
  });

  it("should accept encrypted profile submission", async () => {
    await hre.cofhe.initializeWithHardhatSigner(user);

    // Encrypt inputs
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(
        () => {},
        [
          Encryptable.uint32(80n),
          Encryptable.uint32(25n),
          Encryptable.uint64(300000n),
          Encryptable.uint32(2n),
        ]
      )
    );

    const tx = await scorer.connect(user).submitProfile(payEnc, utilEnc, volEnc, repayEnc);
    await tx.wait();

    expect(await scorer.hasProfile(user.address)).to.be.true;
  });

  it("should compute encrypted score without revealing plaintext", async () => {
    await hre.cofhe.initializeWithHardhatSigner(user);

    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(80n),
        Encryptable.uint32(25n),
        Encryptable.uint64(300000n),
        Encryptable.uint32(2n),
      ])
    );

    await (await scorer.connect(user).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(user.address)).wait();

    expect(await scorer.hasScore(user.address)).to.be.true;

    // Verify score is in valid range using mock plaintext inspection
    const encryptedScore = await scorer.getEncryptedScore(user.address);
    const score = await hre.cofhe.mocks.getPlaintext(encryptedScore);
    console.log(`   Computed score: ${score}`);

    // Score should be in valid range 300-850+
    expect(score).to.be.greaterThanOrEqual(300n);
  });

  it("should return ebool qualification result without revealing score", async () => {
    await hre.cofhe.initializeWithHardhatSigner(user);

    // Submit high-quality profile
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(90n),
        Encryptable.uint32(10n),
        Encryptable.uint64(1000000n),
        Encryptable.uint32(5n),
      ])
    );

    await (await scorer.connect(user).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(user.address)).wait();

    // Lender checks qualification with threshold of 500
    await hre.cofhe.initializeWithHardhatSigner(lender);
    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(500n)])
    );

    // Need to authorize lender first
    await scorer.connect(owner).setAuthorizedSubmitter(lender.address, true);
    const qualifiedHandle = await scorer.connect(lender).qualifies.staticCall(user.address, thresholdEnc);

    const qualified = await hre.cofhe.mocks.getPlaintext(qualifiedHandle);
    console.log(`   Qualified for loan: ${qualified}`);
    expect(qualified).to.equal(1n); // true = 1
  });

  it("should deny qualification for low-scoring profile", async () => {
    await hre.cofhe.initializeWithHardhatSigner(user);

    // Poor credit profile
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(10n),
        Encryptable.uint32(90n),
        Encryptable.uint64(1000n),
        Encryptable.uint32(0n),
      ])
    );

    await (await scorer.connect(user).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(user.address)).wait();

    await hre.cofhe.initializeWithHardhatSigner(lender);
    const [thresholdEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [Encryptable.uint64(600n)])
    );

    await scorer.connect(owner).setAuthorizedSubmitter(lender.address, true);
    const qualifiedHandle = await scorer.connect(lender).qualifies.staticCall(user.address, thresholdEnc);
    const qualified = await hre.cofhe.mocks.getPlaintext(qualifiedHandle);
    expect(qualified).to.equal(0n); // false = 0
  });
});

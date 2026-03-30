import { expect } from "chai";
import hre from "hardhat";
import { cofhejs, Encryptable } from "cofhejs/node";

describe("ScoreProver", () => {
  let scorer: any, prover: any;
  let owner: any, user: any, auditor: any, unauthorizedAuditor: any;

  beforeEach(async () => {
    [owner, user, auditor, unauthorizedAuditor] = await hre.ethers.getSigners();

    await hre.cofhe.initializeWithHardhatSigner(owner);

    // Deploy ShadowScorer
    const ShadowScorer = await hre.ethers.getContractFactory("ShadowScorer");
    scorer = await ShadowScorer.deploy();
    await scorer.waitForDeployment();

    // Deploy ScoreProver
    const ScoreProver = await hre.ethers.getContractFactory("ScoreProver");
    prover = await ScoreProver.deploy(await scorer.getAddress());
    await prover.waitForDeployment();

    // Authorize ScoreProver in ShadowScorer
    await scorer.setAuthorizedSubmitter(await prover.getAddress(), true);

    // Register auditor
    await prover.registerAuditor(auditor.address);

    // Submit user profile and compute score
    await hre.cofhe.initializeWithHardhatSigner(user);
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(80n),
        Encryptable.uint32(25n),
        Encryptable.uint64(500000n),
        Encryptable.uint32(3n),
      ])
    );

    await (await scorer.connect(user).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(user.address)).wait();
  });

  it("should allow registered auditor with consent to request range proof", async () => {
    // User grants consent to auditor
    await prover.connect(user).grantConsent(auditor.address);

    // Auditor requests range proof
    await hre.cofhe.initializeWithHardhatSigner(auditor);
    const [lowEnc, highEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint64(300n),
        Encryptable.uint64(900n),
      ])
    );

    const inRangeHandle = await prover.connect(auditor).requestRangeProof.staticCall(
      user.address, lowEnc, highEnc
    );

    const inRange = await hre.cofhe.mocks.getPlaintext(inRangeHandle);
    expect(inRange).to.equal(1n); // should be in range
  });

  it("should reject unregistered auditor", async () => {
    await hre.cofhe.initializeWithHardhatSigner(unauthorizedAuditor);
    const [lowEnc, highEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint64(300n),
        Encryptable.uint64(900n),
      ])
    );

    await expect(
      prover.connect(unauthorizedAuditor).requestRangeProof(user.address, lowEnc, highEnc)
    ).to.be.revertedWith("Not a registered auditor");
  });

  it("should reject range proof without user consent", async () => {
    await hre.cofhe.initializeWithHardhatSigner(auditor);
    const [lowEnc, highEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint64(300n),
        Encryptable.uint64(900n),
      ])
    );

    await expect(
      prover.connect(auditor).requestRangeProof(user.address, lowEnc, highEnc)
    ).to.be.revertedWith("User has not consented");
  });

  it("should allow user to revoke consent", async () => {
    await prover.connect(user).grantConsent(auditor.address);
    expect(await prover.userConsent(user.address, auditor.address)).to.be.true;

    await prover.connect(user).revokeConsent(auditor.address);
    expect(await prover.userConsent(user.address, auditor.address)).to.be.false;
  });
});

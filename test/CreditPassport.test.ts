import { expect } from "chai";
import hre from "hardhat";
import { cofhejs, Encryptable } from "cofhejs/node";

describe("CreditPassport", () => {
  let scorer: any, passport: any;
  let owner: any, user: any, stranger: any;

  beforeEach(async () => {
    [owner, user, stranger] = await hre.ethers.getSigners();
    await hre.cofhe.initializeWithHardhatSigner(owner);

    const ShadowScorer = await hre.ethers.getContractFactory("ShadowScorer");
    scorer = await ShadowScorer.deploy();
    await scorer.waitForDeployment();

    const CreditPassport = await hre.ethers.getContractFactory("CreditPassport");
    passport = await CreditPassport.deploy(await scorer.getAddress());
    await passport.waitForDeployment();

    // Passport needs to be able to read encrypted scores from the scorer.
    await scorer.setAuthorizedSubmitter(await passport.getAddress(), true);
  });

  async function buildProfile(signer: any) {
    await hre.cofhe.initializeWithHardhatSigner(signer);
    const [payEnc, utilEnc, volEnc, repayEnc] = await hre.cofhe.expectResultSuccess(
      cofhejs.encrypt(() => {}, [
        Encryptable.uint32(85n),
        Encryptable.uint32(20n),
        Encryptable.uint64(500000n),
        Encryptable.uint32(3n),
      ])
    );
    await (await scorer.connect(signer).submitProfile(payEnc, utilEnc, volEnc, repayEnc)).wait();
    await (await scorer.computeScore(signer.address)).wait();
  }

  it("reverts mint when the caller has no Vidix profile", async () => {
    await expect(passport.connect(user).mint()).to.be.revertedWithCustomError(passport, "NoProfile");
  });

  it("mints one soulbound passport per wallet", async () => {
    await buildProfile(user);
    const tx = await passport.connect(user).mint();
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);

    const tokenId = await passport.passportOf(user.address);
    expect(tokenId).to.equal(1n);
    expect(await passport.ownerOf(tokenId)).to.equal(user.address);
  });

  it("rejects a second mint from the same wallet", async () => {
    await buildProfile(user);
    await (await passport.connect(user).mint()).wait();
    await expect(passport.connect(user).mint()).to.be.revertedWithCustomError(passport, "AlreadyMinted");
  });

  it("blocks transfer (soulbound) but permits mint + burn", async () => {
    await buildProfile(user);
    await (await passport.connect(user).mint()).wait();
    const tokenId = await passport.passportOf(user.address);

    await expect(
      passport.connect(user).transferFrom(user.address, stranger.address, tokenId)
    ).to.be.revertedWithCustomError(passport, "SoulboundTransferDisallowed");

    await (await passport.connect(user).burn(tokenId)).wait();
    expect(await passport.passportOf(user.address)).to.equal(0n);
  });

  it("advertises ERC-5192 support and returns locked=true", async () => {
    await buildProfile(user);
    await (await passport.connect(user).mint()).wait();
    const tokenId = await passport.passportOf(user.address);

    expect(await passport.supportsInterface("0xb45a3c0e")).to.be.true;
    expect(await passport.locked(tokenId)).to.be.true;
  });
});

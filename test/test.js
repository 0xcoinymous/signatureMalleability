const {expect} = require("chai")
const {ethers} = require("hardhat")

describe("test ABCD token", async () => {
    let abcd 
    let owner, user

    const deployContracts = async () => {
        [owner, user] = await ethers.getSigners()
        let ABCD = await ethers.getContractFactory("ABCD")
        abcd = await ABCD.deploy()
        console.log(`token ABCD deployed at ${abcd.target}`);
    }

    before(async () => {
        await deployContracts()
    })

    it("test mint process using ECDSA", async () => {
        let mintAmount = BigInt(1e20)

        let messageHash = await abcd.getMintHash(user.address, mintAmount)
        const formattedMessage = Buffer.from(messageHash.slice(2), 'hex')
        let sig = await owner.signMessage(formattedMessage)
        let splitSig = ethers.Signature.from(sig)
        console.log(`
            signer: ${owner.address}
            messageHash: ${messageHash}
            r: ${splitSig.r}
            s: ${splitSig.s}
            v: ${"0x" + sig.slice(-2)}    
        `);
        await expect(abcd.connect(user).mint(mintAmount, sig)).to.changeTokenBalance(abcd, user, mintAmount)
        console.log(`user balance changed for ${mintAmount / BigInt(1e18)} ABCD token.`);
    })
})


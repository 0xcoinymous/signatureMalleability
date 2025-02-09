const {Web3} = require("web3");
const BN = require("bn.js");
const { assert } = require("chai");

const web3 = new Web3(Web3.givenProvider);

const N = new BN("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141".substr(2), 16);

function Main(){
    let acc = web3.eth.accounts.create();
    console.log(`Original signer address : ${acc.address}`);

    const msgHash = web3.utils.soliditySha3("hello");
    let sig = acc.sign(msgHash);

    assert(acc.address == web3.eth.accounts.recover(msgHash, sig.signature), "Something is wrong w the signature");

    let S = new BN(sig.s.substr(2), 16)
    let newV = new BN(sig.v.substr(2), 16).mod(new BN('2')) == 0 ? new BN('1b', 16) : new BN('1c', 16);
    console.log(`
    ------------- step1 --------------
    sig: ${sig.signature}    
    recoverd address: ${acc.address}
    `);

    let newSig = sig.r + 
        N.sub(S).toString(16) + // manipulate S
        newV.toString(16);

    let recoveredSignerFromNewSignature = web3.eth.accounts.recover(msgHash, newSig);
    assert(recoveredSignerFromNewSignature == acc.address, "Signers are not equal");

    console.log(`
    ------------- step2 --------------
    sig: ${newSig}    
    recoverd address: ${recoveredSignerFromNewSignature}
    `);

    console.log("Signature Malleability Attack Done.")
}

Main()
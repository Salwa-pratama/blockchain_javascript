const SHA256 = require("crypto-js/sha256");

// Object Block
class Block {
  // Constructor property
  constructor(index, timeStamp, data, previousHash = "") {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = this.deepFreeze(data);
    this.previousHash = previousHash;
    this.hash = this.calculateHash();

    Object.freeze(this);
  }
  // Method in object Block
  // Returned hashed string value
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timeStamp +
        JSON.stringify(this.data)
    ).toString();
  }

  //   freeze Object
  deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      if (
        obj[prop] !== null &&
        typeof obj[prop] === "object" &&
        !Object.isFrozen(obj[prop])
      ) {
        this.deepFreeze(obj[prop]);
      }
    });
    return Object.freeze(obj);
  }
}

// Blockchain Object
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2017", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data, timeStamp) {
    const latesBlock = this.getLatestBlock();
    // Jadi previeos hash itu didapat dari hash sebuah block sebelumnya jadi saling berkaitan
    // kaya hampir mirip algoritma apa ya lupa aku kaya ada node2 nya tapi berupa hash
    const newBlock = new Block(
      this.chain.length,
      timeStamp,
      data,
      latesBlock.hash
    );
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      // if hash the block not same with original hashed, then return false  value because that
      //  is not real block
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Implementation
let candidateBlock = new Blockchain();
candidateBlock.addBlock({ candidateName: "surya", votes: 10 }, "17/01/2026");
candidateBlock.addBlock(
  { candidateName: "Suryajana", votes: 20 },
  "17/01/2026"
);
console.log(JSON.stringify(candidateBlock, null, 4));
// Test validation of blockchain

console.log(`Is Valid chian ? ${candidateBlock.isChainValid()}`);
candidateBlock.chain[1].hash = "100";

console.log(`
Update Chain ${JSON.stringify(candidateBlock, null, 4)}
Is Valid Chain ? = ${candidateBlock.isChainValid()}
`);

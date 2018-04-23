//npm install --save crypto-js
const SHA256 = require('crypto-js/sha256');


class Transaction{
	constructor(addressFrom, addressTo, amount){
		this.addressFrom = addressFrom;
		this.addressTo = addressTo;
		this.amount = amount;
	}
}

class Block{
	constructor(timestamp, transactions, previousHash=''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
	}

	mineBlock(difficulty){
		while(Array(difficulty + 1).join("0") !== this.hash.substring(0, difficulty)){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("BLOCK MINED"+ this.hash);
	}

}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 4;
		this.pendingTransactions = [];
		this.mininReward = 100;
	}

	createGenesisBlock(){
		return new Block("01/01/18", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}
	
	//method called by miners
	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("\n \n Block Successfully Mined");

		this.chain.push(block);
		//mining rewardl
		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.mininReward)
		];


	}

	createTransactions(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			for(const trans of block.transactions){
				 if(trans.addressFrom === address) {
				 	balance -= trans.amount;
				 }
				 if(trans.addressTo === address) {
				 	balance += trans.amount;
				 }
			}
		}
		return balance;
	}

	isChianValid(){
		for(let i=1; i<this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}
			if(previousBlock.hash !== currentBlock.previousHash){
				return false;
			}
		}
		return true;
	}
}


let myCoin = new Blockchain();


myCoin.createTransactions(new Transaction("address-1", "address-2", 50 ));
myCoin.createTransactions(new Transaction("address-3", "address-4", 60 ));
myCoin.createTransactions(new Transaction("address-4", "address-8", 160 ));

console.log('\n \n Starting the miner');

myCoin.minePendingTransactions("minerAddress");

console.log('\n \n balance of miner is ', myCoin.getBalanceOfAddress("minerAddress"));

console.log('\n \n Latest block = \n ', myCoin.getLatestBlock());

myCoin.createTransactions(new Transaction("address-5", "address-3", 50 ));
myCoin.createTransactions(new Transaction("address-7", "address-5", 60 ));


myCoin.minePendingTransactions("minerAddress");


console.log('\n \n balance of miner is ', myCoin.getBalanceOfAddress("minerAddress"));

// console.log("Mining block 1...");
// myCoin.addBlock(new Block(1, "02/02/18", {amount:4}));
// console.log("Mining block 2...");
// myCoin.addBlock(new Block(2, "04/02/18", {amount:8}));

//console.log(JSON.stringify(myCoin, null, 4));

// console.log("Is this chain valid ? "+myCoin.isChianValid());

// myCoin.chain[1].data = { amount : 100 };
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
// myCoin.chain[1].previousHash = myCoin.chain[0].hash;

// console.log("Is this chain valid ? "+myCoin.isChianValid());








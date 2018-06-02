import { Ethereum } from "../../defined/eth";
import { RPCResponse } from "../../defined/rpc";
import Client from "../client";
import { EthereumMethods as mtd } from "./mtd";

export class EthereumClient extends Client {
  // go-ethereum client RPC settings has no user and password for rpc
  constructor(
    ip: string,
    port: number = 30303,
    user: string = "",
    pass: string = ""
  ) {
    super(user, pass, ip, port);
  }

  // get block count
  // return hex number
  public getBlockCount() {
    return this.RpcCall(mtd.block.count);
  }

  public getBlockByHash(hash: string, getFullTx: boolean = false) {
    const param: [string, boolean] = [hash, getFullTx];
    return this.RpcCall<Ethereum.IBlock>(mtd.block.byHash, param);
  }

  /**
   * Get information about a block by block number.
   * @param symbol QUANTITY|TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
   */
  public getBlock(symbol: string) {
    const param: [string, boolean] = [symbol, false];
    return this.RpcCall<Ethereum.IBlockSimple>(mtd.block.byHeight, param);
  }

  /**
   * alias getBlockByNumberVerbose
   * see flower
   */
  public getBlockVerbose(symbol: string) {
    const param: [string, boolean] = [symbol, true];
    return this.RpcCall<Ethereum.IBlockVerbose>(mtd.block.byHeight, param);
  }

  public getTxByHash(hash: string) {
    return this.RpcCall<Ethereum.ITransaction>(mtd.tx.byHash, [hash]);
  }

  /**
   * Returns the receipt of a transaction by transaction hash.
   * Note That the receipt is not available for pending transactions.
   * @param hash tx hash
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
   */
  public getTxReceipt(hash: string) {
    return this.RpcCall<Ethereum.ITxReceipt>(mtd.tx.receipt, [hash]);
  }

  public sendRawTx(raw: string) {
    return this.RpcCall(mtd.tx.sendRaw, [raw]);
  }

  /**
   * Creates new message call transaction or a contract creation, if the data field contains code.
   * from: DATA, 20 Bytes - The address the transaction is send from.
   * to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.
   * gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
   * gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas
   * value: QUANTITY - (optional) Integer of the value sent with this transaction
   * data: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see Ethereum Contract ABI
   * nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
   * @see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
   */
  public sendTx(tx: Ethereum.ISentTxStruct) {
    return this.RpcCall(mtd.tx.send, [tx]);
  }

  /**
   * Returns the number of transactions sent from an address.
   * alias for getTxCount
   */
  public getAddrNonce(address: string, status: Ethereum.Status = "latest") {
    const param: string[] = [address, status];
    return this.RpcCall(mtd.address.nonce, param);
  }

  /**
   * Returns the current price per gas in wei.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
   */
  public getCurrentGasPrice() {
    return this.RpcCall(mtd.gas.price, []);
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
   */
  public callFunc(
    param: Ethereum.ICallFuncParam,
    status: Ethereum.Status = "latest"
  ) {
    return this.RpcCall(mtd.tx.call, [param, status]);
  }

  /**
   * Returns code at a given address.
   * @param address DATA, 20 Bytes - address
   * @param status integer block number, or the string "latest", "earliest" or "pending"
   * @returns the code from the given address
   */
  public getCode(address: string, status: string) {
    return this.RpcCall(mtd.address.code);
  }

  /**
   * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
   * The transaction will not be added to the blockchain.
   * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
   * for a variety of reasons including EVM mechanics and node performance.
   */
  public getEstimateGas(
    param: Ethereum.ICallFuncParam,
    status: Ethereum.Status = "latest"
  ) {
    return this.RpcCall(mtd.gas.estimate, [param, status]);
  }

  /**
   * debug trace transaction
   * you should start geth with `--rpcapi="web3,trace"
   * @see https://github.com/ethereum/go-ethereum/wiki/Management-APIs#debug_tracetransaction
   */
  public traceTx(
    tx: string,
    opt?: {
      disableStorage?: boolean;
      disableMemory?: boolean;
      disableStack?: boolean;
      trace?: string;
      timeout?: string;
    }
  ) {
    return this.RpcCall<Ethereum.ITraceTxReturn>(mtd.debug.traceTx, [tx, opt]);
  }
}
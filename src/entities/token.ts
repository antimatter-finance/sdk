import invariant from 'tiny-invariant'
import {ChainId} from '../constants'
import {validateAndParseAddress} from '../utils'
import {Currency} from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
    public readonly chainId: ChainId
    public readonly address: string

    public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
        super(decimals, symbol, name)
        this.chainId = chainId
        this.address = validateAndParseAddress(address)
    }

    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    public equals(other: Token): boolean {
        // short circuit on reference equality
        if (this === other) {
            return true
        }
        return this.chainId === other.chainId && this.address === other.address
    }

    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    public sortsBefore(other: Token): boolean {
        invariant(this.chainId === other.chainId, 'CHAIN_IDS')
        invariant(this.address !== other.address, 'ADDRESSES')
        return this.address.toLowerCase() < other.address.toLowerCase()
    }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
    if (currencyA instanceof Token && currencyB instanceof Token) {
        return currencyA.equals(currencyB)
    } else if (currencyA instanceof Token) {
        return false
    } else if (currencyB instanceof Token) {
        return false
    } else {
        return currencyA === currencyB
    }
}

export const WETH: { [chainId in ChainId]: Token } = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped ETH'),
    [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped ETH'),
    [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped ETH'),
    [ChainId.BSC]: new Token(ChainId.BSC, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    [ChainId.AVALANCHE]: new Token(
        ChainId.AVALANCHE,
        '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        18,
        'WAVAX',
        'Wrapped AVAX'
    )
}

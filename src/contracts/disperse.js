// Disperse contract on BSC
// Source: https://github.com/banteg/disperse-research
// Verified on BscScan: https://bscscan.com/address/0xD152f549545093347A162Dce210e7293f1452150

export const DISPERSE_ADDRESS = '0xD152f549545093347A162Dce210e7293f1452150'

export const DISPERSE_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: 'token',
        type: 'address'
      },
      {
        name: 'recipients',
        type: 'address[]'
      },
      {
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'disperseToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'recipients',
        type: 'address[]'
      },
      {
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'disperseEther',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'token',
        type: 'address'
      },
      {
        name: 'recipients',
        type: 'address[]'
      },
      {
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'disperseTokenSimple',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

// ERC20 ABI for approval and balance checking
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
]

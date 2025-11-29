# BSC Toolkit

<div align="center">

![BSC Toolkit](public/apple-touch-icon.png)

**Professional Blockchain Utilities for BNB Chain**

Free, open-source tools for wallet generation, vanity addresses, batch transfers, and more.

[![Website](https://img.shields.io/badge/Website-bsc.cards-orange?style=flat-square)](https://bsc.cards/)
[![Twitter](https://img.shields.io/badge/Twitter-@BscCards-1DA1F2?style=flat-square&logo=twitter)](https://x.com/BscCards)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Website](https://bsc.cards/) · [Twitter/X](https://x.com/BscCards) · [Report Bug](https://github.com/BscCards/bsc-toolkit/issues) · [Request Feature](https://github.com/BscCards/bsc-toolkit/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [Batch Wallet Generator](#-batch-wallet-generator)
  - [Vanity Wallet Generator](#-vanity-wallet-generator)
  - [Contract Vanity Generator](#-contract-vanity-generator)
  - [QR Code Generator](#-qr-code-generator)
  - [Multi-Sender](#-multi-sender)
- [Security Notice](#️-security-notice)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#️-disclaimer)
- [Support](#-support)

---

## 🌟 Overview

**BSC Toolkit** is a comprehensive suite of blockchain utilities designed specifically for the **BNB Chain (BSC)** ecosystem. Built with modern web technologies and a focus on user privacy, all operations are performed **client-side** in your browser—no data is ever transmitted to external servers.

Whether you're a developer testing smart contracts, a blockchain enthusiast exploring vanity addresses, or someone who needs to send tokens to multiple recipients efficiently, BSC Toolkit provides the professional-grade tools you need, completely free and open source.

**Live Demo**: [https://tools.bsc.cards](https://tools.bsc.cards)
**Main Website**: [https://bsc.cards](https://bsc.cards/)
**Follow Us**: [Twitter/X @BscCards](https://x.com/BscCards)

---

## 🚀 Features

### 📦 Batch Wallet Generator

Generate multiple BNB Chain wallet addresses in bulk—perfect for testing, development, and airdrops.

**Key Features:**
- **Bulk Generation**: Create 1 to 10,000 wallets instantly
- **Export Options**: Download as CSV or JSON format
- **QR Code Support**: Generate QR codes for each wallet address
- **Clipboard Integration**: One-click copy for addresses and private keys
- **Local Processing**: All wallets generated client-side for maximum security

**Use Cases:**
- Testing smart contract interactions with multiple wallets
- Setting up test environments for dApps
- Generating addresses for airdrops or promotional campaigns
- Development and quality assurance workflows

---

### ✨ Vanity Wallet Generator

Create custom BNB Chain wallet addresses with your preferred prefix or suffix—make your wallet address memorable and unique.

**Key Features:**
- **Prefix Matching**: Generate addresses starting with your desired characters (after `0x`)
- **Suffix Matching**: Find addresses ending with specific patterns
- **Case Sensitivity**: Option for case-sensitive or case-insensitive matching
- **Real-time Statistics**: Monitor generation attempts and speed
- **Multi-result Support**: Continue searching to find multiple matching addresses
- **Export Results**: Save all found addresses to CSV/JSON

**Technical Details:**
- Uses high-performance cryptographic libraries (ethers.js)
- Leverages browser's native crypto APIs for random number generation
- Displays attempts per second and estimated time remaining
- Supports hexadecimal characters: `0-9` and `a-f` (case-insensitive by default)

**Example Patterns:**
- Prefix `888` → `0x888a1b2c3d4e...`
- Suffix `cafe` → `0x...1234cafe`
- Both → `0x888...cafe`

---

### 🏭 Contract Vanity Generator

Generate vanity addresses for smart contracts before deployment—predict and customize your contract's address with specific patterns.

**Key Features:**
- **Nonce Specification**: Target specific deployment transactions (0 = first contract, 1 = second, etc.)
- **Pattern Matching**: Customize both prefix and suffix of contract addresses
- **Wallet Discovery**: Find the deployment wallet needed to achieve the desired contract address
- **Performance Metrics**: Real-time speed tracking (addresses/second)
- **Time Tracking**: Monitor elapsed time during generation
- **Multiple Results**: Continue searching for different wallet options

**How It Works:**
1. Contract addresses are deterministically calculated from:
   - Deployer wallet address
   - Transaction nonce (deployment count from that wallet)
2. The tool generates random wallets and calculates the contract address for your specified nonce
3. When a match is found, you get both the deployment wallet and the predicted contract address
4. Deploy your contract from the found wallet at the specified nonce to get the vanity address

**Important Notes:**
- ⚠️ You must deploy exactly at the specified nonce (e.g., if nonce is 0, it must be the wallet's first transaction)
- ⚠️ Any transactions from the wallet before deployment will change the nonce and invalidate the prediction
- ⚠️ Generation time increases exponentially with pattern length and complexity

**Use Cases:**
- Creating memorable contract addresses for tokens
- Branding contracts with specific prefixes (e.g., `0xBEEF...`, `0xCAFE...`)
- Marketing and brand recognition
- Security (recognizable addresses help prevent phishing)

---

### 📱 QR Code Generator

Create scannable QR codes for BNB Chain addresses, payment links, and transaction data.

**Key Features:**
- **Flexible Input**: Support for addresses, URLs, payment requests, and plain text
- **Customizable Size**: Choose from 128px to 1024px dimensions
- **Error Correction**: Four levels of error correction (L, M, Q, H)
  - **Low (7%)**: Smallest QR codes, minimal redundancy
  - **Medium (15%)**: Balanced size and reliability
  - **Quality (25%)**: High reliability, recommended for most uses
  - **High (30%)**: Maximum damage resistance, larger codes
- **Export Formats**: Download as PNG or JPG
- **Real-time Preview**: Instant QR code generation as you type
- **Privacy-First**: QR codes generated entirely in your browser

**Use Cases:**
- Sharing wallet addresses for payments
- Creating payment requests with amounts
- Printing wallet addresses for cold storage
- Point-of-sale cryptocurrency payments
- Marketing materials and promotional campaigns

**Security Tips:**
- Never generate QR codes containing private keys on internet-connected devices
- Be cautious when scanning QR codes—always verify the address
- Use offline mode for sensitive operations

---

### 📤 Multi-Sender

Efficiently send BNB or ERC20 tokens to multiple addresses in a single transaction—save time and gas fees.

**Key Features:**
- **Batch Transfers**: Send to unlimited recipients in one transaction
- **Token Support**:
  - Native BNB transfers
  - Any ERC20/BEP20 token
- **Smart Contract Integration**: Uses battle-tested disperse contract
- **CSV Import/Export**: Bulk upload recipient lists
- **Data Validation**: Automatic validation of addresses and amounts
- **Duplicate Detection**: Identifies and handles duplicate addresses
- **Balance Checking**: Real-time balance display
- **Gas Estimation**: Preview total costs before sending
- **Batch Editing Tools**:
  - Set uniform amounts for all recipients
  - Multiply all amounts by a factor
  - Add/subtract fixed amounts
  - Randomize amounts within a range
- **Error Handling**: Clear error messages and validation
- **Transaction History**: Track sent batches

**How It Works:**
1. Connect your Web3 wallet (MetaMask, WalletConnect, etc.)
2. Choose token type (BNB or ERC20)
3. Enter or upload recipient addresses and amounts
4. Review and validate the list
5. Approve token spending (ERC20 only)
6. Send in a single batch transaction

**Smart Contract:**
- **Mainnet Address**: `0xD152f549545093347A162Dce210e7293f1452150`
- **Verified**: [View on BscScan](https://bscscan.com/address/0xD152f549545093347A162Dce210e7293f1452150)
- **Audit Status**: Community-audited, widely used disperse pattern
- **Gas Efficiency**: Significantly cheaper than individual transactions

**CSV Format:**
```csv
address,amount
0x1234567890123456789012345678901234567890,1.5
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,0.8
0x9876543210987654321098765432109876543210,2.0
```

**Use Cases:**
- Token airdrops to community members
- Salary payments to team members
- Dividend distributions to token holders
- Refunds or rebates to multiple users
- Marketing campaigns and bounty programs

---

## 🛡️ Security Notice

### ⚠️ **IMPORTANT: FOR TESTING PURPOSES PRIMARILY**

While this toolkit implements industry-standard cryptographic practices, please understand the security implications:

#### Client-Side Security
✅ **What We Do:**
- All cryptographic operations performed locally in your browser
- No data transmitted to external servers
- Private keys never leave your device
- Open-source code for full transparency
- No tracking, analytics, or data collection

⚠️ **What We Cannot Control:**
- Browser extensions that may monitor your activity
- Malware or keyloggers on your computer
- Network-level monitoring (use HTTPS always)
- Physical access to your device
- Browser vulnerabilities or exploits

#### Recommendations

**For Wallet Generation Tools** (Batch Wallet, Vanity Wallet, Contract Vanity):
- ✅ Recommended: Use for **testing and development** purposes
- ✅ Safe: Generate test wallets for dApp development
- ⚠️ Caution: Only use for production wallets if you:
  1. Download and run the tool **offline** (disconnect from internet)
  2. Use a clean, malware-free computer
  3. Never reuse the device for online activities with the private keys
  4. Immediately transfer private keys to a hardware wallet
- ❌ Not Recommended: Generating production wallets with significant funds on internet-connected devices

**For Multi-Sender Tool**:
- ✅ Safe for production use with proper precautions
- ✅ Test on BSC Testnet first
- ✅ Start with small amounts for first-time usage
- ✅ Verify all recipient addresses before confirming
- ⚠️ Transactions are irreversible once confirmed
- ⚠️ Ensure sufficient BNB for gas fees

**For QR Code Generator**:
- ✅ Safe for addresses and public information
- ❌ Never generate QR codes for private keys online
- ⚠️ Be aware of screenshot malware
- ⚠️ Verify QR codes before sharing or printing

#### Best Practices
1. **Offline Usage**: For maximum security with private keys, download the repository and run locally offline
2. **Hardware Wallets**: Transfer funds to hardware wallets for long-term storage
3. **Test Networks**: Always test on BSC Testnet before mainnet operations
4. **Verify**: Double-check all addresses and amounts before transactions
5. **Backups**: Securely backup private keys (encrypted, offline, multiple locations)
6. **Browser Hygiene**: Use a clean browser profile without extensions for sensitive operations

---

## 🛠️ Tech Stack

This project is built with modern, reliable technologies:

### Frontend Framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[Vue Router 4](https://router.vuejs.org/)** - Official routing solution for Vue.js
- **[Vite 5](https://vitejs.dev/)** - Next-generation frontend build tool for blazing-fast development

### Blockchain Integration
- **[ethers.js 6](https://docs.ethers.org/v6/)** - Complete Ethereum/BNB Chain library for wallet operations
- **[viem](https://viem.sh/)** - TypeScript interface for Ethereum with type safety
- **[@wagmi/vue](https://wagmi.sh/)** - Vue composables for Ethereum
- **[@reown/appkit](https://reown.com/)** - WalletConnect integration for multi-wallet support

### Utilities
- **[QRCode.js](https://github.com/davidshimjs/qrcodejs)** - QR code generation library
- **[html2canvas](https://html2canvas.hertzen.com/)** - HTML to canvas rendering for exports
- **[PapaParse](https://www.papaparse.com/)** - Fast CSV parser for bulk operations
- **[file-saver](https://github.com/eligrey/FileSaver.js/)** - File download utilities
- **[vue-sonner](https://vue-sonner.vercel.app/)** - Beautiful toast notifications

### Developer Tools
- **[ESLint](https://eslint.org/)** - Code linting with Vue plugin
- **[@vueuse/head](https://github.com/vueuse/head)** - Document head management for SEO

### Styling
- Modern CSS with CSS Variables for theming
- Responsive design for mobile, tablet, and desktop
- Clean, professional UI inspired by modern design systems

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher (or **yarn** 1.22.x+)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/BscCards/bsc-toolkit.git
cd bsc-toolkit
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** (Optional, for Multi-Sender wallet features)

```bash
cp .env.example .env
```

Edit `.env` and add your WalletConnect Project ID (get one free at [Reown Cloud](https://cloud.reown.com)):

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory, ready to deploy to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Environment Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
# WalletConnect / Reown Project ID (required for Multi-Sender)
# Get yours at: https://cloud.reown.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Note**: The toolkit will work without a WalletConnect Project ID, but the Multi-Sender feature will have limited wallet connection options. Creating a Project ID is free and takes 2 minutes.

### Running Offline (Maximum Security)

For **maximum security** when generating wallets with private keys:

1. Clone and set up the project on an **internet-connected** computer
2. Build the production version: `npm run build`
3. Copy the `dist/` folder to a **USB drive**
4. Transfer to an **air-gapped** computer (never connected to internet)
5. Serve locally:
   ```bash
   # Using Python 3
   cd dist
   python3 -m http.server 8000

   # Or using Node.js
   npx serve dist
   ```
6. Open `http://localhost:8000` in a clean browser
7. Generate wallets completely offline
8. Securely backup private keys (paper, encrypted USB, etc.)
9. **Wipe** the computer or browser data before going back online

---

## 📚 Usage

### Internationalization

The toolkit supports **English** and **Chinese** (中文). Switch languages using the language selector in the sidebar.

### Batch Wallet Generator

1. Navigate to **Batch Wallet Generator**
2. Enter desired wallet count (1-10,000)
3. Click **Generate Wallets**
4. Download results as CSV or JSON
5. **Important**: Securely store or delete the generated private keys

### Vanity Wallet Generator

1. Navigate to **Vanity Wallet Generator**
2. Enter desired prefix (after `0x`) or suffix
3. Toggle case sensitivity if needed
4. Click **Start Generating**
5. Wait for matches (time varies by pattern difficulty)
6. Export found addresses when satisfied
7. Click **Stop** when done

**Tip**: Shorter patterns are exponentially faster. Each additional character multiplies search time by ~16.

### Contract Vanity Generator

1. Navigate to **Contract Vanity Generator**
2. Enter desired contract address prefix/suffix
3. Specify deployment nonce (0 for first contract, 1 for second, etc.)
4. Click **Start Generating**
5. When a match is found:
   - Note the **Wallet Address** (deployer)
   - Note the **Contract Address** (predicted)
   - Fund the wallet address
   - Deploy your contract **at exactly the specified nonce**

**Critical**: The wallet must have exactly the specified nonce when deploying. Any other transaction will invalidate the vanity address.

### QR Code Generator

1. Navigate to **QR Code Generator**
2. Enter content (address, URL, text)
3. Adjust size and error correction level
4. QR code generates automatically
5. Click **Download** to save as PNG/JPG

### Multi-Sender

1. Navigate to **Multi-Sender**
2. Click **Connect Wallet** and connect Web3 wallet
3. Choose token type:
   - **BNB**: For native BNB transfers
   - **ERC20**: For token transfers (enter contract address)
4. Enter recipient list:
   - Type manually (format: `address,amount`)
   - Upload CSV file
   - Use batch editing tools
5. Review summary and validate addresses
6. For ERC20: Click **Approve Token** first
7. Click **Send** to execute batch transaction
8. Confirm in your wallet

**Gas Optimization Tip**: Batch sizes of 100-200 recipients typically offer the best gas efficiency.

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or translations, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run linting**
   ```bash
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (ESLint configuration)
- Write clear commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

### Feature Requests & Bug Reports

Found a bug or have an idea for a new tool? Please [open an issue](https://github.com/BscCards/bsc-toolkit/issues) with:
- Clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Sublicense

Under the condition that you include the original copyright and license notice.

---

## ⚠️ Disclaimer

**IMPORTANT - PLEASE READ CAREFULLY**

This toolkit is provided **"as is"** without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.

### No Liability

The developers and contributors of BSC Toolkit shall not be held liable for:
- Any loss of funds or assets
- Security breaches resulting from improper use
- Errors or bugs in the software
- Consequences of using generated wallets or addresses in production
- Gas fees, failed transactions, or blockchain-related costs
- Any direct, indirect, incidental, or consequential damages

### User Responsibility

By using this toolkit, you acknowledge and agree that:
- ✅ You are solely responsible for securing private keys and wallet addresses
- ✅ You understand the risks of generating wallets on internet-connected devices
- ✅ You will verify all addresses and amounts before sending transactions
- ✅ You will test on testnets before using on mainnet
- ✅ You understand that blockchain transactions are irreversible
- ✅ You will not hold the developers liable for any losses

### Testing Notice

This toolkit is designed primarily for **development and testing purposes**. While it can be used for production with proper security measures (offline generation, hardware wallet transfers, etc.), users must understand and accept all associated risks.

### Not Financial Advice

Nothing in this toolkit or documentation constitutes financial, investment, legal, or tax advice. Consult with qualified professionals before making any financial decisions.

---

## 💬 Support

### Get Help

- **Documentation**: Read this README and inline help text
- **Issues**: [GitHub Issues](https://github.com/BscCards/bsc-toolkit/issues)
- **Community**: [Twitter/X @BscCards](https://x.com/BscCards)
- **Website**: [https://bsc.cards](https://bsc.cards/)

### Stay Updated

- 🌐 Website: [https://bsc.cards](https://bsc.cards/)
- 🐦 Twitter/X: [@BscCards](https://x.com/BscCards)
- 💻 GitHub: [BscCards/bsc-toolkit](https://github.com/BscCards/bsc-toolkit)

### Spread the Word

If you find BSC Toolkit useful, please:
- ⭐ Star this repository
- 🐦 Follow us on [Twitter/X](https://x.com/BscCards)
- 📢 Share with your developer community
- 🔗 Link to [bsc.cards](https://bsc.cards/) from your projects

---

## 🙏 Acknowledgments

Special thanks to:
- The **BNB Chain** team for building a robust EVM-compatible blockchain
- The **ethers.js** team for the excellent Web3 library
- The **Vue.js** community for the amazing framework
- All open-source contributors whose libraries power this toolkit
- The blockchain community for feedback and testing

---

<div align="center">

**Built with ❤️ for the BNB Chain community**

[Website](https://bsc.cards/) · [Twitter/X](https://x.com/BscCards) · [GitHub](https://github.com/BscCards/bsc-toolkit)

⭐ **Star us on GitHub** if you find this toolkit useful!

</div>

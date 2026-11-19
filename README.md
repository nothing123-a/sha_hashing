# SHA-256 Cryptographic Hash Simulator

An interactive, educational laboratory to visualize, explore, and master the inner workings of the **SHA-256 (Secure Hash Algorithm 256-bit)** cryptographic hash function. Built with **React**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

### 1. Interactive 5-Stage Processing Pipeline
- **Stage 1: Binary Conversion** — Displays UTF-8 encoding and 8-bit binary representation of each character.
- **Stage 2: Message Padding** — Visualizes the padding scheme: appending bit `1` (`0x80`), zero padding, and the 64-bit message length field.
- **Stage 3: Message Schedule Expansion** — Interactive 64-word grid ($W_0$ to $W_{63}$) displaying exact derivation math ($\sigma_0$, $\sigma_1$).
- **Stage 4: 64 Compression Rounds** — Step-by-step round inspection tracking working variables ($a$ through $h$), temporary words $T_1$, $T_2$, constants $K_t$, and round functions ($Ch$, $Maj$, $\Sigma_0$, $\Sigma_1$).
- **Stage 5: Final Hash Accumulation** — Demonstrates addition mod $2^{32}$ into initial hash values ($H_0$ to $H_7$) and concatenation into the 256-bit digest.

### 2. Avalanche Effect Demonstration
- Side-by-side comparison of two messages.
- Real-time bit-level difference map highlighting changes across all 256 output bits.
- Exact percentage and count of altered bits illustrating diffusion and cryptographic avalanche.

### 3. Full 64-Round Interactive Table
- Complete tabular breakdown of all 64 compression iterations.
- Animated state transitions showing how values shift and transform round-by-round.

### 4. Mathematical Operations Guide
- Clear, beginner-friendly explanations with truth tables and examples for:
  - Bitwise operations ($XOR$, $AND$, $NOT$)
  - Bit rotations ($ROTR$) and logical shifts ($SHR$)
  - Choice ($Ch$) and Majority ($Maj$) functions
  - Sigma functions ($\Sigma_0, \Sigma_1, \sigma_0, \sigma_1$)
  - Addition modulo $2^{32}$

### 5. Learning Mode
- **Algorithm Walkthrough**: Illustrated step-by-step guide explaining the SHA-256 specification.
- **Interactive Quiz**: Knowledge checks covering rounds, block sizes, and cryptographic properties.
- **Cryptographic Glossary**: Searchable definitions of core concepts (preimage resistance, collision resistance, Merkle–Damgård construction, etc.).

### 6. Technical Integrity
- **Real SHA-256 implementation**: Pure JavaScript implementation exposing every intermediate calculation.
- **Verified Accuracy**: Validated in real-time against the browser's native **Web Crypto API** (`crypto.subtle.digest`).
- **NIST Test Vectors**: Complies with official test vectors including edge cases (empty strings, single-block, multi-block boundary messages).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nothing123-a/sha256-simulator.git
   cd sha256-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📜 License

MIT License. Designed for students, educators, and cybersecurity enthusiasts.

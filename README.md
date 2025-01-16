# LGBT-dapp
<img src="img/logo.svg" align="right" width="80px">
面向LGBTQ+群体的去中心化社交应用（目前只提供中文版本） Decentralized App for LGBTQ+ Community




# 开发目标
对于LGBTQ+群体尤其是来自中国的群体面临着隐私泄露的风险，为此我们开发一个去中心化的社交应用用于100%隐私保护的社交。


<h1 align="left">产品Demo</h1>


<img src="img/Demo1.png" align="center">

面向 LGBTQ+ 社区的去中心化社交演示应用（中文）。

产品 Demo： https://lgbt-dapp.github.io/LGBT-dapp/ （可用 MetaMask 等钱包试用）

PC端安装包(v1.0.0)也以发布，详见release.

为什么做这个项目
------------------

- 提高言论与表达空间的自治性，减少中心化平台干预风险；
- 提供教育示例，帮助开发者理解链上/链下结合的社交应用架构；
- 为社区提供一个开源的、可扩展的实验平台。

主要特性
--------

- 钱包登录（MetaMask 等）
- 发帖与内容发现（CreatePost / Discover）
- 个人页与资料（Profile）
- 聊天演示（Chat）
- 智能合约：见 `contracts/SocialProtocol.sol`

技术栈简述
------------

- 前端：React + Vite + Tailwind CSS
- 区块链：Hardhat + ethers
- 状态管理与网络：zustand、react-query
- 其它：react-router、sonner、recharts 等（详见 `package.json`）

仓库结构
------------------

```text
.
├─ contracts/
│  └─ SocialProtocol.sol
├─ scripts/
│  └─ deploy.js
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ index.css
│  ├─ lib/
│  │  ├─ contractConfig.js
│  │  └─ socialContract.js
│  ├─ pages/
│  │  ├─ HomePage.jsx
│  │  ├─ DiscoverPage.jsx
│  │  ├─ ProfilePage.jsx
│  │  ├─ ChatPage.jsx
│  │  └─ CreatePost.jsx
│  └─ components/
├─ hardhat.config.js
├─ package.json
├─ README.md
└─ DEPLOY_GITHUB_PAGES.md
```

快速开始
----------

先决条件

- Node.js（推荐 v18+）
- npm 或 pnpm

安装与本地运行

```bash
git clone https://github.com/LGBT-dapp/LGBT-dapp.git
cd LGBT-dapp
npm install
npm run dev
```

合约本地开发与部署（示例）

1. 启动本地 Hardhat 节点：

```bash
npx hardhat node
```

2. 编译并部署合约到本地节点：

```bash
npm run compile-contracts
npm run deploy-contracts
```

生产构建与预览

```bash
npm run build
npm run preview
```

环境变量示例
----------------

在项目根目录创建 `.env` 或 `.env.local`：

```text
PRIVATE_KEY=your_private_key_here
RPC_URL=https://your-rpc-provider
```

注意：切勿将真实私钥提交到仓库或公开渠道。

常用脚本
---------

- `npm run dev` — 启动开发服务器
- `npm run build` — 生成生产包
- `npm run preview` — 预览生产包
- `npm run compile-contracts` — 编译合约
- `npm run deploy-contracts` — 部署合约（默认 `--network localhost`）

开发建议
---------

- 使用 `npx hardhat node` 联调合约并在前端连接本地节点；
- 优先复用 `src/lib/socialContract.js` 中对合约的封装；
- 提交前运行 `npm run lint` 并确保构建通过；
- 对敏感数据采用链下存储（IPFS、加密存储）并在链上记录索引/哈希。

代码说明与开发示例
-------------------

下面给出主要合约与前端交互的说明，以及若干开发示例，便于你快速上手扩展功能。

1) 智能合约（`contracts/SocialProtocol.sol`）概览

```text
// 关键结构：
// Post { id, author, cid, timestamp }
// 功能：setEncryptionPublicKey / createPost / getPost / getEncryptedKey / totalPosts
```

- `setEncryptionPublicKey(bytes publicKey)`：用户上链登记自己的加密公钥，便于私聊或加密内容的对称密钥分发。
- `createPost(string cid, address[] recipients, bytes[] encryptedKeysForRecipients)`：创建帖子并为指定收件人存储每人对应的被加密对称密钥（密钥存储在合约映射中）；`cid` 可为 IPFS CID 或其它内容标识符。
- `getPost(uint256 id)` / `totalPosts()`：用于浏览帖子与分页查询。
- `getEncryptedKey(uint256 id, address recipient)`：获取给定接收者的加密对称密钥以便在前端解密显示私有内容。

2) 前端合约封装（`src/lib/socialContract.js`）

该文件使用 `ethers`（浏览器 provider）封装了常用方法：

- `getContract(signerRequired)`：返回合约实例（带 signer 或只读 provider）。
- `setEncryptionPublicKeyOnChain(publicKey)`：上链设置公钥。
- `createPostOnChain(cid, recipients, encryptedKeys)`：提交帖子交易。
- `getPostOnChain(id)` / `totalPosts()`：读取帖子数据。

示例：在 React 页面里创建帖子（伪代码）

```jsx
import { createPostOnChain } from '../lib/socialContract';

async function handleCreatePost(content) {
	// 1) 上传内容到 IPFS（或自定义存储），得到 cid
	const cid = await uploadToIPFS(content); // 需实现 uploadToIPFS

	// 2) 计算给定接收者的加密对称密钥（这里为示例）
	const recipients = [recipientAddress1, recipientAddress2];
	const encryptedKeys = recipients.map(r => encryptSymmetricKeyFor(r, symmetricKey));

	// 3) 在链上创建帖子
	const tx = await createPostOnChain(cid, recipients, encryptedKeys);
	await tx.wait();
}
```

注意：`uploadToIPFS`、`encryptSymmetricKeyFor` 需在前端实现（使用 `ipfs` 客户端或第三方 API；对称密钥加密可用 `@metamask/eth-sig-util` 或 SubtleCrypto）。

3) 组件开发示例（`src/components/PostCard.jsx`）

```jsx
import React from 'react';

export default function PostCard({ post }) {
	return (
		<article className="p-4 border rounded-md shadow-sm">
			<header className="flex items-center gap-3">
				<div className="font-medium">{post.author}</div>
				<time className="text-xs text-muted-foreground">{new Date(post.timestamp * 1000).toLocaleString()}</time>
			</header>
			<div className="mt-2 text-sm">CID: {post.cid}</div>
		</article>
	);
}
```

该组件遵循项目 `ui` 风格，你可以将其放在 `src/components/` 并在页面中按需引入。

4) 配置示例（`hardhat.config.js` 扩展与 `.env`）

示例：在 `hardhat.config.js` 中加入测试网配置（需在 `.env` 中设置变量）：

```js
import "@nomicfoundation/hardhat-toolbox";
import { config as loadEnv } from 'dotenv';
loadEnv();

export default {
	solidity: '0.8.17',
	networks: {
		hardhat: {},
		linea: {
			url: process.env.RPC_URL,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
		}
	}
}
```

并在项目根创建 `.env`（或 `.env.example`）：

```text
RPC_URL=https://your-rpc.example
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FOR_DEPLOY
```

5) 常见开发流程示例

- 本地合约测试：`npx hardhat test`
- 本地节点：`npx hardhat node`，并在另一个终端 `npm run deploy-contracts`
- 前端连接：在 `src/lib/contractConfig.js` 修改 `SOCIAL_CONTRACT_ADDRESS` 为本地部署地址或测试网地址

部署说明
---------

要将站点发布到 GitHub Pages，请参阅： `DEPLOY_GITHUB_PAGES.md`

License
-------

All Rights Reserved.

Contributors
-------


<div align="center">
	<h4 align="center">The core contributors are the cornerstone of the project.</h4>
	<a href="https://github.com/YuzeHao2023" target="_blank">
		<img src="https://github.com/YuzeHao2023.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="YuzeHao2023" />
	</a>
	<a href="https://github.com/dvlan26" target="_blank">
		<img src="https://github.com/dvlan26.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="dvlan26" />
	</a>
	<a href="https://github.com/halamji" target="_blank">
		<img src="https://github.com/halamji.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="halamji" />
	</a>
	<a href="https://github.com/yzhao112" target="_blank">
		<img src="https://github.com/yzhao112.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="yzhao112" />
	</a>
	<a href="https://github.com/Vtwonine" target="_blank">
		<img src="https://github.com/Vtwonine.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="Vtwonine" />
	</a>
	<a href="https://github.com/jillhuang69" target="_blank">
		<img src="https://github.com/jillhuang69.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="jillhuang69" />
	</a>
	<a href="https://github.com/huangxinyue8616" target="_blank">
		<img src="https://github.com/huangxinyue8616.png" width="100" height="100" style="border-radius: 50%; margin: 0 10px; object-fit: cover;" alt="huangxinyue8616" />
	</a>
</div>



改进性能: 2025-01-04 20:00

更新文档: 2025-01-04 20:01

添加测试: 2025-01-05 20:00

更新文档: 2025-01-05 20:01

重构代码: 2025-01-05 20:02

更新文档: 2025-01-05 20:03

添加测试: 2025-01-06 20:00

添加新功能: 2025-01-06 20:01

更新配置: 2025-01-06 20:02

更新文档: 2025-01-06 20:03

添加测试: 2025-01-06 20:04

代码优化: 2025-01-07 20:00

修复小问题: 2025-01-07 20:01

重构代码: 2025-01-07 20:02

重构代码: 2025-01-07 20:03

更新文档: 2025-01-07 20:04

添加测试: 2025-01-08 20:00

改进性能: 2025-01-09 20:00

添加新功能: 2025-01-09 20:01

修复小问题: 2025-01-09 20:02

修复bug: 2025-01-09 20:03

改进性能: 2025-01-09 20:04

添加新功能: 2025-01-10 20:00

添加测试: 2025-01-10 20:01

修复小问题: 2025-01-10 20:02

代码优化: 2025-01-10 20:03

重构代码: 2025-01-11 20:00

重构代码: 2025-01-12 20:00

修复小问题: 2025-01-12 20:01

改进性能: 2025-01-12 20:02

修复bug: 2025-01-13 20:00

修复bug: 2025-01-13 20:01

添加新功能: 2025-01-13 20:02

重构代码: 2025-01-14 20:00

更新配置: 2025-01-14 20:01

修复小问题: 2025-01-14 20:02

更新依赖: 2025-01-14 20:03

更新文档: 2025-01-14 20:04

添加新功能: 2025-01-15 20:00

添加新功能: 2025-01-15 20:01

改进性能: 2025-01-16 20:00


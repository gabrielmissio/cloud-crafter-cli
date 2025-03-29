# SAM HTTP Express

## Pre-Requisites

 - [Make](https://www.gnu.org/software/make/manual/make.html)
 - [Docker](https://www.docker.com/)
 - [Node.js](https://nodejs.org/en)
 - [AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-install.html)
 - [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

## Requests

### Get new address

```bash
curl --location 'http://localhost:3000/new-address'
```

### Generate unsigned tx

```bash
curl --location 'http://localhost:3000/generate-tx' \
--header 'Content-Type: application/json' \
--data '{
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "to": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "amount": "0.1"
}'
```

### Generate signed tx

> ⚠️ **Warning:** This is a known private key used for development with Hardhat. </br>
> Any ETH or tokens sent to this address on a public network **will be stolen**. </br>
> Use only in local or test environments.

```bash
curl --location 'http://localhost:3000/generate-tx' \
--header 'Content-Type: application/json' \
--data '{
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "to": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "amount": "0.1",
    "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}'
```

## 🛠️ Troubleshooting: Connecting to Local Hardhat Node from `npm start` or `sam local start-api`

When running a local Hardhat node (e.g., `npx hardhat node`) and testing your Lambda with `sam local start-api`, you may run into networking issues where the Lambda **cannot connect to your Hardhat node** on `localhost:8545`.

This happens because the Lambda runs inside a Docker container, and inside Docker, `localhost` refers to the container itself — not your host machine.

---

### 🧩 Overriding default `JsonRPCUrl`

This project uses a SAM template parameter called `JsonRPCUrl` to inject the EVM JSON-RPC endpoint into the Lambda function as an environment variable.

You can override the default value in two ways during local development:

#### Option 1 – Using `npm` (e.g., with a `start` script)

```bash
npm run start -- --parameter-overrides ParameterKey=JsonRPCUrl,ParameterValue=http://host.docker.internal:8545
```

#### Option 2 – Using `sam` directly

```bash
sam local start-api --parameter-overrides ParameterKey=JsonRPCUrl,ParameterValue=http://host.docker.internal:8545
```

This allows you to customize the RPC URL per environment (Linux, macOS, CI, etc.) without modifying the source code.

---

### 🔧 Solution by Platform

#### ✅ macOS & Windows

Docker supports the special hostname `host.docker.internal` by default.

Use this as your RPC URL:

```bash
http://host.docker.internal:8545
```

#### 🐧 Linux (Ubuntu, etc.)

Docker on Linux does **not** support `host.docker.internal` by default. Use the Docker bridge network IP instead:

1. Use the default Docker bridge IP (`172.17.0.1`), or find it using:

   ```bash
   ip addr show docker0
   ```

2. Expose your Hardhat node on all interfaces::

   ```bash
   npx hardhat node --hostname 0.0.0.0
   ```

3. Then use this RPC URL:

   ```bash
   http://172.17.0.1:8545
   ```
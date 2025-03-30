## 🧪 Performance Benchmark: Bundled vs Unbundled Lambda with `ethers.js`

This proof of concept (PoC) compares **three different AWS Lambda packaging strategies** for a function that uses `ethers.js` to generate Ethereum addresses and transactions:

- `unbundled`: raw source code + full `node_modules`
- `bundled`: code bundled via `esbuild` (no minification)
- `bundled-minified`: bundled and minified via `esbuild`

Each version received **50,500 real invocations** using JMeter, hitting the deployed Lambda via API Gateway. Metrics were collected using **CloudWatch Logs Insights** and **Lambda Insights**.

---

### 📊 Metrics Explained

| Metric             | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `avgDuration`      | The **average time (in milliseconds)** the Lambda function took to execute  |
| `maxDuration`      | The **single slowest** invocation observed                                  |
| `minDuration`      | The **fastest** invocation observed                                         |
| `p95`              | **95th percentile latency** — 95% of invocations were faster than this      |
| `p99`              | **99th percentile latency** — 99% of invocations were faster than this      |
| `avgMemory`        | Average memory (in MB) consumed per invocation                              |
| `totalInvocations` | Total number of requests sent during the benchmark                          |

---

### ✅ Results Summary

| Packaging           | avgDuration (ms) | p95 (ms) | p99 (ms) | maxDuration (ms) | avgMemory (MB) | totalInvocations |
|---------------------|------------------|----------|----------|------------------|----------------|------------------|
| **Bundled**         | ✅ **242.68**     | 330.57   | 516.48   | 3268             | 98.56          | 50,500           |
| **Bundled-Minified**| 244.13           | 330.57   | 512.38   | 3275             | 98.33          | 50,500           |
| **Unbundled**       | 248.13           | ❌ **349.54** | ❌ **620.37** | 3015             | ✅ **95.84**      | 50,500           |

---

### 🔍 Analysis

- **Cold starts** were not a major factor during sustained traffic (50k+ requests).
- The **bundled version** had the **lowest average execution time** and the **most consistent latency**:
  - Lower `p95` and `p99` values (tail latency)
  - Tighter performance under load
- The **unbundled version** used less memory but had:
  - Slightly higher average execution time
  - Higher latency outliers (p95 and p99)

---

### ✅ Conclusion

> **Bundling with `esbuild` improved latency consistency and overall execution time** for this function.  
> While the unbundled version had lower memory usage, the bundled variant offered **more predictable performance**, which is important for production APIs and user experience.

> ⚠️ These results are **specific to this use case** (using `ethers.js` to generate Ethereum addresses and unsigned transactions). It's recommended to perform similar benchmarks for each Lambda function depending on size, dependencies, and workload behavior.

---

### ❓ Why Could `maxDuration` Be Lower for Unbundled?

While the **unbundled function** had worse `avgDuration` and tail latencies (`p95`, `p99`), its **`maxDuration` was slightly lower** than the others. This might be due to:

- **Random chance**: one very fast outlier during a cold start or GC cycle
- **Shorter initialization path** in certain executions, depending on how Node.js loads unbundled modules
- **Lambda container reuse edge case**, where one unbundled execution happened to hit a freshly reused environment with a warm V8 engine and preloaded libraries

In large datasets, `maxDuration` is typically **less representative** than `p95` or `p99`, which are better indicators of "worst-case consistent latency."

---

# flist.jjaw.cn

一个基于 VuePress 2 的文件索引站点。  
站点会从多个数据源（如 GitHub/Gitee Release、仓库目录、HuggingFace 数据集等）抓取文件信息并生成可浏览、可下载的页面。

## 特性

- 基于 VuePress 静态生成，部署简单
- 支持多种数据源驱动（GitHub/Gitee/HuggingFace/自定义 URL 树）
- 支持下载代理（Cloudflare Pages / Vercel / Netlify）
- 支持“目录化配置”：新增 `mounts/*.json` 即可扩展挂载，不再修改主配置文件

## 环境要求

- Node.js 18+
- pnpm

## 快速开始

```bash
pnpm install
pnpm dev
```

构建：

```bash
pnpm build
```

## 配置方式（推荐）

主配置已改为自动读取 `mounts` 目录：

```ts
theme: FileList()
```

你只需要新增 JSON 文件即可。

### 路径到挂载路径规则

- `mounts/index.json` → `/`
- `mounts/软件/KnapsackToGo4.json` → `/软件/KnapsackToGo4`
- `mounts/工具/index.json` → `/工具`

也可以在 JSON 里显式写 `mountPath` 覆盖默认推导。

## JSON 配置格式

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "jianjianai",
			"repository": "KnapsackToGo4"
		}
	},
	"downProxy": {
		"type": "cloudflarePagesDownProxy"
	}
}
```

字段说明：

- `mountPath`：可选，手动指定挂载路径
- `analysis`：必填，数据源驱动
	- `type`：驱动名称
	- `options`：驱动参数（与对应函数参数一致）
- `downProxy`：可选，下载代理
	- `type`：代理名称
	- 可省略；也可以写成 `{}`（表示不启用代理）

### 从环境变量读取配置

配置值支持对象写法：

```json
{
	"$env": "ENV_NAME",
	"default": "可选默认值",
	"required": false
}
```

说明：

- `$env`：环境变量名（必填）
- `default`：未设置环境变量时使用（可选）
- `required`：若为 `true` 且环境变量未设置会抛错（可选，默认 `false`）

示例（给 `authorizationToken` 读环境变量）：

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "nilaoda",
			"repository": "BBDown",
			"authorizationToken": {
				"$env": "GITHUB_TOKEN"
			}
		}
	}
}
```

## analysis 用法总览

下面是每个 `analysis.type` 的用途、参数和示例。

### 1) `githubReleasesFilesAnalysis`

用途：读取 GitHub 仓库 Releases 资产文件。

参数：

- `user`: GitHub 用户名或组织名（必填）
- `repository`: 仓库名（必填）
- `authorizationToken`: GitHub Token（可选，建议配置以避免限流）

示例：

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "jianjianai",
			"repository": "KnapsackToGo4"
		}
	}
}
```

### 2) `giteeReleasesFilesAnalysis`

用途：读取 Gitee 仓库 Releases 资产文件。

参数：

- `user`: Gitee 用户名或组织名（必填）
- `repository`: 仓库名（必填）
- `direction`: 排序方向，`desc`/`asc`（可选）
- `access_token`: Gitee Token（可选）
- `page`: 页码（可选）
- `per_page`: 每页数量（可选）

示例：

```json
{
	"analysis": {
		"type": "giteeReleasesFilesAnalysis",
		"options": {
			"user": "your-name",
			"repository": "your-repo",
			"direction": "desc"
		}
	}
}
```

### 3) `githubReposAnalysis`

用途：读取 GitHub 仓库目录（可递归）。

参数：

- `user`: GitHub 用户名或组织名（必填）
- `repository`: 仓库名（必填）
- `rootPath`: 仓库内起始目录（可选）
- `authorizationToken`: GitHub Token（可选）
- `ref`: 分支/标签/提交（可选）
- `maxDeep`: 最大递归深度（可选，默认 10）
- `hideReadme`: 是否隐藏 README 文件（可选）

示例：

```json
{
	"analysis": {
		"type": "githubReposAnalysis",
		"options": {
			"user": "your-name",
			"repository": "your-repo",
			"rootPath": "dist",
			"ref": "main",
			"maxDeep": 5
		}
	}
}
```

### 4) `giteeReposAnalysis`

用途：读取 Gitee 仓库目录（可递归）。

参数：

- `user`: Gitee 用户名或组织名（必填）
- `repository`: 仓库名（必填）
- `rootPath`: 仓库内起始目录（可选）
- `ref`: 分支/标签/提交（可选）
- `access_token`: Gitee Token（可选）
- `maxDeep`: 最大递归深度（可选，默认 10）
- `hideReadme`: 是否隐藏 README 文件（可选）

示例：

```json
{
	"analysis": {
		"type": "giteeReposAnalysis",
		"options": {
			"user": "your-name",
			"repository": "your-repo",
			"rootPath": "files",
			"ref": "master"
		}
	}
}
```

### 5) `huggingFaceDatasetsAnalysis`

用途：读取 HuggingFace Datasets 文件树。

参数：

- `userName`: 用户名或组织名（必填）
- `datasetsName`: 数据集名（必填）
- `branchName`: 分支名（必填）
- `path`: 起始目录（可选）
- `maxDeep`: 最大递归深度（可选，默认 10）
- `hideReadme`: 是否隐藏 README 文件（可选）

示例：

```json
{
	"analysis": {
		"type": "huggingFaceDatasetsAnalysis",
		"options": {
			"userName": "your-name",
			"datasetsName": "your-dataset",
			"branchName": "main",
			"path": "assets",
			"maxDeep": 3
		}
	}
}
```

### 6) `fileUrlTreeAnalysis`

用途：手动指定“路径 -> 文件下载 URL”映射，适合自定义静态文件列表。

参数：

- `options` 本身就是一个对象，键为文件路径，值为下载链接

示例：

```json
{
	"analysis": {
		"type": "fileUrlTreeAnalysis",
		"options": {
			"工具/示例.txt": "https://example.com/demo.txt",
			"软件/app.zip": "https://example.com/app.zip"
		}
	}
}
```

## 支持的 downProxy.type

- `cloudflarePagesDownProxy`
- `vercelDownProxy`
- `netlifyDownProxy`

## 示例

### 1) GitHub Release 挂载到 `/软件/KnapsackToGo4`

文件：`mounts/软件/KnapsackToGo4.json`

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "jianjianai",
			"repository": "KnapsackToGo4"
		}
	},
	"downProxy": {
		"type": "cloudflarePagesDownProxy"
	}
}
```

### 2) 根路径挂载 `/`

文件：`mounts/index.json`

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "jianjianai",
			"repository": "my-flist-files"
		}
	},
	"downProxy": {
		"type": "cloudflarePagesDownProxy"
	}
}
```

### 3) 不启用下载代理

```json
{
	"analysis": {
		"type": "githubReleasesFilesAnalysis",
		"options": {
			"user": "jianjianai",
			"repository": "my-flist-files"
		}
	}
}
```

## 目录结构（关键部分）

```text
mounts/                     # 目录化挂载配置
	index.json                # /
	软件/
		KnapsackToGo4.json      # /软件/KnapsackToGo4
```

## 维护建议

- 新增站点资源时，优先通过 `mounts/*.json` 添加
- 尽量保持一个文件只定义一个挂载点，便于维护与审查
- 配置变更后执行 `pnpm build` 验证

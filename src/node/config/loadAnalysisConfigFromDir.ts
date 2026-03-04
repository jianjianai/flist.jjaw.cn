import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, resolve, sep } from "path";
import { Analysis, AnalysisConfig, DownProxy } from "../base/AllAnalysis.js";
import { analysisFactoryMap } from "./analysisFactoryMap.js";
import { downProxyFactoryMap } from "./downProxyFactoryMap.js";

type AnalysisJson = {
  type: keyof typeof analysisFactoryMap;
  options: any;
};

type DownProxyJson = {
  type?: keyof typeof downProxyFactoryMap;
  options?: any;
};

type MountConfigJson = {
  mountPath?: string;
  analysis: AnalysisJson;
  downProxy?: DownProxyJson;
};

type EnvValueRef = {
  $env: string;
  default?: any;
  required?: boolean;
};

function isEnvValueRef(value: any): value is EnvValueRef {
  return !!value && typeof value === "object" && typeof value.$env === "string";
}

function resolveEnvValue(ref: EnvValueRef, filePath: string): any {
  const envValue = process.env[ref.$env];
  if (envValue !== undefined && envValue !== "") {
    return envValue;
  }
  if (Object.prototype.hasOwnProperty.call(ref, "default")) {
    return ref.default;
  }
  if (ref.required) {
    throw new Error(`环境变量未设置: ${ref.$env}，文件: ${filePath}`);
  }
  return undefined;
}

function resolveEnvInJson(value: any, filePath: string): any {
  if (Array.isArray(value)) {
    return value.map((item) => resolveEnvInJson(item, filePath));
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (isEnvValueRef(value)) {
    return resolveEnvValue(value, filePath);
  }
  const result: Record<string, any> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = resolveEnvInJson(item, filePath);
  }
  return result;
}

function toPosixPath(value: string): string {
  return value.split(sep).join("/");
}

function getMountPathByFilePath(configDir: string, filePath: string): string {
  const relativePath = toPosixPath(relative(configDir, filePath));
  const noExt = relativePath.replace(/\.json$/i, "");
  const pathArray = noExt.split("/").filter(Boolean);
  if (pathArray[pathArray.length - 1] === "index") {
    pathArray.pop();
  }
  if (pathArray.length === 0) {
    return "/";
  }
  return `/${pathArray.join("/")}`;
}

function getAllJsonFiles(configDir: string): string[] {
  const files: string[] = [];
  const dirEntries = readdirSync(configDir).sort((a, b) => a.localeCompare(b));
  for (const entry of dirEntries) {
    const fullPath = join(configDir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
      continue;
    }
    if (stat.isFile() && entry.toLowerCase().endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

function makeAnalysis(analysisJson: AnalysisJson, filePath: string): Analysis {
  const factory = analysisFactoryMap[analysisJson.type];
  if (!factory) {
    throw new Error(`未知 analysis.type: ${analysisJson.type}，文件: ${filePath}`);
  }
  return factory(analysisJson.options);
}

function makeDownProxy(downProxyJson: DownProxyJson, filePath: string): DownProxy {
  if (!downProxyJson.type) {
    throw new Error(`downProxy 未配置 type，文件: ${filePath}`);
  }
  const factory = downProxyFactoryMap[downProxyJson.type];
  if (!factory) {
    throw new Error(`未知 downProxy.type: ${downProxyJson.type}，文件: ${filePath}`);
  }
  return factory(downProxyJson.options);
}

export function loadAnalysisConfigFromDir(configDir: string): AnalysisConfig[] {
  const absConfigDir = resolve(process.cwd(), configDir);
  if (!existsSync(absConfigDir)) {
    return [];
  }

  const jsonFiles = getAllJsonFiles(absConfigDir);
  return jsonFiles.map((filePath) => {
    const rawText = readFileSync(filePath, "utf-8");
    const configJson = resolveEnvInJson(JSON.parse(rawText), filePath) as MountConfigJson;
    if (!configJson.analysis) {
      throw new Error(`配置缺少 analysis 字段，文件: ${filePath}`);
    }
    const mountPath = configJson.mountPath?.trim() || getMountPathByFilePath(absConfigDir, filePath);
    return {
      mountPath,
      analysis: makeAnalysis(configJson.analysis, filePath),
      downProxy: configJson.downProxy?.type ? makeDownProxy(configJson.downProxy, filePath) : undefined,
    };
  });
}

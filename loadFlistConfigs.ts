import type { AnalysisConfig } from './src/node/base/AllAnalysis.js';

export type FlistConfig = Omit<AnalysisConfig, 'mountPath'>;

/**
 * 将 import.meta.glob 的结果转换为 AnalysisConfig 数组。
 * 文件路径相对于 basePath 的部分（去掉 .ts 后缀）即为 mountPath。
 *
 * 用法（在 vuepress.config.ts 中）：
 *   const modules = import.meta.glob('./flist/**\/*.ts', { eager: true });
 *   const configs = buildFlistConfigs(modules, './flist');
 */
export function buildFlistConfigs(
    modules: Record<string, { default: FlistConfig }>,
    basePath: string
): AnalysisConfig[] {
    const normalizedBase = basePath.replace(/\/$/, '');
    return Object.entries(modules).map(([filePath, module]) => {
        const stripped = filePath.startsWith(normalizedBase)
            ? filePath.slice(normalizedBase.length)
            : filePath;
        const mountPath = (stripped.startsWith('/') ? '' : '/') + stripped.replace(/\.ts$/, '');
        return { mountPath, ...module.default };
    });
}

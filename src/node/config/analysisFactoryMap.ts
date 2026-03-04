import { Analysis } from "../base/AllAnalysis.js";
import { fileUrlTreeAnalysis } from "../analysis/fileUrlTreeAnalysis/index.js";
import { huggingFaceDatasetsAnalysis } from "../analysis/huggingFaceDatasetsAnalysis/index.js";
import { githubReleasesFilesAnalysis } from "../analysis/githubReleasesFilesAnalysis/index.js";
import { giteeReleasesFilesAnalysis } from "../analysis/giteeReleasesFilesAnalysis/index.js";
import { githubReposAnalysis } from "../analysis/githubReposAnalysis/index.js";
import { giteeReposAnalysis } from "../analysis/giteeReposAnalysis/index.js";

export const analysisFactoryMap: Record<string, (options: any) => Analysis> = {
  fileUrlTreeAnalysis: (options: any) => fileUrlTreeAnalysis(options),
  huggingFaceDatasetsAnalysis: (options: any) => huggingFaceDatasetsAnalysis(options),
  githubReleasesFilesAnalysis: (options: any) => githubReleasesFilesAnalysis(options),
  giteeReleasesFilesAnalysis: (options: any) => giteeReleasesFilesAnalysis(options),
  githubReposAnalysis: (options: any) => githubReposAnalysis(options),
  giteeReposAnalysis: (options: any) => giteeReposAnalysis(options),
};

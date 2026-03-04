import { githubReleasesFilesAnalysis } from "../../src/node/analysis/githubReleasesFilesAnalysis/index.js";
import { cloudflarePagesDownProxy } from "../../src/node/proxy/cloudflarePagesDownProxy/index.js";

export default {
    analysis: githubReleasesFilesAnalysis({user: "neovim", repository: "neovim"}),
    downProxy: cloudflarePagesDownProxy(),
}

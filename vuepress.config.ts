import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { FileList } from './src/node/index.js'
import {githubReleasesFilesAnalysis} from "./src/node/analysis/GithubReleasesFilesAnalysis.js";
import {cloudflarePagesDownProxy} from "./src/node/proxy/cloudflarePages/cloudflarePages.js";
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { seoPlugin } from '@vuepress/plugin-seo'
import {FilePageFrontmatter, FolderPageFrontmatter} from "./src/type/index.js";

export default defineUserConfig({
  bundler: viteBundler(),
  pagePatterns:[],
  lang: 'zh-CN',
  public: `./public`,
  title: '神奇小破盘',
  description: '神奇小破盘 -- 分享各种有用的文件。',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  shouldPrefetch: false,
  plugins:[
    sitemapPlugin({
      hostname: 'flist.jjaw.cn',
      modifyTimeGetter: (page) => {
        let f = page.frontmatter;
        let item = 0;
        if(f.layout=="Folder"){
          item = ((f as any) as FolderPageFrontmatter).folder?.updateTime || 0;
        }else if(f.layout=="File"){
          item = ((f as any) as FilePageFrontmatter).file?.updateTime || 0;
        }
        return new Date(item).toISOString()
      }
    }),
    seoPlugin({
      hostname: 'flist.jjaw.cn'
    })
  ],
  theme: FileList([
    {
      mountPath:"/",
      analysis:githubReleasesFilesAnalysis({user:"jianjianai", repository:"my-flist-files"}),
      downProxy:cloudflarePagesDownProxy(),
    },
    // --------软件------
    {
      mountPath:"/软件/KnapsackToGo4",
      analysis:githubReleasesFilesAnalysis({user:"jianjianai", repository:"KnapsackToGo4"}),
      downProxy:cloudflarePagesDownProxy(),
    }, {
      mountPath:"/软件/BBDown",
      analysis:githubReleasesFilesAnalysis({user:"nilaoda", repository:"BBDown"}),
      downProxy:cloudflarePagesDownProxy(),
    }, {
      mountPath:"/软件/ffmpeg",
      analysis:githubReleasesFilesAnalysis({user:"GyanD", repository:"codexffmpeg"}),
      downProxy:cloudflarePagesDownProxy(),
    }, {
      mountPath:"/软件/ClashMetaForAndroid",
      analysis:githubReleasesFilesAnalysis({user:"MetaCubeX", repository:"ClashMetaForAndroid"}),
      downProxy:cloudflarePagesDownProxy(),
    }, {
      mountPath:"/软件/clash-verge-rev",
      analysis:githubReleasesFilesAnalysis({user:"clash-verge-rev", repository:"clash-verge-rev"}),
      downProxy:cloudflarePagesDownProxy(),
    }, {
      mountPath:"/软件/TrafficMonitor",
      analysis:githubReleasesFilesAnalysis({user:"zhongyang219", repository:"TrafficMonitor"}),
      downProxy:cloudflarePagesDownProxy(),
    },
    // -------视频---------
    {
      mountPath:"/视频/小马宝莉/第4代",
      analysis:githubReleasesFilesAnalysis({user:"panpanaw", repository:"flist-ponys-g4"}),
      downProxy:cloudflarePagesDownProxy(),
    }
  ])
})

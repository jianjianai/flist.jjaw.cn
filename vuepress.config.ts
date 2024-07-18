import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { FileList } from './src/node/index.js'
import {githubReleasesFilesAnalysis} from "./src/node/analysis/GithubReleasesFilesAnalysis.js";
import {cloudflarePagesDownProxy} from "./src/node/proxy/cloudflarePages/cloudflarePages.js";
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { seoPlugin } from '@vuepress/plugin-seo'

export default defineUserConfig({
  bundler: viteBundler(),
  pagePatterns:[],
  lang: 'zh-CN',
  public: `./public`,
  title: '神奇小破盘',
  description: '神奇小破盘 -- 分享各种有用的文件。',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  shouldPrefetch: true,
  theme: FileList([
    {
      mountPath:"/",
      analysis:githubReleasesFilesAnalysis({user:"jianjianai", repository:"flist.jjaw.cn"}),
      downProxy:cloudflarePagesDownProxy(),
    }
  ]),
  plugins:[
    sitemapPlugin({
      hostname: 'flist.jjaw.cn',
    }),
    seoPlugin({
      hostname: 'flist.jjaw.cn'
    })
  ]
})

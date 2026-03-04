import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { FileList } from './src/node/index.js'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'
import { seoPlugin } from '@vuepress/plugin-seo'
import {FilePageFrontmatter, FolderPageFrontmatter} from "./src/type/index.js";

export default defineUserConfig({
  bundler: viteBundler(),
  pagePatterns: [],
  lang: 'zh-CN',
  public: `./public`,
  title: '神奇小破盘',
  description: '神奇小破盘 -- 分享各种有用的文件。',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    //统计
    ['script',{},`!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3IG7honw86Ec9yDG",ck:"3IG7honw86Ec9yDG"});`]
  ],
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
  theme: FileList()
})

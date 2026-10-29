# RememberMe_Admin

《寻梦环游记》同人网页游戏的制作站：制作清单、PRD、参考图库三个页面，部署在 Vercel 上，整站需要密码访问。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 网站本体（制作清单、PRD、参考图库） |
| `middleware.js` | 整站密码保护 |
| `api/library.js` | 图库接口：列出、重命名、删除图片 |
| `api/upload.js` | 图库接口：发放上传凭证，图片由浏览器直传到 Vercel Blob |
| `api/_lib.js` | 接口共用的工具函数 |
| `blob-client.js` | 浏览器端上传库（由 `client/blob-client.js` 打包生成） |
| `package.json` | 依赖声明 |

## 部署步骤

1. **导入项目**：Vercel 网站 → Add New → Project → 选择 GitHub 仓库 `RememberMe_Admin` → Framework Preset 选 **Other** → Deploy。第一次部署打开会报错，因为还没设置密码，继续下面的步骤即可。
2. **创建图片存储**：在项目页面 → Storage → Create → **Blob**，访问权限选 **Public**，并连接到这个项目。Vercel 会自动添加环境变量 `BLOB_READ_WRITE_TOKEN`。
3. **设置密码**：项目 → Settings → Environment Variables，添加：
   - `ADMIN_USER`：登录用户名，例如 `nanxi`
   - `ADMIN_PASSWORD`：登录密码，只用英文字母、数字和符号
4. **重新部署**：项目 → Deployments → 最新一条右侧菜单 → Redeploy。
5. **绑定域名（可选）**：项目 → Settings → Domains，填入你的 .dev 域名，按提示添加 DNS 记录。

打开网站时浏览器会弹出登录框，输入上面设置的用户名和密码即可。

## 从 Claude 版网站搬过来

- **清单进度**：在旧网站的制作清单点「导出进度」，在新网站点「导入进度」选择这个文件。
- **参考图**：在旧网站逐张下载，再在新网站对应类别上传。

## 更新上传库（一般不需要）

```
npm install
npm run build:client
```

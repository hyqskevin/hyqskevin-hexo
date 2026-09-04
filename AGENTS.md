# AGENTS.md — MonoShow 博客维护协作约定

面向后续 AI 助手（含本助手）的项目维护契约。涉及改动前请通读本文。

## 项目快照

- 站点：`MonoShow`（部署到 `https://hyqskevin.github.io`）
- 引擎：Hexo 8.1.2，Node.js 24
- 主题：`themes/maupassant`（本地定制版，**不要轻易重装覆盖**）
- 部署：push `main` → `.github/workflows/deploy.yml` 自动 build → `peaceiris/actions-gh-pages` 推 `public/` 到外部仓库 `hyqskevin.github.io` 的 `main` 分支
- 包管理：npm（`package.json` 声明）；`yarn.lock` 是历史遗留，新装依赖以 `package-lock.json` 为准

## 目录约定

| 路径 | 作用 |
|---|---|
| `source/_posts/<年>/<slug>.md` | 博客文章，按年份归档 |
| `source/about/`、`source/categories/<name>/`、`source/photo/`、`source/pic/` | 静态页面与图片 |
| `themes/maupassant/source/css/*.scss` | **SCSS 唯一编辑位置**（style / donate / search / copyright / copycode） |
| `public/css/*.css` | 自动生成的产物，**不要手工编辑** |
| `scripts/compile-scss.js` | Hexo 钩子，`before_generate` 阶段把 SCSS 编译到 `public/css/` |
| `creatives/<slug>/` | 单次多平台分发项目（稿源、Excalidraw/p5js 源、最终交付物） |
| `skill/SKILL.md` | 已有的 `article-platform-publisher` Skill 定义 |

## 写新文章

1. **先建年份子目录**（踩坑：hexo new post 不会自动建 `<年>/` 子目录）
   ```bash
   mkdir -p source/_posts/2026
   ```
2. 创建草稿（**两种等价路径**任选）：
   - **Hexo 命令**：`npx hexo new post "<title>"` → 落到 `source/_posts/<title>.md`（根目录！）→ `git mv source/_posts/<title>.md source/_posts/2026/<slug>.md`
   - **直接 Write**（推荐，新文更顺手）：`Write source/_posts/2026/<slug>.md` 一次成型
3. front-matter 标准字段（参考 `scaffolds/post.md`）：`title`、`date`、`description`、`categories`、`tags`
   - `description` **必须填**（60–120 字中文摘要），覆盖首页自动摘要
   - 系列文加 `series.name/index/total` 字段（即使主题不渲染，结构化元数据先存）
4. 写完本地预览：`npm run server`（默认 `http://localhost:4000`）
5. 跑 `npm run build` 验证生成无 error（**必须**，不要直接 push）
6. 提交后由 CI 自动部署；不要本地手动 `hexo deploy`

### Obsidian 源稿改写流程（主工作流，2026-09 新增）

主路径是 Obsidian vault 写 → 改写 → 落地 Hexo，不走 `hexo new post`：

- **源稿位置**：`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Documents/4-doc/...`
- **改写 Skill**：`skill/obsidian-to-hexo-publisher.md`（结构 / front matter / 图片 / 链接 / callout / 双链转换）
- **去 AI 味**：`skill/humanizer.md`
- **发布清单**：`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Documents/8-hexo/发布文章协作清单.md`（按选题 / 状态 / 推荐下一篇）
- **字数规则**（2026-09-04 已放宽）：接受原长度发布，目标甜区 3000–4000 字。源稿 300 字 cheatsheet 就发 300 字，不要"反复 Edit 补 1000"凑数。> 4000 字按 Skill §4.5.1 拆分决策树判断

## 样式调整

- **编辑 SCSS**：改 `themes/maupassant/source/css/*.scss`
- **不要**直接改 `public/css/*.css`（每次 build 会被覆盖）
- 本地 `hexo server` 时钩子自动重编；CI 上 Actions 也会跑同一份钩子
- 若新增 SCSS 文件，记得把它加入 `scripts/compile-scss.js` 的 `scssFiles` 数组

## 内容分发

- 已有 Skill：`skill/SKILL.md`（`article-platform-publisher`）— 把 Hexo 源稿改写为小红书 / 公众号格式
- 每次分发的稿源、卡片源（Excalidraw / p5js HTML）、最终交付物归档到 `creatives/<slug>/`

## 部署与依赖

- 部署走 `.github/workflows/deploy.yml`，**不要**手动 `hexo deploy`（与 CI 双源会冲突）
- Dependabot（`.github/dependabot.yml`，daily 节奏）会提 npm 更新 PR，按需合
- 关键 secrets：`GH_PAGES_TOKEN`（用于 gh-pages action），不要本地打印或泄露
- **`package.json` 的 `postinstall` 钩子是必需的**——它跑 `scripts/patch-mermaid-renderer.js`，给 `hexo-filter-mermaid@1.0.0` 打补丁（这版有个 bug 会让 mermaid 块前后的正文丢失）。**不要 `npm install --ignore-scripts`**，否则 bug 会回归。
- 修改 `package.json` 的 dependencies 后，如果插件版本升级到 1.x 以上，记得检查 `scripts/patch-mermaid-renderer.js` 的 marker 是否还有效——升级后正则或代码结构变了 patch 可能失效。

## 协作边界

- 不要触碰 `themes/maupassant/layout/` 之外的 Pug 模板，除非用户明确要求主题改造
- 不要清空 `public/` 目录（`.gitignore` 忽略它，但本地 `hexo server` 依赖）
- 不要直接 commit/push 涉及部署的动作；先和用户确认
- 涉及 GitHub 推送 / 开 PR / 触发 Actions 的动作必须先和用户确认

## 常用命令速查

```bash
# 写新文章
npx hexo new post "<title>"

# 本地预览（含 SCSS 钩子）
npm run server

# 清理 + 重新生成
npm run clean && npm run build

# 部署（CI 已自动，本地一般不需要）
npm run deploy
```
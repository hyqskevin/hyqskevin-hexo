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

1. 用 `npx hexo new post "<title>"` 创建草稿，落到 `source/_posts/<当前年>/`
2. front-matter 标准字段（参考 `scaffolds/post.md`）：`title`、`date`、`tags`、`categories`
3. 写完本地预览：`npm run server`（默认 `http://localhost:4000`）
4. 提交后由 CI 自动部署；不要本地手动 `hexo deploy`

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
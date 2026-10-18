---
title: 9 个图像审美 Skill 速查
date: 2026-09-20 00:00:00
description: 公众号 MDanielM 整理的 9 个图像审美 Skill 速查：覆盖纸刊海报、像素风、双色调解构、照片重绘与抽象转译，附三步选图法与评分，帮你在 AI 出图时快速选对工具。
categories: [notes]
tags: [设计, AI-Skill, 图像审美, 海报, 开源仓库, github]
---

> 公众号：MDanielM · 发布：2026-08-23
> 原文链接：https://mp.weixin.qq.com/s/a232jGEfi7VwEeOZYvPF9A

还记得去年年底，我在朋友圈刷到别人各种户外旅游照片，心里就计划着要买台相机。但是一直拖到现在，也还没选好要入手哪款型号的相机。

GPT Image 2 模型出来之后，图像美化差不多可以实现摄影级别的效果了。以前的主流方式是通过写提示词来优化图像质量，如今各种 Skill 开始称霸设计圈。这些 Skill 大致可以分为两类：一类必须给图，把照片作为版面素材；一类是可选是否上传照片，不传的话给一句提示词也能跑。有的 Skill 会重绘你的照片，将它变成插画或色块，输出比例由模板来定；有些 Skill 并不会大改图片，只是配一块版画或抽象面板，从原图中抽取色彩元素或者其他调性。

无奈设计大佬实在太多，每次打开小红书我都眼花缭乱的。观摩了一段时间后，我整理了下面这 9 个 Skill，带你一次性理解图像背后的审美逻辑。

## 一、核心规律与速查表

### 1.1 一句话核心

> 这些 Skill 大致可以分为两类——**必须给图**（photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered）和**可选是否上传照片**（gc-minimal / pixel / muted / deconstructed-duotone）。
>
> 核心规律：**留白 + 单焦点**是高级感的来源；**主体清楚 + 关系清楚**是好出图的前提；**越接近原图越可控，越依赖重绘越抽卡**。

### 1.2 9 个 Skill 速查表

| # | Skill | 仓库 | 风格定位 | 评分 | 是否需要原图 |
|---|---|---|---|---|---|
| 1 | **gc-minimal-zine-poster** | [LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster) | 纸刊海报 / 仿旧纸张 / 留白 + 单焦点 / 3:5 | ⭐⭐⭐⭐⭐ | 可选 |
| 2 | **pixel-style-poster-skill** | [v92388375-gif/pixel-style-poster-skill](https://github.com/v92388375-gif/pixel-style-poster-skill) | 像素点阵 / 米白纸纤维 / 3:4 / 适配花卉、动物、人脸 | ⭐⭐⭐⭐ | 可选 |
| 3 | **muted-zine-poster-v01** | [moonlin1213/muted-zine-poster-v01](https://github.com/moonlin1213/muted-zine-poster-v01) | gc-minimal 的"安静版" / 单色 / 70%+ 留白 | ⭐⭐⭐ | 可选 |
| 4 | **deconstructed-duotone-poster** | [Lixorn/deconstructed-duotone-poster](https://github.com/Lixorn/deconstructed-duotone-poster) | 解构六宫格 / 双色调 / 平面印刷感 | ⭐⭐⭐ | 可选 |
| 5 | **photo-revival** | [dacnay816y62-hub/photo-revival](https://github.com/dacnay816y62-hub/photo-revival) | 保留主体 + 手绘重绘 / 居中 + 大量留白 / 3:4 或 3:5 | ⭐⭐⭐ | **必须** |
| 6 | **photo-relic-editorial** | [wnby/photo-relic-editorial](https://github.com/wnby/photo-relic-editorial) | 上半照片 + 下半版画 / 纸上留影 / 淡墨勾勒 | ⭐⭐⭐⭐ | **必须** |
| 7 | **photo-abstract-editorial** | [ZzzLc0405/photo-abstract-editorial](https://github.com/ZzzLc0405/photo-abstract-editorial) | 象牙白抽象面板 / 几何标记 / 8 月初开源冲到 GitHub 第一 | ⭐⭐⭐⭐⭐ | **必须** |
| 8 | **travel-photo-abstraction** | [Evianis/travel-photo-abstraction](https://github.com/Evianis/travel-photo-abstraction) | 旅拍抽象 / 数量·位置·节奏映射为符号 / 适合个人手账 | ⭐⭐⭐⭐ | **必须** |
| 9 | **scenes-gathered-zine-v1-3** | [Zeejay0/gathered-scenes-zine-skill](https://github.com/Zeejay0/gathered-scenes-zine-skill) | 手撕纸纤维边 + 高饱和结构色 + 充足留白 / **作者最爱** | ⭐⭐⭐⭐⭐⭐ | **必须** |

## 二、三步选图法（作者总结）

### 2.1 第一步：要不要保留照片原图？

| 场景 | 推荐 Skill |
|---|---|
| 想保留照片真实质感 | photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered |
| 想快速生成有氛围的海报 | gc-minimal / pixel / muted / deconstructed-duotone |

### 2.2 第二步：提前处理图片比例

| Skill | 推荐比例 |
|---|---|
| deconstructed-duotone | 3:4 或 4:3（最敏感） |
| travel-photo-abstraction / scenes-gathered | 竖图 |
| pixel-style-poster | 生成后通常需要再裁成 3:4 |

### 2.3 第三步：认真挑原图

**两个标准**：

- **主体清楚**——明确的主体、景别
- **关系清楚**——空间层次、明暗关系

> 抽象类与重绘类 Skill 在主体和关系清楚时表现更稳定。

### 2.4 稳定性 vs 抽卡性

| 类型 | 代表 Skill | 特征 |
|---|---|---|
| **最可控**（接近原图） | photo-relic、photo-abstract | 指哪打哪 |
| **随机性强**（重绘） | photo-revival、scenes-gathered | 偶尔出神图，也偶尔翻车 |

## 三、逐个 Skill 详解

### 3.1 gc-minimal-zine-poster

> 仓库：https://github.com/LiamGvchi/gc-minimal-zine-poster

这个 Skill 可能是最出名的，但这个版本的效果应该是最好的。它的风格是一种纸刊海报风，作者是真的把审美当工程在打磨：不仅给了模板，还配了一套 prompt-compiler 和 quality-gate 质检流程。

设计核心是图像大面积留白，只保留一个视觉焦点，装在一个仿旧纸张的竖版画布里，默认输出比例是 3:5。你可以上传照片给模型参考，也可以直接发一段提示词，Skill 会把这句话翻译成一个视觉隐喻再转成海报，适合情绪短句、极简人像和小景。

整体而言，这个 Skill 产出的图片有一种做旧风，再搭配一句英文配文，很有味道。之所以看着视觉效果很好，是因为图片中会刻意留白，后面很多个 Skill 也采用了这种方式。这是一个自由度很高的 Skill，但正因为自由，它对情绪表达的依赖也最强，给的提示词越具体，效果肯定是越好的。

综合体验打分：⭐⭐⭐⭐⭐

### 3.2 pixel-style-poster-skill

> 仓库：https://github.com/v92388375-gif/pixel-style-poster-skill

这个 Skill 能生成一种像素风的图片，作者给出的示例用了大量植物参考图（薄荷夜百合、洛可可丝绒葡萄、深青蝴蝶），所以模型更适合花卉、动物和近景人脸。出的图质感不太好形容，可以理解为一种点阵印刷感，用细密的小点表现明暗，像老式激光打印机把图像印在带纤维纹理的米白色纸张上。

Skill 默认输出 3:4 的竖版图片，如果制作人物图，建议上传 3:4 近景，因为它更适合生成脸部特写。实测中，高饱和度、复杂纹理、人脸细节的处理都很好；加入花束、摊位、遮阳伞、人物和远景等复杂场景，也能处理好层次关系。不过这个 Skill 很挑原图的质量，非常适配能当海报主体的大特写。像素风格看多了之后会有视觉疲劳感，建议用自己的照片试试效果。

综合体验打分：⭐⭐⭐⭐

### 3.3 muted-zine-poster-v01

> 仓库：https://github.com/moonlin1213/muted-zine-poster-v01

这个 Skill 把极简风阐述到极致了。其实它是基于 gc-minimal-zine-poster 做了一些微调得到的低饱和度版本，或者就叫"安静"版本。用它做的图，颜色接近单色，纸张上 70% 以上都是留白，视觉主体只占画面的一小块，非常适合雨天、旧书、海边、回忆等场景的情感表达。

Skill 生态里这种看不惯就自己动手改的二创特别多，muted 就是其中一个还不错的例子。不过也因为太极简了，画面中元素非常少，表达的情感也比较单一。

综合体验打分：⭐⭐⭐

### 3.4 deconstructed-duotone-poster

> 仓库：https://github.com/Lixorn/deconstructed-duotone-poster

作者做这个 Skill 的初衷很直接：AI 生图经常会随便给你套个滤镜糊弄完事，不会分析照片中的细节。所以这个 Skill 的设计思路就是把照片拆开，再重新组成平面印刷感的海报。核心是"解构"，先把原图拆成几个语义锚点，再用六宫格或者九宫格重新演绎。比如山路环绕的图片，树林用绿色调，山路就用留白设计；海岸图片被解构之后再重构，也能得到不错的结果。

总体实测下来，这个 Skill 更适合作为灵感素材，或者有量产艺术海报诉求的时候可以试试。但有一点需要注意：图像中只有两种色彩。

综合体验打分：⭐⭐⭐

### 3.5 photo-revival

> 仓库：https://github.com/dacnay816y62-hub/photo-revival

这个 Skill 的设计方式很简单，保留主体、空间关系、情绪，再用手绘风重绘，主体默认是居中的，有大量的留白。按作者的说法就是：把照片重新画成一页诗，而不是把照片修成插画。也就是说，Skill 真正服务的是你手机相册里一直舍不得删的废片。最终的图片只在一小块插画里保留高饱和的局部颜色，建议上传 3:4 或 3:5 的竖图。

这种风格有点像小时候看儿童读物里面的配图，画面整体呈现一种记忆感，也透露出生活气息。丢给 AI 一张随手拍的老街、一杯咖啡、一只猫，就能得到一张手绘小海报。

综合体验打分：⭐⭐⭐

### 3.6 photo-relic-editorial

> 仓库：https://github.com/wnby/photo-relic-editorial

这个 Skill 整体效果有点像 gc-minimal-zine-poster，用四个字评价：纸上留影。生成的图片结构是上半保留照片、下半生成一块版画，从照片里提取色彩和结构，然后用几笔淡墨勾勒出形状，很适合建筑、天际线、水面、道路等场景。

可以看出来，这个 Skill 做的图虽然抽象，但并没有 deconstructed-duotone-poster 那么抽象，相当于做了一次艺术化转译，图片的大部分元素还是一眼就能看出来的。并且图片最下方也有一小行配文，彰显一点诗情画意。

综合体验打分：⭐⭐⭐⭐

### 3.7 photo-abstract-editorial

> 仓库：https://github.com/ZzzLc0405/photo-abstract-editorial

这个 Skill 非常新鲜，8 月初刚开源，几天内 GitHub 就冲到几千个 Star，一度冲榜 GitHub 第一。核心理念是"克制"，结构上和 photo-relic-editorial 类近，但下半部分从带质感的版画换成了象牙白抽象面板，没有纸纹、颗粒或者渐变，只是把照片里几个大的空间关系抽离出来，再变成极简的几何标记，最后配一行英文标题，适合建筑、风景、人群、旅行照等。

如果图片选得好，抽卡运气好一点，做出来的图都可以直接当商标用了，因为这种风格很简约，又很高级。

综合体验打分：⭐⭐⭐⭐⭐

### 3.8 travel-photo-abstraction

> 仓库：https://github.com/Evianis/travel-photo-abstraction

从名字就能看出，这个 Skill 最适合的场景就是旅游照片。把图片中的数量、位置、节奏、间隙都映射成抽象符号，做法有点类似上一个 Skill。总体来说，它适合元素丰富、关系清楚的城市、街道、风景照，越是层次清楚的原图，抽象出来信息量越多。

放在旅行场景，可以在你旅拍的过程中，用这个 Skill 做一套既有艺术性又有收藏逻辑的作品集，放在个人手账里，因为风格统一，看着会很舒适。话说回来，这是不是也可以延伸为一门生意呢？帮别人生成手账配图……

综合体验打分：⭐⭐⭐⭐

### 3.9 scenes-gathered-zine-v1-3

> 仓库：https://github.com/Zeejay0/gathered-scenes-zine-skill

把这个 Skill 放在最后，因为这是作者最喜欢的一个。它会保留照片的真实质感，再用手撕纸的纤维边，把照片与纸刊式插画连接起来。画面下方通常还会加入一块从照片中提取、重新抽象的色块，并用高饱和结构色参与构图，最后留出充足的纸张空白。

有一个非常关键的设计要点：Skill 能把照片中复杂的细节压缩成几块大的形状，是非常美术化的做法。因此，使用这个 Skill 的时候也最值得你精挑原图——照片中的主体关系越清楚，Skill 提取出的结构色、抽象形状和撕纸边界就越有力量，像一页经过精细编辑和设计的纸刊。一次直出的效果非常惊艳。

综合体验打分：⭐⭐⭐⭐⭐⭐

## 四、我的使用建议

> 以下为整理者（作者）视角的小结，供参考。

### 4.1 与自有项目的契合点

| 项目 | 可用 Skill | 价值 |
|---|---|---|
| 保租房进校园 PPT | gc-minimal、photo-relic、photo-abstract、scenes-gathered | 大留白 + 单焦点 + 莫兰迪低饱和度 = 天然契合莫兰迪审美（注意 muted 是 gc-minimal 的低饱和度版本） |
| 宁波策划案扫街摄影 | photo-revival、travel-photo-abstraction、scenes-gathered | 把街头随手拍做成有故事感的纸刊配图，配合"扫街摄影分享活动" |
| 宁波策划案封面 / 海报 | gc-minimal、deconstructed-duotone、photo-abstract | 装在仿旧纸张里的海报感，比传统政务风封面更有质感 |

### 4.2 仓库补全说明

这 9 个仓库与既有"设计相关开源仓库"文档中的 12 个仓库**完全不重叠**——现有偏 Claude Design 替代品 / 截图转代码 / 设计系统 / UX 规则；本文偏**单图海报 / 美术化转译**。两者互补，不重复。

| 本篇新增仓库 | 风格定位 | 备注 |
|---|---|---|
| LiamGvchi/gc-minimal-zine-poster | 纸刊海报 | 海报排版必看 |
| v92388375-gif/pixel-style-poster-skill | 像素点阵风 | 像素点阵风 |
| moonlin1213/muted-zine-poster-v01 | 莫兰迪低饱和度 | **莫兰迪审美匹配度最高** |
| Lixorn/deconstructed-duotone-poster | 解构六宫格 | 解构六宫格 |
| dacnay816y62-hub/photo-revival | 废片救星 | 废片救星 |
| wnby/photo-relic-editorial | 纸上留影 | 纸上留影 |
| ZzzLc0405/photo-abstract-editorial | 克制抽象 | GitHub 一度冲榜 |
| Evianis/travel-photo-abstraction | 旅拍抽象 | 旅拍抽象 |
| Zeejay0/gathered-scenes-zine-skill | 手撕纸 + 结构色 | **作者最爱（6 星）**，值得试用 |

### 4.3 优先试用顺序（莫兰迪审美倾向）

1. **muted-zine-poster-v01**（莫兰迪低饱和度直接匹配）
2. **gc-minimal-zine-poster**（莫兰迪打底）
3. **scenes-gathered-zine-v1-3**（作者最爱，手撕纸 + 结构色高级感）
4. **photo-abstract-editorial**（8 月刚冲榜）
5. **photo-relic-editorial**（最可控）

## 五、写在最后

最后，简单总结一下这 9 个 Skill 的用法。

第一步，先想清楚，你要不要让照片原图的内容出现在版面上。如果想保留照片的真实质感，建议选择 photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered（这一组都必须提供原图）；如果只是想快速生成一张有氛围的海报，选择 gc-minimal / pixel / muted / deconstructed-duotone（它们对照片依赖较低，有时只输入一句话就能完成）。

第二步，提前处理图片比例。这几个 Skill 对比例都比较敏感，尤其是 deconstructed-duotone，最好提前裁成 3:4 或 4:3；travel-photo-abstraction 和 scenes-gathered 更适合输入竖图；pixel-style-poster 生成后通常还需要再裁成 3:4。比例准备得越准确，出图成功率就越高。

第三步，认真挑原图，重点看两个标准：**主体清楚 + 关系清楚**。一张照片如果有明确的主体、景别、空间层次和明暗关系，抽象类与重绘类 Skill 的表现都会更稳定。

这 9 个 Skill 的稳定性也不一样。越接近原图的通常越可控，photo-relic 和 photo-abstract 基本能做到指哪打哪；越依赖重绘的随机性越强，photo-revival 和 scenes-gathered 偶尔会给出意料之外的结果。图片生成的场景，也是以抽卡为主，能出神图的时刻，往往就需要这种不可控因素。

折腾了一圈，相机还躺在购物车里，我开始犹豫自己是否还真的有需求。但换个角度思考，审美能力的培养，并非靠工具"赋能"，而是真的了解艺术，多看一些优秀作品。照片拍得好不好，或许没有那么重要；重要的是，我们是否还愿意相信，这个世界上仍有如此多值得被仔细观察、留意的东西。

这大概才是最高级的审美。

## 模型版本说明

⚠️ 本文提到的 **GPT Image 2** 等模型名称以原文发布时（2026-08-23）为准。AI 图像模型迭代极快，具体能力、命名与可用性请以你本地/平台实际版本为准，Skill 效果也可能随模型更新而变化。

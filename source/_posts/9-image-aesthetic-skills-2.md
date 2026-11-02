---
title: 9个图像审美Skill
date: 2026-10-18 00:00:00
description: 9个开源Skill把图像审美拉到新高度，分为「必须给图」与「可选是否上传照片」两类；核心规律是留白加单焦点、主体清楚加关系清楚，越接近原图越可控，越依赖重绘越抽卡。
categories:
  - 设计
  - AI工具
tags:
  - 图像审美
  - AI-Skill
  - 海报设计
  - 开源仓库
  - GitHub
  - Skill
---

> 来源：公众号 MDanielM（超级硬核的 Daniel） · 2026-08-23
> 原文：[https://mp.weixin.qq.com/s/a232jGEfi7VwEeOZYvPF9A](https://mp.weixin.qq.com/s/a232jGEfi7VwEeOZYvPF9A)

## 一、核心规律与分类

> 这些 Skill 大致可以分为两类——**必须给图**（photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered）和**可选是否上传照片**（gc-minimal / pixel / muted / deconstructed-duotone）。
>
> 核心规律：**留白 + 单焦点**是高级感的来源；**主体清楚 + 关系清楚**是好出图的前提；**越接近原图越可控，越依赖重绘越抽卡**。

## 二、9 个 Skill 速查表

| # | Skill | 仓库 | 风格定位 | 评分 | 是否需要原图 |
|---|---|---|---|---|---|
| 1 | gc-minimal-zine-poster | [LiamGvchi/gc-minimal-zine-poster](https://github.com/LiamGvchi/gc-minimal-zine-poster) | 纸刊海报 / 仿旧纸张 / 留白 + 单焦点 / 3:5 | ⭐⭐⭐⭐⭐ | 可选 |
| 2 | pixel-style-poster-skill | [v92388375-gif/pixel-style-poster-skill](https://github.com/v92388375-gif/pixel-style-poster-skill) | 像素点阵 / 米白纸纤维 / 3:4 / 适配花卉、动物、人脸 | ⭐⭐⭐⭐ | 可选 |
| 3 | muted-zine-poster-v01 | [moonlin1213/muted-zine-poster-v01](https://github.com/moonlin1213/muted-zine-poster-v01) | gc-minimal 的「安静版」 / 单色 / 70%+ 留白 | ⭐⭐⭐ | 可选 |
| 4 | deconstructed-duotone-poster | [Lixorn/deconstructed-duotone-poster](https://github.com/Lixorn/deconstructed-duotone-poster) | 解构六宫格 / 双色调 / 平面印刷感 | ⭐⭐⭐ | 可选 |
| 5 | photo-revival | [dacnay816y62-hub/photo-revival](https://github.com/dacnay816y62-hub/photo-revival) | 保留主体 + 手绘重绘 / 居中 + 大量留白 / 3:4 或 3:5 | ⭐⭐⭐ | 必须 |
| 6 | photo-relic-editorial | [wnby/photo-relic-editorial](https://github.com/wnby/photo-relic-editorial) | 上半照片 + 下半版画 / 纸上留影 / 淡墨勾勒 | ⭐⭐⭐⭐ | 必须 |
| 7 | photo-abstract-editorial | [ZzzLc0405/photo-abstract-editorial](https://github.com/ZzzLc0405/photo-abstract-editorial) | 象牙白抽象面板 / 几何标记 / 8 月初开源冲到 GitHub 第一 | ⭐⭐⭐⭐⭐ | 必须 |
| 8 | travel-photo-abstraction | [Evianis/travel-photo-abstraction](https://github.com/Evianis/travel-photo-abstraction) | 旅拍抽象 / 数量·位置·节奏映射为符号 / 适合个人手账 | ⭐⭐⭐⭐ | 必须 |
| 9 | scenes-gathered-zine-v1-3 | [Zeejay0/gathered-scenes-zine-skill](https://github.com/Zeejay0/gathered-scenes-zine-skill) | 手撕纸纤维边 + 高饱和结构色 + 充足留白 / 作者最爱 | ⭐⭐⭐⭐⭐⭐ | 必须 |

## 三、三步选图法

### 3.1 第一步：要不要保留照片原图？

| 场景 | 推荐 Skill |
|---|---|
| 想保留照片真实质感 | photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered |
| 想快速生成有氛围的海报 | gc-minimal / pixel / muted / deconstructed-duotone |

### 3.2 第二步：提前处理图片比例

| Skill | 推荐比例 |
|---|---|
| deconstructed-duotone | 3:4 或 4:3（最敏感） |
| travel-photo-abstraction / scenes-gathered | 竖图 |
| pixel-style-poster | 生成后通常需要再裁成 3:4 |

### 3.3 第三步：认真挑原图

两个标准：
- **主体清楚**——明确的主体、景别
- **关系清楚**——空间层次、明暗关系

> 抽象类与重绘类 Skill 在主体和关系清楚时表现更稳定。

### 3.4 稳定性 vs 抽卡性

| 类型 | 代表 Skill | 特征 |
| --- | --- | --- |
| 最可控（接近原图） | photo-relic、photo-abstract | 指哪打哪 |
| 随机性强（重绘） | photo-revival、scenes-gathered | 偶尔出神图，也偶尔翻车 |

## 四、各 Skill 详解

### 4.1 gc-minimal-zine-poster-v0-3

gc-minimal-zine-poster 是最出名的版本，作者把审美当工程在打磨。Skill 不仅给了模板，还配了一套 prompt-compiler 和 quality-gate 质检流程。

核心是图像大面积留白，只保留一个视觉焦点，装在一个仿旧纸张的竖版画布里，默认输出比例 3:5。可以上传照片给模型参考，也可以直接发一段提示词，Skill 会把这句话翻译成一个视觉隐喻再转为海报，适合情绪短句、极简人像和小景。

实测体验：提供了参考图（欧式建筑、风景）后，色彩搭配非常舒服；不提供参考图时，做旧纸刊风配一句英文配文也很有味道。自由度很高，但正因为自由，对情绪表达的依赖也最强，提示词越具体效果越好。

**综合评分：⭐⭐⭐⭐⭐**

### 4.2 pixel-style-poster-skill

作者给出的示例用了大量植物参考图（薄荷夜百合、洛可可丝绒葡萄、深青蝴蝶），模型更适合花卉、动物和近景人脸。

质感像老式激光打印机把图像印在带纤维纹理的米白色纸张上，用细密的小点表现明暗。默认输出 3:4 竖版，建议人物图上传 3:4 近景。

实测体验：简约近景、高饱和度、复杂纹理、人脸细节处理都很好；书架、楼梯、书桌、人物、灯光形成的复杂场景也能 hold 住。但这种像素风看多了会有视觉疲劳，建议用自己的照片上手。

**综合评分：⭐⭐⭐⭐**

### 4.3 muted-zine-poster-v01

基于 gc-minimal-zine-poster 微调得到的低饱和度「安静版」。颜色接近单色，纸张上 70% 以上都是留白，视觉主体只占画面一小块，非常适合雨天、旧书、海边、回忆等场景。

Skill 生态里这种看不惯就自己动手改的二创特别多，muted 就是其中一个还不错的例子。不过也因为太极简，画面元素非常少，表达的情感也比较单一。

**综合评分：⭐⭐⭐**

### 4.4 deconstructed-duotone-poster

作者做这个 Skill 的初衷很直接——AI 生图经常会随便给你套个滤镜糊弄完事，不会分析照片中的细节。

设计思路是「解构」：先把原图拆成几个语义锚点，再用六宫格或九宫格重新演绎，组成平面印刷感的海报。例如山林用绿色调、山路用留白处理；海岸图片也能解构后重构。如果原图本身就有留白空间，会自然和 Skill 的设计模式适配。

适合作为灵感素材或量产艺术海报时使用，但要注意：图像只有两种色彩。

**综合评分：⭐⭐⭐**

### 4.5 photo-revival

设计方式简单直接：保留主体、空间关系、情绪，再用手绘风重绘，主体默认居中且留大量白。

按作者的说法是「把照片重新画成一页诗，而不是把照片修成插画」——服务的是手机相册里一直舍不得删的废片。最终图片只在一小块插画里保留高饱和的局部颜色，建议上传 3:4 或 3:5 的竖图。

实测体验：跑几张图，整体风格像小时候看儿童读物里的配图，画面有记忆感和生活气息。丢给 AI 一张拿手机随手拍的老街、一杯咖啡、一只猫，就能得到一张手绘小海报。

**综合评分：⭐⭐⭐**

### 4.6 photo-relic-editorial

整体效果有点像 gc-minimal-zine-poster，可以用四个字评价：纸上留影。

生成的图片结构是上半保留照片、下半生成一块版画，从照片里提取色彩和结构，然后用几笔淡墨勾勒出形状，很适合建筑、天际线、水面、道路等场景。

比 deconstructed-duotone-poster 不那么抽象，相当于做了一次艺术化转译，图片大部分元素一眼就能看出来。图片最下方还会配一小行配文，彰显诗情画意。

**综合评分：⭐⭐⭐⭐**

### 4.7 photo-abstract-editorial

8 月初刚开源，几天内 GitHub 就冲到几千个 Star，一度冲榜第一。

核心理念是「克制」。结构上和 photo-relic-editorial 类似，但下半部分从带质感的版画换成了象牙白抽象面板，没有纸纹、颗粒或渐变，只把照片里几个大的空间关系抽离出来变成极简的几何标记，最后配一行英文标题，适合建筑、风景、人群、旅行照。

实测体验：艺术感很强。如果图片选得好、抽卡运气好，做出来的图都可以直接当商标用，因为风格简约又高级。

**综合评分：⭐⭐⭐⭐⭐**

### 4.8 travel-photo-abstraction

从名字就能看出，最适合的场景是旅游照片。把图片中的数量、位置、节奏、间隙都映射成抽象符号，类似 photo-abstract-editorial 的做法。

适合元素丰富、关系清楚的城市、街道、风景照，越是层次清楚的原图，抽象出来信息量越多。放在旅行场景，可以在旅拍过程中用它做一套既有艺术性又有收藏逻辑的作品集放进个人手账，因为风格统一看着很舒适。

延伸思考：是不是也可以做一门生意——帮别人生成手账配图？

**综合评分：⭐⭐⭐⭐**

### 4.9 scenes-gathered-zine-v1-3

作者最喜欢的 Skill。保留照片的真实质感，再用手撕纸的纤维边，把照片与纸刊式插画连接起来。画面下方通常还会加入一块从照片中提取、重新抽象的色块，并用高饱和结构色参与构图，最后留出充足的纸张空白。

关键设计要点：Skill 能把照片中复杂的细节压缩成几块大的形状，非常美术化的做法。因此使用时最值得精挑原图——主体关系越清楚，提取出的结构色、抽象形状和撕纸边界就越有力量，像一页经过精细编辑和设计的纸刊。

**综合评分：⭐⭐⭐⭐⭐⭐**

## 五、写在最后

三步选图法的总结：

1. **要不要原图**：想保留真实质感选 photo-revival / photo-relic / photo-abstract / travel-photo-abstraction / scenes-gathered；想快速生成有氛围的海报选 gc-minimal / pixel / muted / deconstructed-duotone。
2. **提前处理比例**：deconstructed-duotone 裁成 3:4 或 4:3；travel-photo-abstraction 和 scenes-gathered 输入竖图；pixel-style-poster 生成后通常再裁成 3:4。
3. **认真挑原图**：主体清楚 + 关系清楚——明确的主体、景别、空间层次和明暗关系。

稳定性差异：越接近原图越可控（photo-relic、photo-abstract），越依赖重绘随机性越强（photo-revival、scenes-gathered，偶尔出神图）。

> 折腾了一圈，相机还躺在购物车里，开始犹豫自己是否还真的有需求。但换个角度思考，审美能力的培养，并非靠工具「赋能」，而是真的了解艺术，多看一些优秀作品。照片拍得好不好，或许没有那么重要。重要的是，我们是否还愿意相信，这个世界上仍有如此多值得被仔细观察、留意的东西。

## 六、与既有项目的契合点

| 项目 | 可用 Skill | 价值 |
|---|---|---|
| 2026 保租房进校园 PPT | gc-minimal、photo-relic、photo-abstract、scenes-gathered | 大留白 + 单焦点 + 莫兰迪低饱和度 = 天然契合莫兰迪审美（muted 是 gc-minimal 的低饱和度版本） |
| 706 宁波策划案扫街摄影 | photo-revival、travel-photo-abstraction、scenes-gathered | 把秀水街区随手拍做成有故事感的纸刊配图，配合「扫街摄影分享活动」 |
| 706 宁波策划案封面 / 海报 | gc-minimal、deconstructed-duotone、photo-abstract | 装在仿旧纸张里的海报感，比传统政务风封面更有质感 |

### 6.1 优先试用顺序（莫兰迪审美倾向）

1. **muted-zine-poster-v01**（莫兰迪低饱和度直接匹配）
2. **gc-minimal-zine-poster-v0-3**（莫兰迪打底）
3. **scenes-gathered-zine-v1-3**（作者最爱，手撕纸 + 结构色高级感）
4. **photo-abstract-editorial**（8 月刚冲榜）
5. **photo-relic-editorial**（最可控）

> 这 9 个仓库与既有「设计相关开源仓库 / 03-案例与项目」的 12 个仓库**完全不重叠**——现有偏 Claude Design 替代品 / 截图转代码 / 设计系统 / UX 规则；本文偏**单图海报 / 美术化转译**。两者互补，不重复。

## 七、模型版本说明

文中提到的 **GPT Image 2** 模型及对应 Skill 效果说明，**⚠️ 仅以发布时（2026-08-23）为准**。模型版本、能力边界、Skill 实现细节可能在后续迭代中发生变化，请以各 Skill 仓库最新 README 与对应模型官方说明为准。
# COC

用来快速查询部落战数据的工具

<!-- vim-markdown-toc GFM -->

- [安装说明](#安装说明)
- [使用说明](#使用说明)
- [文件内容](#文件内容)
- [字典](#字典)
- [代办事项](#代办事项)

<!-- vim-markdown-toc -->

## 安装说明

安装与运行

需要 [nodejs](https://nodejs.org/en)，默认使用 `pnpm` 进行依赖管理。在安装 nodejs 之后可以执行 `npm i -g pnpm` 进行 `pnpm` 的安装。

安装项目依赖：

```bash
pnpm install
```

创建 `.env` 文件

```env
# 部落标签
tag=''

# Token
token=''

# 远程服务器链接
url=''

# 远程服务器端口
port=''

# 邮箱
email=''

# 密码
password=''
```

## 使用说明

以下命令都会将结果写入 result.txt 里面，自行通过编辑器查看

- 日常部落战：`pnpm run cw`
- 日常部落战及参赛人员：`pnpm run cw:all`
- 当前联赛：`pnpm run cwl`
- 指定场次查看联赛 `pnpm run cwl round=2`
- 当前联赛及参赛人员：`pnpm run cwl:all`

## 文件内容

```plain
.
├── bin    # 脚本工具
├── config # 配置文件
├── src    # 远程服务器代码
└── utils  # 工具集合
```

## 字典

部落战状态(state)： `noInWar`, `preparation`, `inWar`, `warEnded`

## 代办事项

- [ ] 服务器接口转发
- [x] 自动登录获取 Token
- [x] 优化统计数据（摧毁率, 进攻对手排名与大本，未完全摧毁的对手）
- [x] 统计结果写入脚本
- [ ] Server 酱推送
- [x] 联赛统计
- [x] 接口排序优化（mapPosition, 联赛补充上场序号）
- [ ] 使用手册
- [x] 优化开发体验（NODE_ENV, env 文件的生成）
- [ ] TS 化

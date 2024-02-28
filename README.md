# COC

用来快速查询部落战数据的工具

<!-- vim-markdown-toc GFM -->

- [文件内容](#文件内容)
- [字典](#字典)
- [代办事项](#代办事项)

<!-- vim-markdown-toc -->

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

- [x] ~~服务器接口转发~~
- [x] 自动登录获取 Token
- [ ] 优化统计数据（摧毁率, 进攻对手排名与大本，未完全摧毁的对手）
- [x] 统计结果写入脚本
- [ ] Server 酱推送
- [x] 联赛统计
- [x] 接口排序优化（mapPosition, 联赛补充上场序号）
- [ ] 使用手册
- [ ] 优化开发体验（NODE_ENV, env文件的生成）

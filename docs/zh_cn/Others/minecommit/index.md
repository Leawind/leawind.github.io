---
title: MineCommit
---

# MineCommit

> [!INFO]
>
> 本模组的作者：[HairlessVillager](https://github.com/HairlessVillager)
>
> 源码：[github.com/HairlessVillager/minecommit](https://github.com/HairlessVillager/minecommit)

MineCommit 是一个把 Minecraft Java 版存档转换为适合 Git 保存的中间表示的工具。它的目标不是让人直接编辑存档，也不是直接把原始存档文件提交到 Git，而是把变化频繁、体积很大的区域文件拆成较稳定的小对象，再交给 Git 的对象去重和增量压缩机制保存。

## 为什么不能直接提交存档

世界的主体数据通常位于 `region/r.<x>.<z>.mca`。一个区域文件最多容纳 32×32 个区块；即使玩家只放置了一个方块，游戏也可能重写包含该区块的整段压缩数据。对 Git 而言，这类大二进制文件既难以显示差异，也难以高效复用相邻版本的内容。

MineCommit 将区域文件解码为 NBT 后，按区块和区块段重组为多个逻辑文件。这样，小范围的世界改动通常只会改变少数 Git blob；跨版本重复出现的方块状态、群系和 NBT 结构也更容易被 Git 的 delta 压缩复用。

```text
Minecraft 存档
  └─ .mca 区域文件 / gzip NBT / 普通文件
         │  解析、解压、排序、拆分
         ▼
MineCommit 的扁平化表示（按处理器分命名空间）
         │  写入文件系统，或写为 Git blob/tree/commit
         ▼
扁平目录或裸 Git 仓库
         │  读取、合并、重新压缩并写回区域文件
         ▼
可加载的 Minecraft 存档
```

## 总体架构：处理器与对象数据库

库的入口是 `minecommit::Config`。它接受存档目录、存储目录，以及额外包含/忽略的 glob 规则，并提供四个相互对应的操作：

| 操作        | 源       | 目标        | 用途                               |
| ----------- | -------- | ----------- | ---------------------------------- |
| `flatten`   | 存档目录 | 普通目录    | 生成可检查的扁平化数据，不使用 Git |
| `unflatten` | 普通目录 | 存档目录    | 从扁平化数据重建存档               |
| `commit`    | 存档目录 | 裸 Git 仓库 | 扁平化并创建 Git 提交              |
| `checkout`  | Git 提交 | 存档目录    | 从指定提交恢复存档                 |

两端都通过 ODB（Object Database，对象数据库）接口访问。该接口只关心以 `/` 分隔的键、读取、写入和 glob 查询，因此处理逻辑无需了解数据究竟在磁盘上还是在 Git 中。

- `LocalFsOdb` 将键映射为普通文件，并在写入时创建父目录；它还会拒绝绝对路径、反斜杠和 `..`，避免键逃逸出根目录。
- `LocalGitOdb` 把每个键的内容写成 Git blob，记录“路径 → blob OID”，再递归创建排序稳定的 tree，最后通过 `git commit-tree` 生成提交。
- 处理器写入时会自动获得自己的前缀，例如 `chunk-region/` 或 `gzip-nbt/`。因此同一个存档相对路径在不同处理策略下不会相互冲突。

Git blob 的读写使用 `gitoxide`，而创建提交、更新分支、解析提交表达式和可选的重新打包仍会调用系统中的 `git` 命令。后续提交从父提交建立路径索引，但会根据当前存档重新生成整棵树；已经删除的源文件也就不会出现在新提交中。

## 处理器流水线

每次转换都会依次运行下列处理器。一个处理器返回它已处理的源路径；`commit` 最终会列出没有被任何处理器处理的文件，便于发现尚不支持的存档内容。

| 命名空间          | 匹配对象                                                     | 扁平化策略                                 |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `chunk-region`    | `**/region/r.*.*.mca`                                        | 拆分地形区块及其 section 数据              |
| `entities-region` | `**/entities/r.*.*.mca`                                      | 按区块保存实体 NBT，并抽取高频坐标数组     |
| `poi-region`      | `**/poi/r.*.*.mca`                                           | 按区块保存兴趣点 NBT                       |
| `raw`             | PNG、JSON、TXT、SNBT、TOML、`session.lock`，以及用户额外模式 | 原样复制                                   |
| `gzip-nbt`        | `**/*.dat`                                                   | gzip 解压、规范化 NBT 后保存               |
| `ignore`          | 用户忽略模式                                                 | 标记为已忽略，避免其出现在未处理文件报告中 |

常规 NBT 在写入前会递归地按复合标签的键名排序；部分顺序无语义但会频繁变化的列表也会被专门排序，例如玩家的配方书和属性、实体的属性。这种规范化会消除无意义的字节差异，让 Git 更集中于实际游戏状态的变化。

## 区域文件如何拆分

`.mca` 文件的前 8 KiB 是位置表和时间戳表，之后是按扇区存放的压缩区块数据。MineCommit 读取位置表，逐个解压 zlib 压缩（压缩类型 2）的区块 NBT；不支持或无法解压的区块会被跳过并记录警告。写回时则重新建立位置表、保留时间戳表，并以 zlib 压缩区块数据。

### 地形区域 `region/`

对每个 `region/r.<x>.<z>.mca`，扁平化表示包含：

```text
chunk-region/
└─ <原始相对路径>.mca/
   ├─ timestamps
   ├─ others.nbt
   └─ sections/
      └─ c.<chunk-x>.<chunk-z>.dump
```

- `timestamps` 保存原始 4096 字节的区域时间戳表，并保存每个已处理区块的 `InhabitedTime` 与 `LastUpdate`。
- `others.nbt` 按 `c.<x>.<z>` 汇总各区块中除 `sections` 外的 NBT；其中 `InhabitedTime`、`LastUpdate` 已移入 `timestamps`。
- 每个 `*.dump` 对应一个完整生成的区块，保存其所有 section 的方块和群系信息。

section 是 16×16×16 的方块体积、4×4×4 的群系体积。原始格式中，每个 section 都有自己的方块状态和群系调色板，并以压缩 long 数组存储索引。MineCommit 先扫描一个区块内的所有 section，把相同的方块状态（名称和属性）与群系名称合并为区块级调色板；再将索引展开为固定大小的数据：每 section 4096 个方块索引和 64 个群系索引。恢复时会根据每个 section 实际使用的条目重新建立局部调色板并打包索引。

这种做法的关键是：相邻 section 不再各自携带重复的调色板，而方块位置的改变仍局限在对应区块的 dump 中。区块 NBT 的 `isLightOn` 会在拆分时设为 `false`，让游戏在恢复后按需要重新处理光照。

### 实体与兴趣点区域

实体区域和兴趣点区域同样按区块拆开，并各自保存原始时间戳表。

- 实体区域的 `entities.nbt` 内含按坐标索引的 `Chunks`。实体的 `Motion`、`Pos` 与 `Rotation` 会从各实体记录中取出并汇总为扁平数组；恢复时再按照实体顺序分配回去。这样可减小大量重复字段带来的结构噪声。
- 兴趣点区域将每个区块写为 `c.<x>.<z>.nbt`，并保存 `timestamp-header`。其 NBT 经过键排序，但不做地形 section 那样的专门拆分。

## `.dat` 与普通文件

`*.dat` 文件通常是 gzip 包装的 NBT，例如 `level.dat` 和玩家数据。`gzip-nbt` 处理器会解压、进行 NBT 规范化（包括若干已知无序列表），把未压缩 NBT 保存到中间表示；恢复时再用 gzip 压缩写回原路径。

图片、JSON、文本、SNBT、TOML 和 `session.lock` 由 `raw` 处理器直接复制。对于模组添加的其他可安全原样保存的文件，可通过额外 glob 模式纳入处理；未匹配的文件会在提交后报告为 skipped，避免静默丢失。

## 提交与恢复流程

以 `minecommit commit <save> <bare-git-dir> --branch main` 为例：

1. CLI 用 `git rev-parse` 检查分支，决定父提交；首次提交需使用 `--init`。
2. 每个处理器从存档读数据，向 Git ODB 写入扁平化后的 blob。区块处理、并行读写和 tree 构建会使用 `rayon` 并行化。
3. ODB 根据写入路径构造 tree，调用 `git commit-tree` 创建提交，再以 `git update-ref` 将分支指向新提交。
4. 可选的 `--repack` 会调用 Git 将松散对象重新打包。

恢复时，`checkout` 以指定提交建立只读 Git ODB，处理器按注册顺序读取各自的命名空间，重建区域文件、普通文件和 gzip NBT。CLI 在恢复前会将已有存档目录改名为同级的 `.bak`，为原存档保留一份备份。

## 还原保证与边界

MineCommit 保存的是可以重建世界数据的结构化表示，而不是原始文件的逐字节副本。重新压缩后，`.mca` 与 `.dat` 的字节序列、区块扇区布局和部分 NBT 标签排列可能与备份前不同；但恢复流程会重建区域坐标、时间戳、区块 NBT、section 调色板以及实体/兴趣点数据，目标是让 Minecraft 能以等价的游戏语义加载它。

因此，更适合将它视作世界状态的版本控制与备份工具。使用前仍建议退出世界或确保存档未被游戏同时写入，并在第一次用于含大量模组数据的存档时检查命令报告的 skipped 文件。

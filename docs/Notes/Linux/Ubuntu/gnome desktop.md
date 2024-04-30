# Ubuntu 桌面

## 参考

[GNOME 桌面系统管理指南](https://help.gnome.org/admin//system-admin-guide/2.32/index.html.zh_CN)

## 应用入口

参考 [Desktop Entry Files](https://help.gnome.org/admin//system-admin-guide/2.32/menustructure-desktopentry.html.en)

使用 .desktop 文件定义应用入口。

### 存放位置

.desktop 文件的存放路径

-   `/usr/share/applications/` 通常由系统管理，不建议直接修改
-   `/usr/local/share/applications/` 所有用户可见
-   `~/.local/share/applications/` 仅当前用户可见

可执行文件的存放路径

-   `~/.local/bin/`
-   `/usr/local/bin/`

图标文件

-   `/usr/local/share/icons/`
-   `~/.local/share/icons/`

### 文件格式

模板：

```ini
[Desktop Entry]
# 在菜单中的显示名称
Name=template
# 描述，可用于搜索
Comment=Template of Desktop entry
# 是否隐藏
NoDisplay=?false
# 类型，详见后面的列表
Type=Application
# ?
GenericName=?Hibernate desktop
# 此文件的编码
Encoding =?
# 类别，可以自定义
Categories=Application
# 执行的命令，不能引用环境变量
Exec=top
MimeType =? 该应用能处理的MIME类型
# 图标路径
Icon=
# 是否显示终端界面
Terminal=true
```

其中 Type 的值有 4 种选项

-   **Application** 启动一个应用
-   **Link** 链接一个文件、目录，或远程资源（例如 FTP 站点，网页，Windows share 等）
-   **FSDevice** 一个文件系统设备
-   **Directory** 一个目录

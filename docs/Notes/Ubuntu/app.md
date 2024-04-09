# 应用

## .dep

安装

```sh
sudo dpkg -i microsoft-edge-stable_121.0.2277.128-1_amd64.deb
```
## .AppImage

AppImage 无需安装即可运行。

赋予权限

```sh
mkdir ~/AppImages
cd ~/AppImages
chmod a+x ./*.AppImage
```

直接执行即可
```sh
./modrinth-app_0.6.3_amd64.AppImage
```

添加桌面入口

`~/.local/share/applications/example.desktop`

```sh
[Desktop Entry]
Type=Application
Name=Modrinth
Exec=/home/leawind/AppImages/modrinth-app_0.6.3_amd64.AppImage %u
Terminal=false
MimeType=x-scheme-handler/modrinth;
NoDisplay=true
```

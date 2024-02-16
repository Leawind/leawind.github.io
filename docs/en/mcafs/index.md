# MCAFS 

By providing an FTP service, you can access resource files in the `.minecraft/assets` directory.

[MCAFS npm package](https://www.npmjs.com/package/mcafs)


## Meow?

Some Minecraft resource files, such as music, sound effects, and language files, are stored in `.minecraft/assets`. However, the organization of these files makes it difficult to access them directly.

Through the FTP service provided by this project, you can easily access resources in `.minecraft/assets`.

## Installation

```bash
$> npm install mcafs
```

Or

```bash
$> git clone https://github.com/LEAWIND/mcafs.git
$> cd mcafs
$> npm install
```

## Usage

```bash
$> mcafs -u localhost:2023
```

Example Output

```bash
$> mcafs -u localhost:2023
[2023-10-05T12:24:32.942] [INFO] MCAFS - Minecraft Assets Directory: C:\Users\LEAWIND\AppData\Roaming\.minecraft\assets
[2023-10-05T12:24:32.983] [INFO] MCAFS - FTP Server is starting at ftp://localhost:2023/
```

Access `ftp://localhost:2023` using any FTP client.

## Command Line Options

| Flags                        | Default                   | Description                                                        | Options                                         |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| -v --version                 |                           | Display version number                                            |                                                 |
| -h --help                    |                           | Display command help                                               |                                                 |
| -d --assertsDir \<assetsDir> | Default .minecraft/assets location | Customize the assets location                                  |                                                 |
| -u --url \<url>              |                           | URL, for example, ftp://0.0.0.0:2023. If specified, the addr and port options will be ignored. |                                                 |
| -a --addr \<addr>            | 127.0.0.1                 | IP address                                                         |                                                 |
| -p --port \<port>            | 21                        | FTP port number                                                    |                                                 |
| -l --logLevel \<logLevel>    | info                      | Log level                                                          | all,trace,debug,info,warn,error,fatal,mark,off |

## Introduction to Minecraft Assets System

There are many resource files (including music, sound effects, language translations, etc.) that are the same between different versions of Minecraft, such as the music files for C418-cat records that exist in many versions.

If a player has to download all the resource files used in a new version every time they install a new version, it would be a significant waste of network and disk resources to store them on the hard drive again.

So, Minecraft's solution is to use a unified virtual file system to store these resource files.

The `indexes/` directory contains several index files, each representing a file collection. Each index file contains information such as the virtual path, hash, and file size for each file in that collection.

For example, part of the content of `1.10.json` is as follows:

```json
{
	"objects": {
		"icons/icon_32x32.png": {
			"hash": "92750c5f93c312ba9ab413d546f32190c56d6f1f",
			"size": 5362
		},
		"icons/minecraft.icns": {
			"hash": "991b421dfd401f115241601b2b373140a8d78572",
			"size": 114786
		},
		"minecraft/icons/icon_16x16.png": {
			"hash": "bdf48ef6b5d0d23bbb02e17d04865216179f510a",
			"size": 3665
		}
	}
}
```

Through the FTP service provided by MCAFS, you can access the file with a size of 5362 bytes in the example using `/1.10/icons/icon_32x32.png`.

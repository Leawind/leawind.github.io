# Python tips

## 导出依赖包

导出当前环境所有依赖包
```sh
pip freeze > requirements.txt
```

## 解析URL

```py
from urllib.parse import urlparse

url = urlparse("http://www.baidu.com")
```

## 毫秒时间戳与 datetime 互相转换

### 时间戳 -> datetime

```py
def timestamp2datetime(time_ms):
	return datetime.datetime.fromtimestamp(time_ms / 1e3)
```

### datetime -> 时间戳

```py
def datetime2timestamp(dt):
	return int(dt.timestamp() * 1e3)
```

## 读取图像

### `cv2.imread` 直接读取图像文件，得到数组类型
文档： https://docs.opencv.org/4.x/d4/da8/group__imgcodecs.html#gab32ee19e22660912565f8140d0f675a8

```py
cv2.imread(path:str, flags:int) -> np.ndarray
```

示例
```py
cv2.imread(f"./input/{DIR}/1.png", flags=cv2.IMREAD_COLOR).shape
```

### `PIL.Image.open` 读取图像文件，得到 PIL.Image 对象

```py
Image.open(path:str).convert('RGB') -> Image
```
### 将 `PIL.Image` 对象转换为 numpy 数组

```py
np.array(img)
```

#### flags 参数
* `IMREAD_COLOR`
* `IMREAD_GRAYSCALE`
* `IMREAD_REDUCED_COLOR`
* `IMREAD_REDUCED_GRAYSCALE`

## 多线程

写nm博客，生产赛博垃圾。

https://docs.python.org/zh-cn/3.7/library/threading.html

直接查官方文档多好，准确 详细 简洁。

### 示例

```py
threading.Thread(None, target=self.serve_forever, name="api-server", args=())
```

## Pickle 序列化/反序列化

`import pickle`

```py
with open('data.pickle', 'wb') as f:
	pickle.dump(data, f)
```

```py
with open('data.pickle', 'rb') as f:
	data = pickle.load(f)
```

# Python tips

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

## MD5 摘要

```py
import hashlib
def md5(sou):
	return hashlib.md5(bytes(sou, encoding='utf8')).hexdigest()
```

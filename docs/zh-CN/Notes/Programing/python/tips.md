# Python tips

## 毫秒时间戳与 datetime 互相转换

### 时间戳 -> datetime

```python
def timestamp2datetime(time_ms):
    return datetime.datetime.fromtimestamp(time_ms / 1e3)
```

### datetime -> 时间戳

```python
def datetime2timestamp(dt):
	return int(dt.timestamp() * 1e3)
```

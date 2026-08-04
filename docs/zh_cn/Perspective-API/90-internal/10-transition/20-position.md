---
title: 位置
---

# 位置

设相机位置为三维向量 $\mathbf p$，过渡开始时的位置为 $\mathbf p_0$，第 $k$ 帧的目标位置为 $\mathbf p_T^{(k)}$，对应进度为 $p_k$。

## 固定起点插值

固定起点算法保存 $\mathbf p_0$，每次将它与当前目标位置做线性插值：

$$
\mathbf p_k = (1-p_k)\mathbf p_0 + p_k\mathbf p_T^{(k)}
$$

当 $\mathbf p_T^{(k)}$ 为常量时，$\mathbf p_k$ 是起点与目标之间的线段参数化；目标变化时，仅将当前帧目标代入同一公式。

## 前馈加误差修正

前馈加误差修正算法先将目标的帧间位移直接施加到上一帧相机位置，再修正剩余误差。令上一帧相机位置为 $\mathbf p_{k-1}$，先计算：

$$
\Delta\mathbf p_T = \mathbf p_T^{(k)} - \mathbf p_T^{(k-1)},
\qquad
\mathbf p_k' = \mathbf p_{k-1} + \Delta\mathbf p_T
$$

然后计算临时位置与当前目标之间的误差：

$$
\mathbf e_k = \mathbf p_T^{(k)}-\mathbf p_k'
$$

修正比例是本帧进度增量占上一帧剩余进度的比例：

$$
c_k = \frac{p_k-p_{k-1}}{1-p_{k-1}}
$$

将 $c_k$ 限制在 $[0,1]$ 后，最终位置为：

$$
\mathbf p_k=\mathbf p_k' + c_k\mathbf e_k
$$

当 $p_k=1$ 时，$c_k=1$，因此 $\mathbf p_k=\mathbf p_T^{(k)}$。目标静止时，该递推与固定起点插值相同；目标变化时，$\Delta\mathbf p_T$ 体现目标的帧间位移，误差项则逐步改变剩余位置差。

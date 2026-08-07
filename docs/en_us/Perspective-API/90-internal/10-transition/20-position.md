---
title: Position
---

# Position

Let the camera position be the three-dimensional vector $\mathbf p$, the position at the start of the transition be $\mathbf p_0$, and the $k$-th frame's target position be $\mathbf p_T^{(k)}$, with corresponding progress $p_k$.

## Fixed-start interpolation

The fixed-start algorithm saves $\mathbf p_0$ and linearly interpolates it with the current target position each time:

$$
\mathbf p_k = (1-p_k)\mathbf p_0 + p_k\mathbf p_T^{(k)}
$$

When $\mathbf p_T^{(k)}$ is constant, $\mathbf p_k$ parameterizes the line segment between the start and the target; when the target changes, only the current frame's target is substituted into the same formula.

## Feed-forward with error correction

The feed-forward-with-error-correction algorithm first applies the target's inter-frame displacement directly to the previous frame's camera position, then corrects the remaining error. Let the previous frame's camera position be $\mathbf p_{k-1}$. First compute:

$$
\Delta\mathbf p_T = \mathbf p_T^{(k)} - \mathbf p_T^{(k-1)},
\qquad
\mathbf p_k' = \mathbf p_{k-1} + \Delta\mathbf p_T
$$

Then compute the error between the temporary position and the current target:

$$
\mathbf e_k = \mathbf p_T^{(k)}-\mathbf p_k'
$$

The correction ratio is the share of this frame's progress increment in the previous frame's remaining progress:

$$
c_k = \frac{p_k-p_{k-1}}{1-p_{k-1}}
$$

After clamping $c_k$ to $[0,1]$, the final position is:

$$
\mathbf p_k=\mathbf p_k' + c_k\mathbf e_k
$$

When $p_k=1$, $c_k=1$, so $\mathbf p_k=\mathbf p_T^{(k)}$. When the target is stationary, the recurrence is the same as fixed-start interpolation; when the target changes, $\Delta\mathbf p_T$ carries the target's inter-frame displacement, while the error term gradually changes the remaining positional difference.

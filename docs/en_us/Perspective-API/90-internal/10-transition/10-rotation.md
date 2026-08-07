---
title: Rotation
---

# Rotation

Rotation is represented by the unit quaternion $q$. The quaternions $q$ and $-q$ represent the same orientation; spherical interpolation takes the representation with a non-negative dot product to pick the short arc between them.

## Spherical linear interpolation

Spherical linear interpolation (slerp) is used between two unit quaternions:

$$
\operatorname{slerp}(q_a,q_b,\lambda)
= q_a\left(q_a^{-1}q_b\right)^\lambda,
\qquad \lambda\in[0,1]
$$

It moves along the short arc on the unit-quaternion sphere. If $\lambda$ varies linearly with time, the rotation angle varies linearly along that arc.

## Chasing the target

The chase algorithm uses the previous frame's output $q_{k-1}$ as the interpolation start and rotates toward the $k$-th frame's target $q_T^{(k)}$:

$$
q_k=\operatorname{slerp}\left(q_{k-1},q_T^{(k)},c_k\right)
$$

where:

$$
c_k=\frac{p_k-p_{k-1}}{1-p_{k-1}}
$$

and $c_k$ is clamped to $[0,1]$.

If the target stays unchanged, the recurrence is equivalent to:

$$
q_k=\operatorname{slerp}(q_0,q_T,p_k)
$$

When the target is unchanged, the recurrence reduces to a single spherical interpolation from $q_0$ to $q_T$; when the target changes, each interpolation ends at the current frame's $q_T^{(k)}$.

## Feed-forward with error correction

The feed-forward-with-error-correction algorithm first applies the target's inter-frame rotation, then corrects the difference between the camera and the current target. Let:

$$
\Delta q_T=q_T^{(k)}\left(q_T^{(k-1)}\right)^{-1}
$$

where $\Delta q_T$ is the increment from the previous frame's target rotation to the current frame's target rotation. First obtain:

$$
q_k'=\Delta q_T q_{k-1}
$$

Then correct toward the current target using $c_k$ from the chase algorithm:

$$
q_k=\operatorname{slerp}\left(q_k',q_T^{(k)},c_k\right)
$$

When the target is stationary, $\Delta q_T$ is the identity quaternion and the algorithm reduces to spherical interpolation of the current error; when the target changes, $\Delta q_T$ first changes the camera orientation, and the second spherical interpolation corrects the remaining error.

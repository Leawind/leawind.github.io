---
title: Camera State Transition Algorithm
---

# Overview

When perspectives are switched, the continuous parts of the camera state transition from the state at the moment of the switch to the target state within a fixed duration. Position, rotation, FOV, and orthographic view height may use mutually independent algorithms. Projection mode is a discrete state and directly uses the target value.

## Time and progress

Let the transition duration be $D$ and the start time be $t_0$. At time $t$, first compute the normalized time:

$$
u = \operatorname{clamp}\left(\frac{t - t_0}{D}, 0, 1\right)
$$

Then apply the easing function $\phi$ to obtain the actual progress:

$$
p = \operatorname{clamp}\left(\phi(u), 0, 1\right)
$$

The easing function describes how time is allocated across the transition window. It can be a linear function, a smooth curve, or any other function that satisfies the progress constraints; the specific curve only changes how the progress varies over time, not the state formulas of each algorithm. The same $p$ is used by every continuous-field algorithm; therefore they share the fixed transition start and end times but do not have to share the same trajectory.

When $D=0$ or $t-t_0\geq D$, the continuous fields are directly equal to the target state.

## Shared goal of the algorithms

Let $x_0$ be the starting state at the moment of the switch and $x_T(t)$ the current target state. If the target does not change during the transition, all algorithms satisfy:

$$
x(0)=x_0, \qquad x(D)=x_T
$$

The target state may also keep changing, for example player movement changes position and mouse input changes orientation.

## Continuous and discrete states

Position, rotation, FOV, and orthographic view height are continuous states that can transition smoothly. Projection mode is a discrete choice and cannot be numerically interpolated between perspective and orthographic projection; it becomes the target mode immediately at the switch. Orthographic view height remains a continuous scalar and can therefore vary smoothly on its own.

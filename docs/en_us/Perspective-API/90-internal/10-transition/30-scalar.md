---
title: FOV and Orthographic View Height
---

# FOV and Orthographic View Height

FOV and orthographic view height are both scalars. Let the start value be $s_0$, the current target value be $s_T$, and the transition progress be $p\in[0,1]$. Both use linear interpolation from a fixed start:

$$
s=(1-p)s_0+ps_T
$$

Therefore FOV and orthographic view height each take the start value at $p=0$ and the target value at $p=1$. The easing function only changes how fast the progress $p$ varies over time; it does not change this numerical interpolation formula.

FOV controls how wide the perspective projection's field of view is; orthographic view height controls the height of the visible area in orthographic projection. Their numerical transitions are independent of each other and of the discrete projection-mode switch: even if the projection mode changes immediately, orthographic view height can still transition smoothly according to the formula above.

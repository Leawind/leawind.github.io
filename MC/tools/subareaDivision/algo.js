function solve3D_r(N, x0, y0, z0, x1, y1, z1, indentCount = 0, dolog = true) {
	const log = dolog ? console.log : () => {};
	// 此算法所得未必是最优解，只是比较接近最优解而已。
	let indents = "\t".repeat(indentCount);
	log(`${indents}N=${N}, P0:(${x0}, ${y0}, ${z0}), P1:(${x1}, ${y1}, ${z1})`);
	[x0, x1] = [x0, x1].sort((a, b) => a - b);
	[y0, y1] = [y0, y1].sort((a, b) => a - b);
	[z0, z1] = [z0, z1].sort((a, b) => a - b);
	let DX = x1 - x0,
		DY = y1 - y0,
		DZ = z1 - z0,
		V = DX * DY * DZ;
	log(`${indents}Total Size: ${DX} * ${DY} * ${DZ} = ${V}`);

	let result = [];
	if (V === 0) {
	} else if (V <= N) {
		result.push([x0, y0, z0, x1, y1, z1]);
	} else {
		// 找到合适的腹部划分方法们
		// 找到所有使浪费最小的组合们
		let thriftiests = [];
		let waste_min = Infinity;
		for (let dx = Math.min(DX, N); dx >= 1; dx--) {
			let dydz = Math.floor(N / dx);
			for (let dy = Math.min(DY, dydz); dy >= 1; dy--) {
				let dz = Math.floor(dydz / dy);
				if (dz <= DZ) {
					let waste = N - dx * dy * dz;
					if (waste < waste_min) {
						waste_min = waste;
						thriftiests = [[dx, dy, dz]];
					} else if (waste === waste_min) {
						thriftiests.push([dx, dy, dz]);
					}
				}
			}
		}

		// 根据实验，似乎当腹部子区域接近正立方体时，最终子区域数量会比较小。
		// 找到最接近正立方体的组合们 (dx+dy+dz 最小)
		let squarests = [];
		let sxyz_min = Infinity;
		for (let dxyz of thriftiests) {
			let sxyz = dxyz[0] + dxyz[1] + dxyz[2];
			if (sxyz < sxyz_min) {
				sxyz_min = sxyz;
				squarests = [dxyz];
			} else if (sxyz === sxyz_min) {
				squarests.push(dxyz);
			}
		}
		// 分别计算各种组合的子区域数量
		let results = [];
		let n_min = Infinity;
		for (let dxyz of squarests) {
			let res = solveBy(...dxyz);
			let n = res.length;
			if (n < n_min) {
				n_min = n;
				results = [res];
			} else if (n === n_min) {
				results.push(res);
			}
		}
		result = results[0];
	}
	let sumV = 0;
	for (let a of result) {
		sumV += Math.abs((a[3] - a[0]) * (a[4] - a[1]) * (a[5] - a[2]));
	}
	log(`${indents}Total size of subareas = ${sumV}`);
	log(`${indents}Subareas count = ${result.length}`);
	return result;

	function solveBy(dx, dy, dz) {
		log(`${indents}Body: ${dx} * ${dy} * ${dz} = ${dx * dy * dz}`);
		let subareas = [];
		// 填充腹部
		for (let x = x0; x <= x1 - dx; x += dx) {
			for (let y = y0; y <= y1 - dy; y += dy) {
				for (let z = z0; z <= z1 - dz; z += dz) {
					subareas.push([x, y, z, x + dx, y + dy, z + dz]);
				}
			}
		}
		// 计算头的尺寸和大小
		let headDX = DX % dx,
			headDY = DY % dy,
			headDZ = DZ % dz;
		log(`${indents}Head: ${headDX} * ${headDY} * ${headDZ} = ${headDX * headDY * headDZ}`);

		// yz
		if (headDX) subareas = subareas.concat(solve3D_r(N, DX - headDX, 0, 0, DX, DY - headDY, DZ - headDZ, indentCount + 1, dolog));
		// 将 xz 面与 x肢、z肢、头 合并
		if (headDY) subareas = subareas.concat(solve3D_r(N, 0, DY - headDY, 0, DX, DY, DZ, indentCount + 1, dolog));
		// 将 xy 面与 y肢 合并
		if (headDZ) subareas = subareas.concat(solve3D_r(N, 0, 0, DZ - headDZ, DX, DY - headDY, DZ, indentCount + 1, dolog));

		return subareas;
	}
}

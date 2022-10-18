(() => {
	let Es = {
		cmds: document.querySelectorAll("#commands")[0],
		errs: document.querySelectorAll("#errors")[0],
		opts: document.querySelectorAll("#outputs")[0],
	};

	if ("inputs" in localStorage) {
		Es.cmds.value = localStorage.inputs;
	} else {
		Es.cmds.value = "";
	}

	Es.opts.value = convert(Es.cmds.value);
	resize(Es.cmds);
	resize(Es.errs);
	resize(Es.opts);

	Es.cmds.addEventListener("input", (e) => {
		Es.opts.value = convert(e.target.value);
		resize(Es.cmds);
		resize(Es.opts);
		resize(Es.errs);
		localStorage.inputs = e.target.value;
	});

	function resize(ele) {
		let lines = ele.value.split("\n");
		ele.style.height = `${lines.length * 1.2 + 1}em`;
	}

	function convert(cmds) {
		let lines = cmds.split("\n");
		let res = [];
		let isSuccess = true;
		try {
			for (let line of lines) {
				line = line.trim();
				cmd = line.split(/\s+/g);
				if (cmd.length >= 7 && /^\/?fill.*/.test(cmd[0])) {
					let [x0, y0, z0, x1, y1, z1] = cmd.slice(1, 7).map((x) => Math.floor(x.replace(/~/g, "") * 1));
					x1++;
					y1++;
					z1++;
					let restargs = cmd.slice(7).join(" ");
					let subareas = solve3D_r(32768, x0, y0, z0, x1, y1, z1, 0, false);
					for (let subarea of subareas) {
						let [x0, y0, z0, x1, y1, z1] = subarea;
						x1--;
						y1--;
						z1--;
						res.push(`${cmd[0]} ${x0} ${y0} ${z0} ${x1} ${y1} ${z1} ${restargs}`);
					}
				} else if (cmd.length >= 10 && /^\/?clone.*/.test(cmd[0])) {
					let [x0, y0, z0, x1, y1, z1, dx, dy, dz] = cmd.slice(1, 10).map((x) => Math.floor(x.replace(/~/g, "") * 1));
					x1++;
					y1++;
					z1++;

					[x0, x1] = [x0, x1].sort((a, b) => a - b);
					[y0, y1] = [y0, y1].sort((a, b) => a - b);
					[z0, z1] = [z0, z1].sort((a, b) => a - b);

					let restargs = cmd.slice(10).join(" ");
					let subareas = solve3D_r(32768, x0, y0, z0, x1, y1, z1, 0, false);
					for (let subarea of subareas) {
						subarea[3]--;
						subarea[4]--;
						subarea[5]--;
						let [nx0, ny0, nz0, nx1, ny1, nz1] = subarea;
						let [ndx, ndy, ndz] = [nx0 - x0 + dx, ny0 - y0 + dy, nz0 - z0 + dz];
						res.push(`${cmd[0]} ${nx0} ${ny0} ${nz0} ${nx1} ${ny1} ${nz1} ${ndx} ${ndy} ${ndz} ${restargs}`);
					}
				} else {
					res.push(line);
				}
			}
		} catch (e) {
			Es.errs.value = `Error:\n`;
			Es.errs.value += e.message;
			Es.errs.value += e.stack;
			isSuccess = false;
		}
		Es.errs.style.display = isSuccess ? "none" : "block";

		return res.join("\n");
	}
})();

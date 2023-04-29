
const SuperHttpApiClient = {
	_test: async () => {
		let shac = SuperHttpApiClient;
		console.log(await shac.exec('getcwd'));
		console.log(await shac.exec('argv'));
		console.log(await shac.exec('memoryUsage'));
		console.log(await shac.exec('cpus'));
		console.log(await shac.exec('listdir', { path: './' }));
		console.log(await shac.exec('listdirFiles', { path: './' }));
		console.log(await shac.exec('listdirDirs', { path: './' }));
		console.log(await shac.exec('readFile', { path: './readme.md' }));
		// console.log(await shac.exec('writeFile', {
		// 	path: './test.txt',
		// 	data: btoa("Hello world!!!"),
		// }));
	},
	exec: async (apiName, args) => {
		let r = await fetch(`/superapi/${apiName}`, {
			method: "POST",
			body: JSON.stringify(args),
		});
		r = await r.json();
		return r;
	},

};

const SuperApi = {
	getcwd: async () => await
		SuperHttpApiClient.exec('getcwd'),
	argv: async () => await
		SuperHttpApiClient.exec('argv'),
	memoryUsage: async () => await
		SuperHttpApiClient.exec('memoryUsage'),
	cpus: async () => await
		SuperHttpApiClient.exec('cpus'),
	exit: async (exitCode = 1) =>
		await SuperHttpApiClient.exec('exit', { exitCode: exitCode }),

	exists: async (fpath) => await SuperHttpApiClient.exec('exists', { path: fpath }),
	isfile: async (fpath) => await SuperHttpApiClient.exec('isfile', { path: fpath }),
	isdir: async (fpath) => await SuperHttpApiClient.exec('isdir', { path: fpath }),
	listdir: async (fpath) => await SuperHttpApiClient.exec('listdir', { path: fpath }),
	listdirFiles: async (fpath) => await SuperHttpApiClient.exec('listdirFiles', { path: fpath }),
	listdirDirs: async (fpath) => await SuperHttpApiClient.exec('listdirDirs', { path: fpath }),

	readFile: async (fpath, decodeBase64 = true) => {
		let r = await SuperHttpApiClient.exec('readFile', { path: fpath });
		return decodeBase64 ? atob(r.data) : r.data;
	},
	writeFile: async (fpath, fdata) =>
		await SuperHttpApiClient.exec('writeFile', {
			path: fpath,
			fdata: btoa(fdata),
		}),

};

export { SuperHttpApiClient, SuperApi };

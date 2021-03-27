window.addEventListener('load', ()=>{
	var nj = numjs;
	var IMG = document.getElementsByTagName('img');
	
	b = nj.imread(IMG[0], mode='L');
	blur_33 = new nj.Mat([
		[1/9, 1/9, 1/9],
		[1/9, 1/9, 1/9],
		[1/9, 1/9, 1/9],
	])
	blur_55 = new nj.Mat([
		[1/25, 1/25, 1/25, 1/25, 1/25],
		[1/25, 1/25, 1/25, 1/25, 1/25],
		[1/25, 1/25, 1/25, 1/25, 1/25],
		[1/25, 1/25, 1/25, 1/25, 1/25],
		[1/25, 1/25, 1/25, 1/25, 1/25],
	])
	blur_gs = new nj.Mat([
		[1/16, 2/16, 1/16],
		[2/16, 4/16, 2/16],
		[1/16, 2/16, 1/16],
	])
	sharp_3 = new nj.Mat([
		[-1, -1, -1],
		[-1, 9, -1],
		[-1, -1, -1],
	])
	sharp_5 = new nj.Mat([
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
		[-1, -1, 25, -1, -1],
		[-1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1],
	])

	edge_3 = new nj.Mat([
		[-1, -1, -1],
		[-1, 8, -1],
		[-1, -1, -1],
	])
	edge_5d = new nj.Mat([
		[ 0  ,-0.5,-1  ,-0.5, 0  ],
		[-0.5,-1  ,-1  ,-0.5,-1  ],
		[-1  ,-1  ,15  ,-1  ,-1  ],
		[-0.5,-1  ,-1  ,-0.5,-1  ],
		[ 0  ,-0.5,-1  ,-0.5, 0  ],
	])
	prewitt_3L = new nj.Mat([
		[-1, 0, 1],
		[-1, 0, 1],
		[-1, 0, 1],
	])
	prewitt_3RT = new nj.Mat([
		[ 0, 1, 1],
		[-1, 0, 1],
		[-1, -1, 0],
	])
	sobel_3T = new nj.Mat([
		[ 1, 2, 1],
		[ 0, 0, 0],
		[-1,-2,-1],
	])
	laplace_33_4 = new nj.Mat([
		[ 0, 1, 0],
		[ 1,-4, 1],
		[ 0, 1, 0],
	])
	laplace_33_8 = new nj.Mat([
		[ 1, 1, 1],
		[ 1,-8, 1],
		[ 1, 1, 1],
	])
	loG_5 = new nj.Mat([
		[0, 0, 1, 0, 0],
		[0, 1, 2, 1, 0],
		[1, 2,-16,2, 1],
		[0, 1, 2, 1, 0],
		[0, 0, 1, 0, 0],
	])
	b_blur33 = nj.conv2d(blur_33, b, step=1);
	b_blur33.show('blur 3*3');
	
	b_blurgs = nj.conv2d(blur_gs, b, step=1);
	b_blurgs.show('blur gs 3*3')
	
	b_blur55 = nj.conv2d(blur_55, b, step=1);
	b_blur55.show('blur 5*5');

	b_sp3 = nj.conv2d(sharp_3, b, step=1);
	b_sp3.show('sharp 3*3')

	b_sp5 = nj.conv2d(sharp_5, b, step=1);
	b_sp5.show('sharp 5*5')

	b_eg3 = nj.conv2d(edge_3, b, step=1);
	b_eg3.show('edge 3*3');

	b_eg5d = nj.conv2d(edge_5d, b, step=1);
	b_eg5d.show('edge 5*5');
	
	b_pw3L = nj.conv2d(prewitt_3L, b, step=1);
	b_pw3L.show('prewitt 3*3 L');

	b_pw3RT = nj.conv2d(prewitt_3RT, b, step=1);
	b_pw3RT.show('prewitt 3*3 RT');
	
	b_sb3T = nj.conv2d(sobel_3T, b, step=1);
	b_sb3T.show('sobel 3T');
	
	b_lp_33_4 = nj.conv2d(laplace_33_4, b, step=1);
	b_lp_33_4.show('laplace 3*3, 4');

	b_lp_33_8 = nj.conv2d(laplace_33_8, b, step=1);
	b_lp_33_8.show('laplace 3*3, 8');
	
	b_loG_5 = nj.conv2d(loG_5, b, step=1);
	b_loG_5.show('LoG 5*5');

})
var IMG = document.getElementsByTagName('img');

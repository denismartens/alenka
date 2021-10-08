export const BUCKET_URL = 'https://s3.amazonaws.com/www.alenamartens.com/';

const S3Service = {
	init: () => {
		// AWS.config.region = REGION;
		// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		// 	IdentityPoolId: IDENTITY_POOL_ID,
		// });
		// s3 = new AWS.S3({
		// 	params: {Bucket: BUCKET_NAME}
		// });
	},
	listImages: async (prefix, marker='', maxKeys=1000) => {
		const promise = new Promise(function(resolve, reject) {
			const request = new XMLHttpRequest();
			const url = BUCKET_URL.concat(
				'?prefix=',prefix,'&encoding-type=url','&marker=',marker,'&max-keys=',maxKeys);
			request.open('GET', url);
			request.responseType = 'document';
			request.onload = function() {
				if (request.status == 200) {
					resolve(request.response);
				} else {
					console.log(request.statusText);
					return [];
				}
			}
			request.onerror = function() {
				console.log('Cannot list objects');
				return [];
			}
			request.send(null);

		});
		return promise
		.then(response => {
			const keys = Array.from(response.getElementsByTagName('Contents'))
				.filter(i => BigInt(i.querySelector('Size').textContent) > 0)
				.map(i => BUCKET_URL.concat(i. querySelector('Key').textContent));
			return keys;
		})
		.catch(err => {
			console.log(err);
			return [];
		});
	},
	loadImages: async (prefix, marker='', maxKeys=1000, sizes='100vw') => {
		return S3Service.listImages(prefix, marker, maxKeys)
		.then(keys => {
			const images = keys.map(src => S3Service.createImageElement(src, sizes));
			return Promise.allSettled(images.map(img => img.decode()))
			.then(() => {
				return images;
			})
			.catch(err => {
				console.log(err);
				return [];
			});
		});
	},
	loadImage: async (src, sizes='100vw') => {
		const img = S3Service.createImageElement(src, sizes)
		await img.decode();
		return img;
	},
	buildImgSrcSet: (name) => {
		if (name.includes('/lg/')) {
			return [
				name.concat(' 2000w'),
				name.replace('/lg/', '/md/').concat(' 1000w'),
				name.replace('/lg/', '/sm/').concat(' 800w'),
				name.replace('/lg/', '/xs/').concat(' 600w')
			].join(', ');
		} else if (name.includes('/tl-lg/')) {
			return [
				name.concat(' 600w'),
				name.replace('/tl-lg/', '/tl-md/').concat(' 400w'),
				name.replace('/tl-lg/', '/tl-sm/').concat(' 200w'),
				name.replace('/tl-lg/', '/tl-xs/').concat(' 100w')
			].join(', ');
		} else {
			return '';
		}
	},
	createImageElement: (src, sizes='100vw') => {
		const img = new Image();
		if (!src.startsWith(BUCKET_URL)) {
			src = BUCKET_URL.concat(src);
		}
		img.srcset = S3Service.buildImgSrcSet(src);
		img.src = src;
		img.sizes = sizes;
		const splitPath = src.split('/').reverse();
		img.dataset.basename = splitPath[0];
		img.dataset.prefix = src.replace(BUCKET_URL, '').replace(splitPath[0], '');
		img.dataset.portfolio = img.dataset.prefix.split('/')[1];
		return img;
	}
}

export default S3Service;
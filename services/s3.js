export const BUCKET_URL = 'https://s3.amazonaws.com/www.alenamartens.com';

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
	listImages: async (prefix) => {
		const promise = new Promise(function(resolve, reject) {
			const request = new XMLHttpRequest();
			const url = BUCKET_URL + '/?list-type=2&prefix=' + prefix + '&encoding-type=url';
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
			const images = Array.from(response.getElementsByTagName('Contents'))
				.filter(i => BigInt(i.querySelector('Size').textContent) > 0)
				.map(i => BUCKET_URL.concat('/', i.querySelector('Key').textContent))
				.map(i => new ResponsiveImage(i));
			return images;})
		.catch(err => {
			console.log(err);
			return [];})
		// const params = {Prefix: prefix, EncodingType: 'url', Delimiter: '/'};
		// try {
		// 	const data = await s3.listObjectsV2(params).promise();
		// 	return data.Contents
		// 		.filter(obj => obj.Size > 0)
		// 		.map(obj => BUCKET_URL.concat('/', obj.Key));
		// } catch (err) {
		// 	console.log(err);
		// 	return [];
		// }
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
}

export class ResponsiveImage {
	constructor(src) {
		this.src = src;
		this.srcset = S3Service.buildImgSrcSet(src);
		const splitPath = src.split('/').reverse();
		this.basename = splitPath[0];
		this.category = splitPath[2];
	}
}

export default S3Service;
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
	listObjects: async (prefix) => {
		let promise = new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest();
			let url = BUCKET_URL + '/?list-type=2&prefix=' + prefix + '&encoding-type=url';
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
			let images = Array.from(response.getElementsByTagName('Contents'))
				.filter(c => BigInt(c.querySelector('Size').textContent) > 0)
				.map(c => BUCKET_URL.concat('/', c.querySelector('Key').textContent))
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
	}
}

export default S3Service;
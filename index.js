'use strict';
const getStream = require('get-stream');
const parsePng = require('parse-png');
const Resize = require('jimp/resize');

module.exports = (buf, opts) => {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	opts = Object.assign({}, opts);

	if (typeof opts.width !== 'number' && typeof opts.height !== 'number') {
		return Promise.reject(new TypeError('You need to set either width or height'));
	}

	return parsePng(buf).then(img => {
		if (typeof opts.width !== 'number') {
			opts.width = img.width * (opts.height / img.height);
		}

		if (typeof opts.height !== 'number') {
			opts.height = img.height * (opts.width / img.width);
		}

		return new Promise(resolve => {
			const resize = new Resize(img.width, img.height, Math.round(opts.width), Math.round(opts.height), true, true, buf => {
				img.width = opts.width;
				img.height = opts.height;
				img.data = buf;
				resolve(getStream.buffer(img.pack()));
			});

			resize.resize(img.data);
		});
	});
};

'use strict';
const bmp = require('bmp-js');
const fileType = require('file-type');
const getStream = require('get-stream');
const jpeg = require('jpeg-js');
const parsePng = require('parse-png');
const Resize = require('jimp/resize');

const resize = (img, opts) => {
	if (typeof opts.width !== 'number') {
		opts.width = Math.trunc(img.width * (opts.height / img.height));
	}

	if (typeof opts.height !== 'number') {
		opts.height = Math.trunc(img.height * (opts.width / img.width));
	}

	return new Promise(resolve => {
		const resize = new Resize(img.width, img.height, opts.width, opts.height, true, true, buf => resolve(buf));
		resize.resize(img.data);
	});
};

module.exports = async (buf, opts) => {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	const type = fileType(buf);

	if (!type || (type.ext !== 'bmp' && type.ext !== 'jpg' && type.ext !== 'png')) {
		return Promise.reject(new Error('Image format not supported'));
	}

	opts = {...opts};

	if (typeof opts.width !== 'number' && typeof opts.height !== 'number') {
		return Promise.reject(new Error('You need to set either width or height'));
	}

	if (type.ext === 'bmp') {
		const img = bmp.decode(buf);

		buf = await resize(img, opts);
		return bmp.encode({
			width: opts.width,
			height: opts.height,
			data: buf
		}).data;
	}

	if (type.ext === 'jpg') {
		const img = jpeg.decode(buf);

		buf = await resize(img, opts);
		return jpeg.encode({
			width: opts.width,
			height: opts.height,
			data: buf
		}).data;
	}

	{
		const img = await parsePng(buf);
		buf = await resize(img, opts);

		img.width = opts.width;
		img.height = opts.height;
		img.data = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
		return getStream.buffer(img.pack());
	}
};

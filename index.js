'use strict';
const fileType = require('file-type');
const Jimp = require('jimp');

module.exports = async (buffer, options = {}) => {
	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError(
			`Expected \`buffer\` to be of type \`Buffer\` but received type \`${typeof buffer}\``
		);
	}

	const type = fileType(buffer);

	if (!type || (type.ext !== 'bmp' && type.ext !== 'jpg' && type.ext !== 'png')) {
		throw new Error('Image format not supported');
	}

	if (typeof options.width !== 'number' && typeof options.height !== 'number') {
		throw new TypeError('You need to set either width or height');
	}

	const image = await Jimp.read(buffer);

	if (typeof options.width !== 'number') {
		options.width = Math.trunc(image.bitmap.width * (options.height / image.bitmap.height));
	}

	if (typeof options.height !== 'number') {
		options.height = Math.trunc(image.bitmap.height * (options.width / image.bitmap.width));
	}

	return image
		.resize(options.width, options.height)
		.getBufferAsync(Jimp.AUTO);
};

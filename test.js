import fs from 'fs';
import imageSize from 'image-size';
import pify from 'pify';
import test from 'ava';
import fn from './';

test('resize image', async t => {
	const data = await fn(await pify(fs.readFile)('fixture.png'), {
		width: 150,
		height: 99
	});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'png'
	});
});

test('resize image using only width', async t => {
	const data = await fn(await pify(fs.readFile)('fixture.png'), {width: 150});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'png'
	});
});

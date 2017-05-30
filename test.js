import fs from 'fs';
import imageSize from 'image-size';
import pify from 'pify';
import test from 'ava';
import fn from './';

const readFile = pify(fs.readFile);

test('resize png image', async t => {
	const data = await fn(await readFile('fixture.png'), {
		width: 150,
		height: 99
	});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'png'
	});
});

test('resize jpg image', async t => {
	const data = await fn(await readFile('fixture.jpg'), {
		width: 150,
		height: 99
	});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'jpg'
	});
});

test('resize bmp image', async t => {
	const data = await fn(await readFile('fixture.bmp'), {
		width: 150,
		height: 99
	});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'bmp'
	});
});

test('resize png image using only width', async t => {
	const data = await fn(await readFile('fixture.png'), {width: 150});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'png'
	});
});

test('resize jpg image using only width', async t => {
	const data = await fn(await readFile('fixture.jpg'), {width: 150});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'jpg'
	});
});

test('resize bmp image using only width', async t => {
	const data = await fn(await readFile('fixture.bmp'), {width: 150});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 99,
		type: 'bmp'
	});
});

test('resize png image using only height', async t => {
	const data = await fn(await readFile('fixture.png'), {height: 100});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 100,
		type: 'png'
	});
});

test('resize jpg image using only height', async t => {
	const data = await fn(await readFile('fixture.jpg'), {height: 100});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 100,
		type: 'jpg'
	});
});

test('resize bmp image using only height', async t => {
	const data = await fn(await readFile('fixture.bmp'), {height: 100});

	t.deepEqual(imageSize(data), {
		width: 150,
		height: 100,
		type: 'bmp'
	});
});

test('throw when using wrong format', async t => {
	const file = await readFile(__filename);
	await t.throws(fn(file, {width: 150}), /Image format not supported/);
});

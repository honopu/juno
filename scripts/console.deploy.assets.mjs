#!/usr/bin/env node

import { toNullable, uint8ArrayToHexString } from '@dfinity/utils';
import {
	deploy as cliDeploy,
	nextArg,
	readJunoConfig as readJunoConfigTools
} from '@junobuild/cli-tools';
import { consoleActorLocal } from './actor.mjs';

export const JUNO_CONFIG_FILENAME = 'juno.config';
const JUNO_CONFIG_FILE = { filename: JUNO_CONFIG_FILENAME };

const configEnv = (args) => {
	const mode = nextArg({ args, option: '-m' }) ?? nextArg({ args, option: '--mode' });
	return {
		mode: mode ?? 'production'
	};
};

const [_cmd, ...args] = process.argv.slice(2);

const env = configEnv(args);

const readJunoConfig = async (env) => {
	const config = (userConfig) => (typeof userConfig === 'function' ? userConfig(env) : userConfig);

	return await readJunoConfigTools({
		...JUNO_CONFIG_FILE,
		config
	});
};

const {
	init_assets_upload_group,
	propose_assets_upload_group,
	init_asset_upload,
	commit_asset_upload,
	upload_asset_chunk,
	commit_assets_upload_group
} = await consoleActorLocal();

const batchGroupId = await init_assets_upload_group();

const uploadFile = async ({ collection, encoding, filename, fullPath, headers, data }) => {
	const { batch_id: batchId } = await init_asset_upload(
		{
			collection,
			full_path: fullPath,
			name: filename,
			token: toNullable(),
			encoding_type: toNullable(encoding),
			description: toNullable()
		},
		batchGroupId
	);

	const chunkSize = 1900000;

	const uploadChunks = [];

	let orderId = 0n;
	for (let start = 0; start < data.size; start += chunkSize) {
		const chunk = data.slice(start, start + chunkSize);

		uploadChunks.push({
			batchId,
			chunk,
			orderId
		});

		orderId++;
	}

	let chunkIds = [];
	for await (const results of batchUploadChunks({ uploadChunks })) {
		chunkIds = [...chunkIds, ...results];
	}

	const contentType =
		headers.find(([type, _]) => type.toLowerCase() === 'content-type') === undefined &&
		data.type !== undefined &&
		data.type !== ''
			? [['Content-Type', data.type]]
			: undefined;

	await commit_asset_upload({
		batch_id: batchId,
		chunk_ids: chunkIds.map(({ chunk_id }) => chunk_id),
		headers: [...headers, ...(contentType ? contentType : [])]
	});
};

async function* batchUploadChunks({ uploadChunks, limit = 12 }) {
	for (let i = 0; i < uploadChunks.length; i = i + limit) {
		const batch = uploadChunks.slice(i, i + limit);
		const result = await Promise.all(batch.map((params) => uploadChunk(params)));
		yield result;
	}
}

const uploadChunk = async ({ batchId, chunk, actor, orderId }) =>
	upload_asset_chunk({
		batch_id: batchId,
		content: new Uint8Array(await chunk.arrayBuffer()),
		order_id: toNullable(orderId)
	});

const deploy = async () => {
	const config = await readJunoConfig(env);

	// TODO: listAssets in console
	const listExistingAssets = async () => [];

	await cliDeploy({
		config,
		listAssets: listExistingAssets,
		uploadFile
	});
};

await deploy();

const { sha256, status } = await propose_assets_upload_group(batchGroupId);

console.log('\nAssets uploaded and proposed.\n');
console.log('🆔 ', batchGroupId);
console.log('🔒 ', uint8ArrayToHexString(sha256));
console.log('⏳ ', status);

await commit_assets_upload_group({
	batch_group_id: batchGroupId,
	sha256
});

console.log('\n✅ Assets committed to http://cokmz-oiaaa-aaaal-aby6q-cai.localhost:5987/.');
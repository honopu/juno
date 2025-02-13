import {
	ERROR_NO_TIMESTAMP,
	ERROR_TIMESTAMP_OUTDATED_OR_FUTURE,
	ERROR_NO_VERSION,
	ERROR_VERSION_OUTDATED_OR_FUTURE,
	DATASTORE_ERROR_CANNOT_WRITE,
	DATASTORE_ERROR_CANNOT_READ,
	STORAGE_ERROR_UPLOAD_NOT_ALLOWED,
	STORAGE_ERROR_SET_NOT_ALLOWED,
	STORAGE_ERROR_CANNOT_COMMIT_BATCH,
	STORAGE_ERROR_ASSET_NOT_FOUND,
	STORAGE_ERROR_CANNOT_READ_ASSET,
	AUTH_ERROR_NOT_ADMIN_CONTROLLER,
	AUTH_ERROR_INVALID_ORIGIN,
	AUTH_ERROR_NOT_CONTROLLER,
	DATASTORE_ERROR_USER_CANNOT_UPDATE,
	DATASTORE_ERROR_USER_INVALID_DATA,
	DATASTORE_ERROR_USER_CALLER_KEY,
	DATASTORE_ERROR_USER_KEY_NO_PRINCIPAL,
	DATASTORE_ERROR_USER_NOT_ALLOWED,
	DATASTORE_ERROR_USER_USAGE_CHANGE_LIMIT_REACHED,
	DATASTORE_ERROR_USER_USAGE_INVALID_DATA
} from '@junobuild/errors';

export const JUNO_ERROR_NO_TIMESTAMP_PROVIDED = ERROR_NO_TIMESTAMP;
export const JUNO_ERROR_TIMESTAMP_OUTDATED_OR_FUTURE = ERROR_TIMESTAMP_OUTDATED_OR_FUTURE;
export const JUNO_ERROR_NO_VERSION_PROVIDED = ERROR_NO_VERSION;
export const JUNO_ERROR_VERSION_OUTDATED_OR_FUTURE = ERROR_VERSION_OUTDATED_OR_FUTURE;

export const JUNO_DATASTORE_ERROR_CANNOT_WRITE = DATASTORE_ERROR_CANNOT_WRITE;
export const JUNO_DATASTORE_ERROR_CANNOT_READ = DATASTORE_ERROR_CANNOT_READ;

export const JUNO_STORAGE_ERROR_UPLOAD_NOT_ALLOWED = STORAGE_ERROR_UPLOAD_NOT_ALLOWED;
export const JUNO_STORAGE_ERROR_SET_NOT_ALLOWED = STORAGE_ERROR_SET_NOT_ALLOWED;
export const JUNO_STORAGE_ERROR_CANNOT_COMMIT_BATCH = STORAGE_ERROR_CANNOT_COMMIT_BATCH;
export const JUNO_STORAGE_ERROR_ASSET_NOT_FOUND = STORAGE_ERROR_ASSET_NOT_FOUND;
export const JUNO_STORAGE_ERROR_CANNOT_READ_ASSET = STORAGE_ERROR_CANNOT_READ_ASSET;

export const JUNO_AUTH_ERROR_NOT_ADMIN_CONTROLLER = AUTH_ERROR_NOT_ADMIN_CONTROLLER;
export const JUNO_AUTH_ERROR_INVALID_ORIGIN = AUTH_ERROR_INVALID_ORIGIN;
export const JUNO_AUTH_ERROR_NOT_CONTROLLER = AUTH_ERROR_NOT_CONTROLLER;

export const JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE = DATASTORE_ERROR_USER_CANNOT_UPDATE;
export const JUNO_DATASTORE_ERROR_USER_INVALID_DATA = DATASTORE_ERROR_USER_INVALID_DATA;
export const JUNO_DATASTORE_ERROR_USER_CALLER_KEY = DATASTORE_ERROR_USER_CALLER_KEY;
export const JUNO_DATASTORE_ERROR_USER_KEY_NO_PRINCIPAL = DATASTORE_ERROR_USER_KEY_NO_PRINCIPAL;
export const JUNO_DATASTORE_ERROR_USER_NOT_ALLOWED = DATASTORE_ERROR_USER_NOT_ALLOWED;
export const JUNO_DATASTORE_ERROR_USER_USAGE_CHANGE_LIMIT_REACHED = DATASTORE_ERROR_USER_USAGE_CHANGE_LIMIT_REACHED;
export const JUNO_DATASTORE_ERROR_USER_USAGE_INVALID_DATA = DATASTORE_ERROR_USER_USAGE_INVALID_DATA;

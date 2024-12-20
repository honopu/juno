import type { Satellite } from '$declarations/mission_control/mission_control.did';
import { initDataStore } from '$lib/stores/data.store';

export const satellitesDataStore = initDataStore<Satellite[]>();

import type { MissionControl } from '$declarations/console/console.did';
import { getConsoleActor } from '$lib/api/actors/actor.juno.api';
import type { OptionIdentity } from '$lib/types/itentity';
import type { Principal } from '@dfinity/principal';
import { fromNullable, isNullish } from '@dfinity/utils';

export const initMissionControl = async (identity: OptionIdentity): Promise<MissionControl> => {
	const actor = await getConsoleActor(identity);

	const existingMissionControl: MissionControl | undefined = fromNullable<MissionControl>(
		await actor.get_user_mission_control_center()
	);

	if (!existingMissionControl) {
		return await actor.init_user_mission_control_center();
	}

	return existingMissionControl;
};

export const getCredits = async (identity: OptionIdentity): Promise<bigint> => {
	const actor = await getConsoleActor(identity);
	const credits = await actor.get_credits();
	return credits.e8s;
};

export const getSatelliteFee = async ({
	user,
	identity
}: {
	user: Principal;
	identity: OptionIdentity;
}): Promise<bigint> => {
	const actor = await getConsoleActor(identity);
	const result = await actor.get_create_satellite_fee({ user });
	const fee = fromNullable(result);

	// If user has enough credits, it returns no fee
	return isNullish(fee) ? 0n : fee.e8s;
};

export const getOrbiterFee = async ({
	user,
	identity
}: {
	user: Principal;
	identity: OptionIdentity;
}): Promise<bigint> => {
	const actor = await getConsoleActor(identity);
	const result = await actor.get_create_orbiter_fee({ user });
	const fee = fromNullable(result);

	// If user has enough credits, it returns no fee
	return isNullish(fee) ? 0n : fee.e8s;
};

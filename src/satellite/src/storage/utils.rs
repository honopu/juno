use crate::rules::types::rules::Permission;
use crate::rules::utils::assert_rule;
use crate::storage::types::interface::{AssetEncodingNoContent, AssetNoContent};
use crate::storage::types::state::{Assets, FullPath};
use crate::storage::types::store::Asset;
use crate::types::core::CollectionKey;
use crate::types::list::ListParams;
use candid::Principal;
use regex::Regex;
use shared::types::state::{Controllers, UserId};

pub fn filter_values(
    caller: Principal,
    controllers: &Controllers,
    rule: &Permission,
    collection: CollectionKey,
    ListParams {
        matcher,
        order: _,
        paginate: _,
        owner,
    }: &ListParams,
    assets: &Assets,
) -> Vec<(FullPath, AssetNoContent)> {
    fn map_key(asset: &Asset) -> (FullPath, AssetNoContent) {
        (
            asset.key.full_path.clone(),
            AssetNoContent {
                key: asset.key.clone(),
                headers: asset.headers.clone(),
                encodings: asset
                    .encodings
                    .clone()
                    .into_iter()
                    .map(|(key, encoding)| {
                        (
                            key,
                            AssetEncodingNoContent {
                                modified: encoding.modified,
                                total_length: encoding.total_length,
                                sha256: encoding.sha256,
                            },
                        )
                    })
                    .collect(),
                created_at: asset.created_at,
                updated_at: asset.updated_at,
            },
        )
    }

    let all_keys = assets.values().map(map_key);

    let regex: Option<Regex> = matcher.as_ref().map(|filter| Regex::new(filter).unwrap());

    all_keys
        .into_iter()
        .filter(|(_, asset)| {
            filter_collection(collection.clone(), asset)
                && filter_full_path(&regex, asset)
                && filter_owner(*owner, asset)
                && assert_rule(rule, asset.key.owner, caller, controllers)
        })
        .collect()
}

fn filter_full_path(regex: &Option<Regex>, asset: &AssetNoContent) -> bool {
    match regex {
        None => true,
        Some(re) => re.is_match(&asset.key.full_path),
    }
}

fn filter_collection(collection: CollectionKey, asset: &AssetNoContent) -> bool {
    asset.key.collection == collection
}

fn filter_owner(filter_owner: Option<UserId>, asset: &AssetNoContent) -> bool {
    match filter_owner {
        None => true,
        Some(filter_owner) => filter_owner == asset.key.owner,
    }
}
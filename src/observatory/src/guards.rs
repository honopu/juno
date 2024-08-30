use crate::STATE;
use ic_cdk::caller;
use junobuild_shared::controllers::{
    caller_is_console as caller_is_console_impl, is_admin_controller as is_admin_controller_impl,
    is_controller as is_controller_impl,
};
use junobuild_shared::types::state::Controllers;
use junobuild_shared::utils::principal_not_anonymous;

pub fn caller_is_admin_controller() -> Result<(), String> {
    if is_admin_controller() {
        Ok(())
    } else {
        Err("Caller is not a controller of the observatory.".to_string())
    }
}

pub fn caller_can_execute_cron_jobs() -> Result<(), String> {
    let caller = caller();

    if caller_is_console_impl(caller) || caller_is_controller() {
        Ok(())
    } else {
        Err("Caller is not allowed to read.".to_string())
    }
}

pub fn caller_is_not_anonymous() -> Result<(), String> {
    let caller = caller();

    if principal_not_anonymous(caller) {
        Ok(())
    } else {
        Err("Anonymous caller is not allowed.".to_string())
    }
}

fn caller_is_controller() -> bool {
    let caller = caller();
    let controllers: Controllers = STATE.with(|state| state.borrow().stable.controllers.clone());

    is_controller_impl(caller, &controllers)
}

fn is_admin_controller() -> bool {
    let caller = caller();
    let controllers: Controllers = STATE.with(|state| state.borrow().stable.controllers.clone());

    is_admin_controller_impl(caller, &controllers)
}

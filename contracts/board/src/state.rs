use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cw_storage_plus::Item;
use cosmwasm_std::Addr;

use crate::models::post::Post;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub posts: Vec<Post>,
    pub owner: Addr,
}

pub const STATE: Item<State> = Item::new("state");

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use cosmwasm_std::Addr;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Post {
    owner: Addr,
    title: String,
    body: String,
    image: String,
    upvotes: HashMap<String, bool>
}

impl Post {
    pub fn new(owner:Addr, title : String, body: String, image:String) -> Post {
        Post {
            owner,
            title,
            body,
            image,
            upvotes: HashMap::new()
        }
    }

    pub fn toggle_upvote(&mut self, addr: &Addr) {
        let upvote = &self.upvotes.get(addr.as_str());
        match upvote {
            Some(val) => {
                let toggled = !*val;
                self.upvotes.insert(addr.to_string(), toggled);
            },
            None => {
                self.upvotes.insert(addr.to_string(), true);
            }
        }
    }

    pub fn get_owner(&self) -> &Addr {
        &self.owner
    }

    pub fn get_title(&self) -> &String {
        &self.title
    }

    pub fn get_body(&self) -> &String {
        &self.body
    }

    pub fn get_image(&self) -> &String {
        &self.image
    }
}
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Addr;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Post {
    owner: Addr,
    title: String,
    body: String,
    image: String,
    upvotes: Vec<String>
}

impl Post {
    pub fn new(owner:Addr, title : String, body: String, image:String) -> Post {
        Post {
            owner,
            title,
            body,
            image,
            upvotes: Vec::new()
        }
    }

    pub fn toggle_upvote(&mut self, addr: Addr){
        let upvoted = self.upvotes.iter().position(|x| *x == addr.as_str());

        match upvoted {
            Some(index) => {
                self.upvotes.remove(index);
            },
            None => {
                self.upvotes.push(addr.into_string());
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
    
    pub fn get_upvotes(&self) -> &Vec<String> {
        &self.upvotes
    }
}
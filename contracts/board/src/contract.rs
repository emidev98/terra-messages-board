#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{PostsResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

use crate::models::post::Post;
use cosmwasm_std::Addr;

const CONTRACT_NAME: &str = "crates.io:terra_board";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");


// Deployment constructor
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        posts: Vec::new(),
        owner: info.sender.clone(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}


// Write Requests
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreatePost {title, body, image} => try_create(deps, info, title, body, image),
        ExecuteMsg::ToggleUpvotePost { index } => try_toggle_upvote(deps, info, index),
    }
}

pub fn try_create(deps: DepsMut, info: MessageInfo, title: String, body: String, image: String) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        state.posts.push(Post::new(info.sender, title, body, image));
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "try_create"))
}
pub fn try_toggle_upvote(deps: DepsMut, info: MessageInfo, index: u32) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |state| -> Result<_, ContractError> {
        match state.posts.get(index as usize) {
            Some(post) => {
                post.clone().toggle_upvote(&info.sender);
                Ok(state)
            },
            None => Err(ContractError::PostDoesNotExist{})
        }
    })?;
    Ok(Response::new().add_attribute("method", "try_toggle_upvote"))
}


// Query Requests
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPosts {} => to_binary(&get_posts(deps)?),
        QueryMsg::GetPostsByAddress { addr } => to_binary(&get_posts_by_addr(deps, addr)?)
    }
}

fn get_posts(deps: Deps) -> StdResult<PostsResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(PostsResponse { posts: state.posts })
}

fn get_posts_by_addr(deps: Deps, addr: Addr) -> StdResult<PostsResponse> {
    let state = STATE.load(deps.storage)?;
    
    let posts = state.posts
        .iter()
        .filter(|&post| addr.eq(post.get_owner()))
        .cloned()
        .collect::<Vec<Post>>();
        
    Ok(PostsResponse { posts })
}
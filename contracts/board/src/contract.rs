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
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        match state.posts.get_mut(index as usize) {
            Some(post) => {
                post.toggle_upvote(info.sender);
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

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        // GIVEN
        let mut deps = mock_dependencies(&[]);
        let msg = InstantiateMsg { posts: Vec::new() };
        let info = mock_info("creator", &coins(1000, "earth"));

        // WHEN
        let instance_res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // THEN
        let query_response = query(deps.as_ref(), mock_env(), QueryMsg::GetPosts {}).unwrap();
        let query_value: PostsResponse = from_binary(&query_response).unwrap();
        let response : Vec<Post> = Vec::new();
        
        assert_eq!(0, instance_res.messages.len());
        assert_eq!(response, query_value.posts);
    }

    #[test]
    fn create_post() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { posts: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));

        // WHEN
        let msg = ExecuteMsg::CreatePost { title : String::from("title"), body: String::from("body"), image: String::from("image.png")};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // THEN
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetPosts {}).unwrap();
        let value: PostsResponse = from_binary(&res).unwrap();
        let posts : Vec<Post> = value.posts;
        assert_eq!(1, posts.len());
        assert_eq!("title", posts.get(0).unwrap().get_title());
        assert_eq!("body", posts.get(0).unwrap().get_body());
        assert_eq!("image.png", posts.get(0).unwrap().get_image());
        assert_eq!(0, posts.get(0).unwrap().get_upvotes().len());
    }
    

    #[test]
    fn like_a_created_post() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { posts: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::CreatePost { title : String::from("title"), body: String::from("body"), image: String::from("image.png")};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // WHEN
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::ToggleUpvotePost { index : 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // THEN
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetPosts {}).unwrap();
        let value: PostsResponse = from_binary(&res).unwrap();
        let posts: &Post = value.posts.get(0).unwrap();
        assert_eq!(1, posts.get_upvotes().len());
    }
}

import "./PostsList.scss";
import { Post } from "../../models/Post";
import { Card } from 'primereact/card';
import { PostComponent } from "../PostComponent/PostComponent";

interface Props {
    posts: Post[],
    toggleUpvote: Function
}

export const PostsList = (props: Props) => {

    return (
        <div className="PostsList">
            { props.posts.length 
                ? props.posts.map((post, index) => (
                    <PostComponent 
                        key={index} 
                        post={post}
                        toggleUpvote={() => props.toggleUpvote(index)}/>
                ))
                : <Card className="PostsListWithoutContent" title="Board has no content yet" />
            }
        </div>
    )
}

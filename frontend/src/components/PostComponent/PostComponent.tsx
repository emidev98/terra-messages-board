import "./PostComponent.scss";
import { Post } from "../../models/Post";
import { Card } from 'primereact/card';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { useState } from "react";
import { PostUpvote } from "../PostUpvote/PostUpvote";
import { Loader } from "../Loader/Loader";

interface Props {
    post: Post,
    toggleUpvote: Function
}

export const PostComponent = (props: Props) => {
    const { post } = props;
    const walletAddress = useConnectedWallet()?.walletAddress;
    const [upvotes, setUpvotes] = useState(post.upvotes.length);
    const [loading, setLoading] = useState(false);
    const isUpvotedAddressByConnectedAddress = () => !!post.upvotes?.find(upvote => upvote === walletAddress);
    const [
        upvotedByConnectedWallet,
        setUpvotedByConnectedWallet
    ] = useState(isUpvotedAddressByConnectedAddress());

    const toggleUpvote = async () => {
        setLoading(true);

        try {
            await props.toggleUpvote();
            if (isUpvotedAddressByConnectedAddress()) {
                post.upvotes = post.upvotes.filter(upvote => upvote !== walletAddress);
            } else {
                post.upvotes.push(walletAddress as string);
            }
        } catch(e) {
            console.log(e);
        }

        setUpvotes(post.upvotes.length);
        setUpvotedByConnectedWallet(isUpvotedAddressByConnectedAddress());
        setLoading(false);
    }


    return (
        <Card className="PostComponent" title={post.title}>
            <Splitter style={{ height: '300px' }}>
                <SplitterPanel size={80} className="PostComponentLeft">{post.body}</SplitterPanel>
                <SplitterPanel size={20} className="PostComponentRight">
                    <div className="PostImageWrapper">
                        {post.imageURL && <img src={post.imageURL} alt="post" />}
                    </div>
                    <PostUpvote toggleUpvote={() => toggleUpvote()}
                        upvotes={upvotes}
                        upvotedByConnectedWallet={upvotedByConnectedWallet} />
                </SplitterPanel>
            </Splitter>
            {loading && <Loader/>}
        </Card>
    )
}

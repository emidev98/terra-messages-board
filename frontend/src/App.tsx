import './App.scss'

import { useEffect, useState } from 'react'
import { useConnectedWallet } from '@terra-money/wallet-provider'

import * as execute from './contract/execute'
import * as query from './contract/query'
import { AppHeader } from './components/AppHeader/AppHeader'
import { Post } from './models/Post'
import { Loader } from './components/Loader/Loader'
import { PostsList } from './components/PostsList/PostsList'
import { useIPFS } from './hooks/useIPFS'
import { Card } from 'primereact/card'

function App() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false);
    const connectedWallet = useConnectedWallet();
    const { readFile } = useIPFS();

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (connectedWallet) {
                let { posts } = await query.getPosts(connectedWallet);

                for await (const post of posts) {
                    if (post.image) {
                        let file = await readFile(post.image);
                        post.imageURL = URL.createObjectURL(new Blob([file]));
                    }
                }
                console.log(posts);
                setPosts(posts);
            }
            setLoading(false);
        })();
    }, [connectedWallet]);

    const onSubmitNewPost = async (post: Post) => {
        setLoading(true);
        try {
            await execute.createPost(connectedWallet, post);
            if (post.image) {
                let file = await readFile(post.image);
                post.imageURL = URL.createObjectURL(new Blob([file]));
            }
            posts.push(post);
            setPosts(posts);
        }
        catch (e) {
            setLoading(false);
            throw e;
        }
        setLoading(false);
    }

    const toggleUpvote = (index) => execute.toggleUpvote(connectedWallet, index);

    return (
        <div className="App">
            <AppHeader
                onSubmitNewPost={(event) => onSubmitNewPost(event)} />
            <div className="AppContent">
                {connectedWallet
                    ? <PostsList
                        posts={posts}
                        toggleUpvote={toggleUpvote} />
                    : <Card className="AppConnectWallet" title="Connect your wallet to see the posts" />
                }
            </div>
            {loading && <Loader position="fixed" />}
        </div>
    )
}

export default App

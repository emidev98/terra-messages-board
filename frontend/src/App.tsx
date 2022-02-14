import './App.scss'

import { useEffect, useState } from 'react'
import { useConnectedWallet } from '@terra-money/wallet-provider'

import * as execute from './contract/execute'
import * as query from './contract/query'
import { NewPost } from './components/NewPost/NewPost'
import { AppHeader } from './components/AppHeader/AppHeader'
import { Post } from './models/Post'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    (async () => {
      if (connectedWallet) {
        setPosts((await query.getPosts(connectedWallet)).posts)
      }
      setLoading(false)
    })();
  }, [connectedWallet]);

  const onSubmitNewPost = async (post : Post) => {
    setLoading(true);
    await execute.createPost(connectedWallet, post);
    setLoading(false)
    console.log(post)
  }

  return (
    <div className="App">
      <AppHeader/>
      <div className='AppContent'>
        <NewPost onSubmit={($event) => onSubmitNewPost($event)}/>
        <pre>{JSON.stringify(posts)}</pre>
      </div>
    </div>
  )
}

export default App

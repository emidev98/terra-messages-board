import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { ConnectWallet } from '../ConnectWallet/ConnectWallet';
import { DisconnectWallet } from '../DisconnectWallet/DisconnectWallet';
import './AppHeader.scss';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { NewPost } from '../NewPost/NewPost';
import { Divider } from 'primereact/divider';
import logo from "../../assets/img/logo.png";

interface Props {
    onSubmitNewPost: Function
}

export const AppHeader = (props : Props) => {
    const { status } = useWallet();
    const [dialogVisible, setDialogVisible] = useState(false);

    const displayModal = () => {
        setDialogVisible(true);
    }

    const hideModal = () => {
        setDialogVisible(false);
    }

    const onSubmitNewPost = async ($event) => {
        try {
            await props.onSubmitNewPost($event);
            hideModal();
        }
        catch(e) {
            console.log(e);
        }
    }
    
    return (
        <header className="AppHeader">
            <div className="AppHeaderContent">
                <img src={logo} alt="logo" className="AppLogo"/>
                <h1 className="AppTitle">Terra Board</h1>
                {status === WalletStatus.WALLET_CONNECTED ? (
                    <>
                        <Button 
                            label="New Post" 
                            icon="pi pi-plus" 
                            onClick={() => displayModal()} />
                        <DisconnectWallet />
                    </>
                ) : (
                    <ConnectWallet />
                )}

                <Dialog header="New Post" 
                    visible={dialogVisible} 
                    style={{ width: '80vw' }} 
                    onHide={() => hideModal()}
                >        
                    <NewPost onSubmit={($event) => onSubmitNewPost($event)}/>
                </Dialog>
            </div>
            <Divider/>
        </header>
    )
}

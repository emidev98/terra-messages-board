import "./PostUpvote.scss";
import { Button } from "primereact/button";

interface Props {
    upvotes: number,
    upvotedByConnectedWallet: boolean,
    toggleUpvote: Function
}

export const PostUpvote = (props: Props) => {

    return (
        <div className="PostUpvote">
            <Button onClick={() => props.toggleUpvote()}
                className={props.upvotedByConnectedWallet ? "p-button-success" : ""}>
                <i className="pi pi-arrow-up mr-2"></i>
                <span>{props.upvotes} UPVOTES</span>
            </Button>
        </div>
    )
}

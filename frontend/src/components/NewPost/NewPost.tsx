import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import "./NewPost.scss";
import { Loader } from "../Loader/Loader";
import { useIPFS } from "../../hooks/useIPFS";

interface Props {
    onSubmit: Function
}

export const NewPost = (props: Props) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const { uploadFile } = useIPFS();

    const [loading, setLoading] = useState(false);
    const onSubmit = async () => {

        props.onSubmit({
            title,
            body,
            image,
            upvotes: []
        })
    };

    const useOnUpload = async (event) => {
        setLoading(true);
        try {
            const cid = await uploadFile(event.files[0]);
            
            setImage(cid ? cid : "");
        }
        catch (e) {
            console.log(e);
        }
        
        setLoading(false);
    }

    return (
        <div className="NewPost">
            <div className="NewPostRight">
                <span className="p-float-label">
                    <InputText id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="title">Title</label>
                </span>
                <span className="p-float-label">
                    <InputTextarea id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)} />
                    <label htmlFor="body">Body</label>
                </span>
            </div>
            <div className="NewPostLeft">
                <FileUpload customUpload
                    url="./upload"
                    multiple={false}
                    uploadHandler={useOnUpload}
                    chooseLabel="Upload image"
                    accept="image" />
                <div className="NewPostFooter">
                    <Button
                        label="Submit Post"
                        onClick={() => onSubmit()}
                        icon="pi pi-send" />
                </div>
            </div>
            { loading && <Loader/> }
            
        </div>
        
    )
}

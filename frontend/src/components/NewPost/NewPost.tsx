import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import "./NewPost.scss";
import { filesUtilsToBlob } from "../../utils/filesUtilsToBlob";
import { useIPFS } from "../../Hooks/useIPFS";

interface Props {
  onSubmit: Function
}

export const NewPost = (props: Props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState({});
  
  const onSubmit = async () => {
    
    props.onSubmit({
      title,
      body,
      image
    })
  };

  const useOnUpload = async(event) => {
    const file = await filesUtilsToBlob(event.files);
    const ipfs = await useIPFS();
    const { cid } = await ipfs.add(file);

    setImage(cid.toString());
  }

  return (
    <Card title="New Post" className="NewPost">
      <div className="NewPostBody">
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
            accept="image"/>
          <div className="NewPostFooter">
            <Button 
              label="Submit Post"
              onClick={()=> onSubmit()} 
              icon="pi pi-send"/>
          </div>
        </div>
      </div>
    </Card>
  )
}

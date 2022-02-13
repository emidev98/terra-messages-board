import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { create } from "ipfs-http-client";
import "./NewPost.scss";

interface Props {
  onSubmit: Function
}

export const NewPost = (props: Props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  
  const onSubmit = async () => {
    
    props.onSubmit({
      title,
      body,
      image
    })
  };

  const onUpload = async(event) =>{
    /*
    console.log(event.files[0])
    const ipfs = create(); // I do not have a gateway to upload files to IPFS
    const { cid } = await ipfs.add(event.files[0]);
    setImage(cid.toString())*/

    setImage(event.files[0].name)
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
            uploadHandler={onUpload}
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

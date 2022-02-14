export async function filesUtilsToBlob(files : Array<{objectURL : string}>) : Promise<String> {
    const blobPromise = await Promise.all(files.map((file) => fetch(file.objectURL)));
    const blobs = await Promise.all(blobPromise.map(blob => blob.blob()));

    return new Promise((resolve, _reject) => {
        blobs.map( blob =>  {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64String = reader.result as string;
              return resolve(base64String.substring(base64String.indexOf(', ') + 1));
            }
          });
    });
}
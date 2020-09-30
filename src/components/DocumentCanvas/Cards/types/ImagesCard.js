import React,{useState,useCallback} from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This Card Upload Image file & Shows the Image in Galllery
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id` 
 */
const ImagesCard = (props) =>{
    
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const listOfExtension= "image/*"
  const requestUpload = (e) => {
    const file = e.target.files[0];
    if(file != undefined)
    var metadata = {
        contentType: file?.type
    };
    let uploadPath = props.id + "/" + file.name.split(".")[0] +">"+file.lastModified+"/";
    console.log("path sent from audio:", uploadPath)
    props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
        console.log(uploadStatus)
        if (uploadStatus === "complete") {
            setUploading("uploaded")
            props.typeAPI.requestDownload(
                uploadPath,
                (url, metadata) => 
                props.typeAPI.saveContent(props.id,{
                    [metadata.name]: 
                    { 
                        url: url, metadata: metadata 
                    },
                    ["/text"] : null
                })
            )
        }
        else {
            setUploading(uploadStatus)
        }
    })
  }
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  return (
    <div>
        {
            (typeof uploading === "number") ? 
            <ProgressBar animated now={uploading} label={`${Math.floor(uploading)}%`}></ProgressBar>  
            : null
        }
        <input
            type="file"
            accept={`image/x-png,image/gif,image/jpeg,image/svg,${listOfExtension}`}
            onChange={(e) => requestUpload(e)}
        />
        { 
          props.content.text === undefined ?
          Object.entries(props.content).map((fileKey,val)=>{
            return(
              <div key={fileKey[0]}>
                File Name : {fileKey[0].split(">")[0]}
                <Gallery photos={[{src:`${fileKey[1]?.url}` , width:6 , height:7}]} onClick={openLightbox} />
                <ModalGateway>
                  {
                    viewerIsOpen ?
                    <Modal onClose={closeLightbox} >
                      <Carousel
                        currentIndex={currentImage}
                        views={[{src:`${fileKey[1]?.url}` , width:6 , height:7}].map(x => ({
                          ...x,
                          srcset: x.srcSet,
                          caption: x.title
                          }))
                        }
                      />
                    </Modal>
                    : null
                  }
                </ModalGateway>
              </div>
            )
          })
          : null
        }
    </div>
  )
}
export default React.memo(ImagesCard);

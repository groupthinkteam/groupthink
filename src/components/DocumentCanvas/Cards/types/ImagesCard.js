import React,{useState,useCallback} from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

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
    var metadata = {
        contentType: file.type
    };
    let uploadPath = props.id + "/" + file.lastModified
    console.log("path sent from audio:", uploadPath)
    props.typeAPI.requestUpload(uploadPath, file, metadata, (uploadStatus) => {
        console.log(uploadStatus)
        if (uploadStatus === "complete") {
            setUploading("uploaded")
            props.typeAPI.requestDownload(
                uploadPath,
                (url, metadata) => props.typeAPI.saveContent(props.id, { url: url, metadata: metadata })
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
        {uploading ? "upload progress: " + uploading : "not uploading"}
        <input
            type="file"
            accept={`image/x-png,image/gif,image/jpeg,image/svg,${listOfExtension}`}
            onChange={(e) => requestUpload(e)}
        />
        { props.content.url ?
            <div key={props.content.metadata.name}>
              File Name : {props.content.metadata.name}
              <Gallery photos={[{src:`${props.content.url}` , width:6 , height:7}]} onClick={openLightbox} />
              <ModalGateway>
                {
                  viewerIsOpen ?
                  <Modal onClose={closeLightbox} >
                    <Carousel
                      currentIndex={currentImage}
                      views={[{src:`${props.content.url}` , width:6 , height:7}].map(x => ({
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
            : null
        }
    </div>
  )
}
export default React.memo(ImagesCard);

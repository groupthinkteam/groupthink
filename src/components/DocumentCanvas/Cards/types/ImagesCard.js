import React,{useState,useCallback} from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

const ImageRender = (props) =>{
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  localStorage.setItem('imageSrc',props.src.src)
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  const photos = [{src:`${props.src.src}` , width:6 , height:7}]
  //console.log(props.src.src)
     return(
        <div>
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox} >
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
     )
 }
const ImagesCard = () =>{
    const [state , setState]= useState()
    //console.log(state)
    
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        if(e.target.files && e.target.files.length > 0)
        {
            const reader = new FileReader();
            reader.addEventListener("load",()=>{
                setState({src:reader.result  })
            })
            reader.readAsDataURL(e.target.files[0])
            console.log("Reader Log \n",state?.src)
        }
    }
    return(
       
            <div>
                <input
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg,image/svg"
                    onChange={(e)=>OnSelectFile(e)}
                />
                {state?.src != undefined ? <ImageRender src={state}/> : <div></div>}
            </div>
       
    )
}
export default ImagesCard;
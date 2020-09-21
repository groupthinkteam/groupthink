import React,{useState,useCallback,useEffect} from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { auth } from 'firebase';

const ImageRender = (props) =>{
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [imageState , setImageState] = useState();
  const cardAPI = props.cardAPI;

    var file = props.src.src;
    let url = 0;
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "image/" + file.name
    var metadata = {
        contentType: `${props.src.src.type}`
    };
    useEffect(()=>{
      cardAPI.storeFile(refURL,file ,metadata,data=>{
        setImageState(data)
      })
  },[url])
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  //console.log(props.src.src)
    return(
      <div>
        {
          imageState!=undefined ?
          <div>
            <Gallery photos={[{src:`${imageState.url}` , width:6 , height:7}]} onClick={openLightbox} />
            <ModalGateway>
              {viewerIsOpen ? (
                <Modal onClose={closeLightbox} >
                  <Carousel
                    currentIndex={currentImage}
                    views={[{src:`${imageState.url}` , width:6 , height:7}].map(x => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: x.title
                    }))}
                  />
                </Modal>
              ) : null}
            </ModalGateway>
          </div>
          :<div></div>
        }
      </div>
    )
 }
const ImagesCard = (props) =>{
    const [state , setState]= useState()
    const [imageState , setImageState] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const listOfExtension= "image/*"
    const cardAPI = props.cardAPI;

    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src: e.target.files[0]})
    }
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "image/"
    useEffect(()=>{
        cardAPI.displayFile(refURL,data=>{
          setImageState(data)
        })
    },[])
    const openLightbox = useCallback((event, { photo, index }) => {
      setCurrentImage(index);
      setViewerIsOpen(true);
    }, []);
  
    const closeLightbox = () => {
      setCurrentImage(0);
      setViewerIsOpen(false);
    };
    return(
       
            <div>
                <input
                    type="file"
                    accept={`image/x-png,image/gif,image/jpeg,image/svg,${listOfExtension}`}
                    onChange={(e)=>OnSelectFile(e)}
                />
                {state?.src != undefined ? <ImageRender src={state} cardAPI={props.cardAPI} projectID={props.projectID} id={props.id}/> : <div></div>}
              {
                (imageState != null || imageState != undefined) && imageState.length>0 ?
                <div>
                    Previously Uploaded Audios
                    {
                        imageState
                        .map((item)=>(
                            <div key={item.metadata.name}>
                                File Name : {item.metadata.name}
                                <Gallery photos={[{src:`${item.url}` , width:6 , height:7}]} onClick={openLightbox} />
                                <ModalGateway>
                                  {viewerIsOpen ? (
                                    <Modal onClose={closeLightbox} >
                                      <Carousel
                                        currentIndex={currentImage}
                                        views={[{src:`${item.url}` , width:6 , height:7}].map(x => ({
                                          ...x,
                                          srcset: x.srcSet,
                                          caption: x.title
                                        }))}
                                      />
                                    </Modal>
                                  ) : null}
                                </ModalGateway>
                            </div>
                        ))
                    }
                </div>
                :<div></div>
              }
            </div>
       
    )
}
export default ImagesCard;
/**
 * <Gallery photos={[{src:`${item.url}` , width:6 , height:7}]} onClick={openLightbox} />
                                <ModalGateway>
                                  {viewerIsOpen ? (
                                    <Modal onClose={closeLightbox} >
                                      <Carousel
                                        currentIndex={currentImage}
                                        views={[{src:`${item.url}` , width:6 , height:7}].map(x => ({
                                          ...x,
                                          srcset: x.srcSet,
                                          caption: x.title
                                        }))}
                                      />
                                    </Modal>
                                  ) : null}
                                </ModalGateway>
 */
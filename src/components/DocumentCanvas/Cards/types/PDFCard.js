import React,{useState,useEffect} from 'react';
import { Document, Page ,pdfjs} from 'react-pdf';
import { auth } from 'firebase';
import { StoreFileToStorage, GetFileFromStorage } from '../../../../services/storage';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
const ThumbnailPDF = (props) =>{
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfState , setPDFState] = useState();
  var file = props.src.src;
  let url = 0;
  const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "PDF/" + file.name
  var metadata = {
      contentType: `${props.src.src.type}`
  };
  useEffect(()=>{
      StoreFileToStorage(refURL,file,metadata,data=>{
        setPDFState(data)
      })
  },[url])
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const goToPrevPage = () =>
  {  
    if(pageNumber > 1)
      setPageNumber(pageNumber - 1 );
    else
      setPageNumber(numPages - 1)
  }
  const goToNextPage = () =>
  {
      setPageNumber( pageNumber + 1 );
  }

  return(
      <div>
        {
          pdfState != undefined ?
          <div style={{
            width : props.CardDetail.size.width,
            height : props.CardDetail.size.height
          }}>
            <nav>
              <button onClick={goToPrevPage}>Prev</button>
              <button onClick={goToNextPage}>Next</button>
            </nav>
            <Document
              file={pdfState.url}
              onLoadSuccess={onDocumentLoadSuccess}
              
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
          :<div>Uploading</div>
        }
      </div>
  )
 }
const PDFCard = (props) =>{
    const [state , setState]= useState()
    const [pdfState , setPDFState] = useState([]);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    //console.log(state)
    
    const OnSelectFile = (e) =>
    {
        console.log(e.target.files[0])
        setState({src:e.target.files[0]})
    }
    const refURL = auth().currentUser?.uid + "/" + props.projectID + "/" + props.id + "/" + "PDF/"
    useEffect(()=>{
        GetFileFromStorage(refURL,data=>{
          setPDFState(data)
        })
    },[])
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }
    const goToPrevPage = () =>
    {
        if(pageNumber > 1)
        setPageNumber(pageNumber - 1 );
        else
        setPageNumber(numPages - 1)
    }
    const goToNextPage = () =>
    {
        setPageNumber( pageNumber + 1 );
    }
    
    return(
       
            <div >
                <input
                    type="file"
                    accept="application/pdf,application/vnd.ms-excel"
                    onChange={(e)=>OnSelectFile(e)}
                />
                {
                  (pdfState!=undefined || pdfState != null) && pdfState.length>0 ?
                  <div>
                    Previously Updated Docs
                    {
                      pdfState
                      .map((item)=>(
                        <div key={item}>
                          <nav>
                            <button onClick={goToPrevPage}>Prev</button>
                            <button onClick={goToNextPage}>Next</button>
                          </nav>
                          <Document
                            file={item.url}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <Page pageNumber={pageNumber} />
                          </Document>
                          <p>Page {pageNumber} of {numPages}</p>
                        </div>
                      ))
                    }
                  </div>
                  :<div></div>
                }
                {state?.src != undefined ? <ThumbnailPDF src={state} CardDetail={props.CardDetail} projectID={props.projectID} id={props.id}/> : <div></div>}
            </div>
       
    )
}
export default PDFCard;

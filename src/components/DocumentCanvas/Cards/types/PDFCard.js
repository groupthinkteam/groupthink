import React,{useState,useEffect} from 'react';
import { Document, Page ,pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';

const ThumbnailPDF = (props) =>{
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfState , setPDFState] = useState();
  var file = props.src.src;
  let url = 0;
  var metadata = {
      contentType: `${props.src.src.type}`
  };
  useEffect(()=>{
    props.uploadFile(file,metadata,data =>{
      setPDFState(data)
    });
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
   
    useEffect(()=>{
      props.fetchFile(data=>{
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
                {state?.src != undefined ? <ThumbnailPDF uploadFile={props.uploadFile.bind(this)}  src={state} CardDetail={props.CardDetail}/> : <div></div>}
            </div>
       
    )
}
export default PDFCard;

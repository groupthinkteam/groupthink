import React,{useState,useCallback} from 'react';
import { Document, Page ,pdfjs} from 'react-pdf';
const ThumbnailPDF = (props) =>{
    const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const goToPrevPage = () =>
  {  setPageNumber(pageNumber - 1 );
  }
  const goToNextPage = () =>
  {
      setPageNumber( pageNumber + 1 );
  }//console.log(props.src.src)
    return(
      <div>
       <nav>
          <button onClick={goToPrevPage}>Prev</button>
          <button onClick={goToNextPage}>Next</button>
        </nav>
              <Document
                file={props.src.src}
                onLoadSuccess={onDocumentLoadSuccess}
                  
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <p>Page {pageNumber} of {numPages}</p>
            
      </div>
    )
 }
const PDFCard = () =>{
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
                    accept="application/pdf,application/vnd.ms-excel"
                    onChange={(e)=>OnSelectFile(e)}
                />
                {state?.src != undefined ? <ThumbnailPDF src={state}/> : <div></div>}
            </div>
       
    )
}
export default PDFCard;
/**
 * // const { uri, width, height } =  PdfThumbnail.generate(state?.src, 0).then(console.log("ok"));
    const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
 
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
 *  <PDFViewer 
                document={{
                    url:`${props.src.src}`,
                    base64:`${props.src.src}`
                }}
            />
        <Document
          file={props.src.src}
          onLoadSuccess={onDocumentLoadSuccess}
            
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
 */
import React,{useRef, useState} from 'react';
import { Document, Page ,pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This Card Holds PDF Documents in Project.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//console.log(PDFRef.current?.pages)
const PDFCard = (props) =>{
  const [uploading, setUploading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const PDFRef = useRef(null);
  const listOfExtension = "video/* ";
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
  
  return (
    <div>
        {
            (typeof uploading === "number") ? 
            <ProgressBar animated now={uploading} label={`${Math.floor(uploading)}%`}></ProgressBar>  
            : null
        }
        <input
            type="file"
            accept="application/pdf,application/vnd.ms-excel"
            onChange={(e) => requestUpload(e)}
        />
        { 
          props.content.text === undefined ?
          Object.entries(props.content).map((fileKey,val)=>{
            //console.log(fileKey[0] , fileKey[1]?.url )
            return(
              <div key={fileKey[0]}>
                  File Name : {fileKey[0].split(">")[0]}
                  <div key={fileKey[0]}>
                    <nav>
                      <button onClick={goToPrevPage}>Prev</button>              
                      <button onClick={goToNextPage}>Next</button>              
                    </nav>
                    <Document
                      file={fileKey[1]?.url}
                      onLoadSuccess={onDocumentLoadSuccess}
                      ref={PDFRef}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>
                  </div>                                   
              </div>
            )
          })
          : null
        }
    </div>
  )  
}
export default React.memo(PDFCard);

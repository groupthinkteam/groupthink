import React,{useState} from 'react';
import { Document, Page ,pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';

/**
 * This Card Holds PDF Documents in Project.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
const PDFCard = (props) =>{
  const [uploading, setUploading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const listOfExtension = "video/* ";
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
        {uploading ? "upload progress: " + uploading : "not uploading"}
        <input
            type="file"
            accept="application/pdf,application/vnd.ms-excel"
            onChange={(e) => requestUpload(e)}
        />
        { props.content.url ?
          <div key={props.content.metadata.name}>
              File Name : {props.content.metadata.name}
              <div key={props.content.metadata.name}>
                <nav>
                  <button onClick={goToPrevPage}>Prev</button>              
                  <button onClick={goToNextPage}>Next</button>              
                </nav>
                <Document
                  file={props.content.url}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                <p>Page {pageNumber} of {numPages}</p>
              </div>                                   
          </div>
          : null
        }
    </div>
  )  
}
export default PDFCard;

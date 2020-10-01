import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import ProgressBar from 'react-bootstrap/ProgressBar'
/**
 * This Card Holds PDF Documents in Project.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//console.log(PDFRef.current?.pages)
const PDFCard = (props) => {
  return (
    <div>
      {
        props.content.text === undefined ?
          Object.entries(props.content).map((fileKey, val) => {
            return (
              <div key={fileKey[0]}>
                File Name : {fileKey[0].split(">")[0]}
              </div>
            )
          })
          : null
      }
    </div>
  )
}
export default React.memo(PDFCard);

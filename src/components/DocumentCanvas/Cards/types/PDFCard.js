import React from 'react';

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
                File Name : 
                <a href={fileKey[1]?.url} target="_blank">{fileKey[0].split(">")[0]}</a>
                <iframe src={fileKey[1]?.url} style={{overflow:"hidden" , display: "inline-table"}} scrolling="no"/>
              </div>
            )
          })
          : null
      }
    </div>
  )
}
export default React.memo(PDFCard);

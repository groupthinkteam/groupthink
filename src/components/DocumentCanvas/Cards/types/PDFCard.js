import React from 'react';
import Iframe from 'react-iframe';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
/**
 * This Card Holds PDF Documents in Project.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//console.log(PDFRef.current?.pages)
const PDFCard = (props) => {
  console.log("PROPS ",props.content)
  const onSave = (fileName) =>()=>{ 
    props.typeAPI.renameStorageFile(props.id,fileName,props.content.text)
    props.typeAPI.saveContent(props.id, { 
      [fileName]:
      {
        ["metadata"] :
        {
          ["name"] : props.content.text
        } 
      },
      text : null
    })
  }
  const onChange = (event,fileName,url) =>{
    if(event.target.value.length > 0 && typeof url === 'string') 
    console.log("TEST ",event.target.value)
    props.typeAPI.changeContent(props.id,
    { 
      ...props.content ,
      [event.target.value]:
      { 
        ...props.content[fileName] ,
        ["metadata"]: 
        {
          ...props.content[fileName]["metadata"],
          name:event.target.value
        },
        ["url"] : 
        {
          ...props.content[fileName]["url"],
          url : props.content[fileName]["url"]
        }
      }
    })
  }
  //<a href={fileKey[1]?.url} target="_blank">{fileKey[0].split(">")[0]}</a>
  return (
    <div>
      {
        props.content.text === undefined ?
          Object.entries(props.content).map((fileKey, val) => {
            return (
              <div key={fileKey[0]}>
                File Name :
                <InlineTextEdit
                  onChange={(e) => onChange(e,fileKey[0],fileKey[1]?.url)}
                  onSave={onSave(fileKey[0])}
                  placeholder="Enter File Name ...."
                  text={fileKey[0]}
                  lwidth={"100px"}
                  disabled={props.isLocked}
                />
                
                <Iframe src={fileKey[1]?.url} style={{overflow:"hidden" , display: "inline-table"}} scrolling="no"/>
              </div>
            )
          })
          : null
      }
    </div>
  )
}
export default React.memo(PDFCard);

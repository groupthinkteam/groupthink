import React, { useState } from 'react';
import Iframe from 'react-iframe';
import InlineTextEdit from '../../../InlineTextEdit/InlineTextEdit';
/**
 * This Card Holds PDF Documents in Project.
 * @param {*} props - Property of File .
 * @property `typeAPI` , `content` , `id`
 */
//console.log(PDFRef.current?.pages)
const PDFCard = (props) => {
  const [fileState , setFile] = useState({fileName:'',url:''});
  const onSave = (fileName,url) =>()=>{ 
    //Check this
    //props.typeAPI.renameStorageFile(props.id,fileName,fileState.fileName)
    props.typeAPI.saveContent(props.id, 
    { 
      ...props.content ,
      [fileState.fileName]:
      { 
        ...props.content[fileName] ,
        ["metadata"]: 
        {
          ...props.content[fileName]["metadata"],
          name:fileState.fileName
        },
        ["url"] : url
      },
      [fileName]:null
    });
  }
  const onLoadDiv = (fileName,url) =>{
    setFile({
      fileName:fileName,
      url:url
    });
    props.typeAPI.resize(props.id,{width:props.size.width,height:props.size.height})
  }
  return (
    <div>
      {
        props.content.text === undefined ?
          Object.entries(props.content).map(([fileKey, val]) => {
            return (
              <div  
                key={fileKey} 
                onLoad={e=>onLoadDiv(fileKey.split(">")[0],val?.url)}
              >
                
                <InlineTextEdit
                  onChange={(e) =>setFile({fileName:e.target.value , url:fileState.url}) }
                  onSave={onSave(fileKey,val?.url)}
                  placeholder="Enter File Name ...."
                  text={fileState.fileName}
                  lwidth={"50px"}
                  disabled={props.isLocked}
                  href={val?.url}
                  target="_blank"
                  style={{color:"red" ,textAlignLast:'center' }}
                />
                <Iframe  src={fileState.url.length >1 ? fileState.url :val?.url } style={{overflow:"hidden" , display: "inline-table"}} scrolling="no"/>
              </div>
            )
          })
          : null
      }
    </div>
  )
}
export default React.memo(PDFCard);

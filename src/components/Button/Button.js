import React from 'react'

const Button = ({handleClick, children , className , style , isLocked}) => {
  return (
    <button onClick={handleClick} className={className} style={style} disabled={isLocked}>{children}</button>
  )
}
export default React.memo(Button);

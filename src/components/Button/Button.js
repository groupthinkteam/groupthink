import React from 'react'

const Button = ({handleClick, children , className , style , isLocked},ref) => {
  return (
    <button ref={ref} onClick={handleClick} className={className} style={style} disabled={isLocked}>{children}</button>
  )
}
const ForwardRef = React.forwardRef(Button);
export default React.memo(ForwardRef);

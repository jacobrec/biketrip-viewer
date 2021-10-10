import React, { useState, ReactNode } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
export function JHRule(props: {}) {
  return <hr style={{
      border: "0",
      height: "1px",
      backgroundImage: "linear-gradient(to right, #CCCCCC66, #CCCCCCFF, #CCCCCC66)",
  }}/>
}

export function JRadioGroup(props: {value:string, setter: (a:string)=>void, children?: ReactNode}) {
  const [group, setGroup] = useState(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        group,
        checked: child.props.value === props.value,
        setter: props.setter
      });
    }
    return child;
  });
  return <div style={{flexFlow: "column", display: "flex"}}> {childrenWithProps} </div>

}

export function JRadio(props: {value: string, group?: string, checked?: boolean, setter?: (a:string)=>void}) {
  let id = props.group + "-" + props.value;
  let setter = props.setter ?? ((a) => {});
  return (<div>
            <input type="radio" id={id} value={props.value} name={props.group}
                   checked={props.checked ?? false} onChange={() => setter(props.value)}/>
            <label htmlFor={id}> {props.value} </label>
          </div>)
}


export function JAccordian(props: {title: string, children: ReactNode}) {
  const [open, setOpen] = useState(false);
  return (<div>
    <h2 style={{cursor: "pointer"}} onClick={() => setOpen(!open)}>
      {open ? <ExpandLess/> : <ExpandMore/> } { props.title }
    </h2>
    <div style={{margin: "10px"}}>
      { open ? props.children : <div></div> }
    </div>
  </div>);
}
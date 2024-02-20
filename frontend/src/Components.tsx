import React, { useState, ReactNode } from 'react';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import styled from '@emotion/styled'

export function JHidden(props: {show:boolean, children?: ReactNode}) {
    return <div style={{display: props.show ? "block" : "none"}}> {props.children} </div>
}

export function JToggleInput(props: {enabled:boolean, setEnabled: (a:boolean)=>void, label:string}) {
    return (
        <div style={{display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center"}}>
            <label> {props.label} </label>
            <JToggle enabled={props.enabled} setEnabled={props.setEnabled} />
        </div>
    )
}
type JSpanProps = {
    left: boolean
}
export function JToggle(props: {enabled:boolean, setEnabled: (a:boolean)=>void,}) {
    const JToggleInput = styled.input`
        opacity: 0;
        width: 0;
        height: 0;
    `;
    const JToggleLabel = styled.label`
        position: relative;
        display: inline-block;
        width: 30px;
        height: 18px;

    `
    const JToggleSpan = styled.span<JSpanProps>`
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${props => props.left ? "#cccccc" : "#2196F3"};
        transition: .4s;
        border-radius: 18px;

        &:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 4px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            transform: ${props => props.left ? "translateX(0px)" : "translateX(8px)"};
        }
    `;
    JToggleSpan.defaultProps = {
        left: false
    }

    return (
            <JToggleLabel className="switch">
                <JToggleInput type="checkbox" defaultChecked={props.enabled}
                    onClick={() => props.setEnabled(!props.enabled)}/>
                <JToggleSpan left={!props.enabled}/>
            </JToggleLabel>
           )
}

export function JHRule(props: {}) {
  return <hr style={{
      border: "0px",
      height: "1px",
      backgroundImage: "linear-gradient(to right, #CCCCCC66, #CCCCCCFF, #CCCCCC66)",
  }}/>
}

export function JRadioGroup(props: {value:string, setter: (a:string)=>void, children?: ReactNode}) {
  const [group, ] = useState(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));
  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      const cprops = {
        group,
        checked: child.props.value === props.value,
        setter: props.setter
      }
      return React.cloneElement(child, cprops);
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
      { open ? <div>{props.children}</div> : <div style={{display: "none"}}>{props.children}</div> }
    </div>
  </div>);
}


import {html} from 'lit-html/lib/lit-extended';

export const DEFAULT_TEMPLATE = (data, eventHandlers, progress) => html`
  <div style="${boxCSS}">
    <span style=${closeButtonCSS}" on-click=${eventHandlers.close}>x</span>
    <h3 style="font-weight:bold">${data.title}</h3>
    <div>${data.content}</div>
    <div class="controls" style="overflow: hidden; padding: 10px; display:${progress.total === 1 ? 'none' : 'block'}">
      <span class="progress" style="float: left">
       <div> ${progress.current}/${progress.total} </div>
      </span>
      <span class="actions" style="float: right">
        <button on-click=${eventHandlers.previous}>Previous</button>
        <button on-click=${eventHandlers.next}>Next</button>
      </span>
    </div>
  </div>
`;

export const DEFAULT_WRAPPER_CSS = `
  position: absolute;
  z-index: 999999999999999;
`;

const boxCSS = `
  background-color: white;
  color: black;
  padding: 15px;
  box-shadow: 0px 0px 9px #636363;
  max-width:300px;
  min-width: 200px;
`;

const closeButtonCSS = `
  float: right;
  position: relative;
  cursor: pointer;
  top: -5px;
  padding: 5px;
  color: #aaa;
`

let arrowCSS = orientation => {
  const COLOR = 'grey'

  switch (orientation) {
    case 'bottom':
      return `
            width: 0; 
            height: 0; 
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid ${COLOR};
          `;
    case 'top':
      return `
            width: 0; 
            height: 0; 
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid ${COLOR};
          `;

    case 'left':
      return `
            width: 0; 
            height: 0; 
            border-top: 60px solid transparent;
            border-bottom: 60px solid transparent;
            border-left: 60px solid ${COLOR};
          `;

    case 'right':
      return `
            width: 0; 
            height: 0; 
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent; 
            
            border-right:10px solid ${COLOR}; 
          `;
  }
};
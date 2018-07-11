export const boxCSS = `
  background-color: white;
  color: black;
  padding: 15px;
  box-shadow: 0px 0px 9px #636363;
  max-width:300px;
`;



export let arrowCSS = orientation => {
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

export const closeButtonCSS = `
  float: right;
  position: relative;
  cursor: pointer;
  top: -5px;
  padding: 5px;
  color: #aaa;
`
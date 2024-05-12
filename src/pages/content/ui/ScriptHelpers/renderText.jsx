import { InlineGoal, InlineTask, InlineLink } from '../../Components/HelperComponents/TextRendering/InlineComponents';
export const renderText = (rawText, dataContext) => {
    const componentRegex = /\{\{([^}]+)\}\}/g;
    let output = [];
    let lastIndex = 0;

    // Regular expression to detect list items and ensure newline before them

    const inputText = rawText.replace(/\d+\.\s?/g, (match) => { return '\n' + match});

    inputText.replace(componentRegex, (match, paramsString, index) => {
      // Add the previous literal text wrapped in a <span>
      let textSegment = inputText.substring(lastIndex, index);

      output.push(<span key={'text-' + lastIndex}>{textSegment}</span>);

      // Parse type and other parameters
      const params = paramsString.split(',').reduce((acc, param) => {
        const [key, value] = param.trim().split(':');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});

      const { type, ...otherParams } = params; // Destructure the type from other parameters

      // Check the type and render the appropriate component
      switch (type) {
        case 'goal':
          output.push(<InlineGoal key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        case 'task':
          output.push(<InlineTask key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        case 'link':
          output.push(<InlineLink key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        default:
          console.error("Unsupported type:", type);
          output.push(<span key={'error-' + index}>[[Unsupported component type]]</span>);
          break;
      }
  
      lastIndex = index + match.length;
      return match; // This return is not used, required for replace function
    });
  
    // Add any remaining text after the last match wrapped in a <span>
    if (lastIndex < inputText.length) {
      output.push(<span key={'text-' + lastIndex}>{inputText.substring(lastIndex)}</span>);
    }
  
    return output;
};

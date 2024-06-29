import { cn } from './cn';
// import { IconSetCache } from "./IconSetCache";

export interface LoadingProps {
  spinner?: boolean;
  dots?: boolean;
  text?: string;
  children?: any;
}

export const Loading = (props: LoadingProps) => {
  const { spinner = true, dots = false, children, text } = props;
  const content = children ? children : text;

  return (
    <div
      style={{
        width: 'auto',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        color: 'black', // Assuming '--text-muted-color' is defined in your CSS variables
        gap: '0.25rem',
      }}
    >
      {spinner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '1.5rem',
            width: '1.5rem',
            fontSize: '1rem',
            gap: '0.25rem',
          }}
        />
      )}
      {content}
      {dots && (
        <div
          style={{
            height: '1.5rem',
            width: '1.5rem',
            alignSelf: 'flex-end',
          }}
        />
      )}
    </div>
  );
};

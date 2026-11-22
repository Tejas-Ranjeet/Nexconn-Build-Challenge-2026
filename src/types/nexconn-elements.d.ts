import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nc-chat-ui-app-provider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'nc-chat-ui-app-provider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

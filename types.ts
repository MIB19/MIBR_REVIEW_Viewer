export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  type: 'desktop' | 'tablet' | 'mobile';
  icon?: string;
}

// Electron webview JSX declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          partition?: string;
          allowpopups?: string;
          preload?: string;
          webpreferences?: string;
        },
        HTMLElement
      >;
    }
  }
}
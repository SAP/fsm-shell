export type ModalSize = 'l' | 'm' | 's';
export interface ModalOpenRequestV2 {
  url: string;
  modalSettings?: {
    title?: string;
    showTitleHeader?: boolean;

    hasBackdrop?: boolean;
    backdropClickCloseable?: boolean;
    escKeyCloseable?: boolean;
    focusTrapped?: boolean;
    fullScreen?: boolean;
    mobile?: boolean;
    mobileOuterSpacing?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    verticalPadding?: boolean;
    responsivePadding?: boolean;

    width?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    minWidth?: string;
    maxWidth?: string;

    isScrollbarHidden?: boolean;
  };
  data?: any;
}

export interface ModalOpenRequestV2 {
  url: string;
  modalSettings?: {
    title?: string;
    showHeader?: boolean;

    hasBackdrop?: boolean;
    backdropClickCloseable?: boolean;
    escKeyCloseable?: boolean;
    focusTrapped?: boolean;
    fullScreen?: boolean;
    mobile?: boolean;
    mobileOuterSpacing?: boolean;
    draggable?: boolean;
    resizable?: boolean;

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

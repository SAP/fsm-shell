export interface ModalOpenRequestV2 extends DialogSettings {
  url: string;
  modalSettings?: DialogSettings & {
    title?: string;
    showHeader?: boolean;
    isScrollbarHidden?: boolean;
  };
  data?: any;
}

export interface DialogSettings {
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
}

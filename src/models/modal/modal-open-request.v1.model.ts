export type ModalSize = 'l' | 'm' | 's';
export interface ModalOpenRequestV1 {
  url: string;
  modalSettings?: {
    title?: string;
    size?: ModalSize;
    backdropClickCloseable?: boolean;
    isScrollbarHidden?: boolean;
  };
  data?: any;
}

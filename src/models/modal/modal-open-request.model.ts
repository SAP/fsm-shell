export type ModalSize = 'l' | 'm' | 's';
export interface ModalOpenRequest {
  url: string;
  modalSettings?: {
    title?: string;
    size?: ModalSize;
  };
}

export type ModalSize = 'l' | 'm' | 's';
export interface ModalOpenRequest<T> {
  url: string;
  modalSettings?: {
    title?: string;
    size?: ModalSize;
  };
}

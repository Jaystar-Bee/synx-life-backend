export interface ResponseI<T> {
  status: number;
  message: string;
  data: T;
}

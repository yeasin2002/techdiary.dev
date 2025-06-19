export type ActionResponse<T = any> =
  | {
      success: true | boolean;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

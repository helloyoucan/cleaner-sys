declare type APIResponse<T = any> = {
  code: number;
  data: T & {
    list: T;
    pages: {
      page: number;
      page_size: number;
      total: number;
      total_page: 1;
    };
  };
  error: string;
  msg: string;
};

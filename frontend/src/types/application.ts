export type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  locale?: string;
};

export type TableKeyValue = {
  label: string;
  value: string;
};

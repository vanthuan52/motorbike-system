interface Props {
  title: string;
}

export const PageHeading = ({ title }: Props) => {
  return (
    <div className="py-2">
      <h2
        className="text-lg md:text-xl font-semibold text-left"
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </h2>
    </div>
  );
};

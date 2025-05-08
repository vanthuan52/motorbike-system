interface Section {
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  return (
    <>
      {/* Desktop */}
      <div className="sticky top-32 p-4 hidden lg:block border-l border-[]">
        <h3 className="font-semibold mb-3 text-2xl">Trên trang này</h3>
        <ul className="space-y-2 text-sm pl-4">
          {sections.map((section, i) => (
            <li key={i}>
              <a href={`#section-${i}`} className=" hover:underline">
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile/Tablet */}
      <div className="block lg:hidden mb-6">
        <div className=" p-4 ">
          <h3 className="font-semibold mb-3">Trên trang này</h3>
          <ul className="space-y-2 text-sm">
            {sections.map((section, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className=" hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

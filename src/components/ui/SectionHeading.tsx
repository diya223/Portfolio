type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-400">
        {label}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-2xl text-lg text-zinc-400">{description}</p>
      )}
    </div>
  );
}

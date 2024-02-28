interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div className="container mb-8">
      <h1 className="mb-4 text-4xl">{title}</h1>
      <p className="text-xl text-slate-500">{subtitle}</p>
    </div>
  );
};

export default PageHeader;

interface TxPreviewCardProps {
  title: string;
  content: string;
}

const TxPreviewCard = ({ title, content }: TxPreviewCardProps) => {
  return (
    <>
      <div className="w-full p-4 mb-8 rounded-2xl bg-slate-100 dark:bg-slate-700">
        <span className="text-sm text-slate-400 font-light uppercase">
          {title}
        </span>
        <p className="dark:text-white break-words">{content}</p>
      </div>
    </>
  );
};

export default TxPreviewCard;

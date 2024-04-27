export default function HomeActions() {
  return (
    <div className="flex rounded-2xl h-14 space-x-1 p-1 border-2 border-pink-500 text-center items-center">
      <div className="flex-1 rounded-l-xl transition active:scale-95">Pay</div>
      <div className="flex-1 transition active:scale-95">Deposit</div>
      <div className="flex-1 rounded-r-xl transition active:scale-95">
        Retire
      </div>
    </div>
  );
}

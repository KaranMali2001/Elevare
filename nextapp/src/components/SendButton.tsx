function SendButton({
  handleSend,
  isLoading,
}: {
  handleSend: any;
  isLoading: boolean;
}) {
  return (
    <button
      className="block rounded-full bg-black w-full justify-center p-2 text-base text-slate-50 disabled:cursor-not-allowed disabled:opacity-[50%] mt-auto"
      onClick={handleSend}
      disabled={isLoading}
    >
      Send
    </button>
  );
}

export default SendButton;

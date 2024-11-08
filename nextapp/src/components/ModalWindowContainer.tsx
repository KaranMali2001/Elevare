function ModalWindowContainer({ children }: any) {
  return (
    <div
      className={`fixed bottom-0 right-0 overflow-y-auto bg-white rounded-t-lg shadow-xl transition-all duration-300 ease-in-out border border-gray-300 z-50 max-h-[600px] left-0 w-full md:w-auto`}
    >
      {children}
    </div>
  );
}

export default ModalWindowContainer;

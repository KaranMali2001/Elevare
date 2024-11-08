function ModalBody({ children }: any) {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100%-3.5rem)] tracking-wide items-stretch">
      {children}
    </div>
  );
}

export default ModalBody;

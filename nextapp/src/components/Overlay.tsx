function Overlay({ toggleModal }: any) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      onClick={toggleModal}
    ></div>
  );
}

export default Overlay;

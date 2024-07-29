export default function Container({ children }) {
  return (
    <div className="nav:ml-[calc(18rem+3rem)] nav:mr-[3rem] mt-12 nav:my-[3rem] px-6 nav:px-0 w-full">
      {children}
    </div>
  );
}
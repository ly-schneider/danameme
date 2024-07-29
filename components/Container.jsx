export default function Container({ children }) {
  return (
    <div className="ml-[calc(18rem+3rem)] mr-[3rem] my-[3rem] w-full">
      {children}
    </div>
  );
}
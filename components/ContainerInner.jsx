export default function ContainerInner({ children, margin = true }) {
  if (margin) {
    return (
      <div className="mt-20 nav:mt-12 nav:my-[3rem] mb-20">
        {children}
      </div>
    );
  }
  return children;
}
type ContainerProps = {
  children: React.ReactNode;
  classNames?: string;
};

const Container = ({ children, classNames = "" }: ContainerProps) => {
  return (
    <div className={`m-auto max-w-xl bg-slate-400 ${classNames}`}>
      {children}
    </div>
  );
};
export default Container;

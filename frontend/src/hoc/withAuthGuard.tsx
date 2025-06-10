import AuthGuard from "@/components/AuthGuard";

const withAuthGuard = (Component: React.FC<any>, allowedRoles: string[]) => {
  return function Wrapped(props: any) {
    return (
      <AuthGuard>
        <Component {...props} />{" "}
      </AuthGuard>
    );
  };
};

export default withAuthGuard;

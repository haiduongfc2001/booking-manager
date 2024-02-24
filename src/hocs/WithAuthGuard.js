import { AuthGuard } from "src/guards/AuthGuard";

export const withAuthGuard = (Component) => (props) =>
  (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );

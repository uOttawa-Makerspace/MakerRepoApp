import SpaceDashboard from "./SpaceDashboard";
import SpaceHours from "./SpaceHours";
import "../utils/EnvVariables";

interface HomeProps {
  user: Record<string, any> | null;
}

function Home({ user }: HomeProps) {
  if (!user) {
    return null;
  }

  const isStaffOrAdmin = user.role === "admin" || user.role === "staff";

  return isStaffOrAdmin ? <SpaceDashboard /> : <SpaceHours />;
}

export default Home;
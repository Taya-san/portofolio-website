import { useUser } from '../auth';

export const useAuthorization = () => {
  const user = useUser();
  const checkAccess = () => {
    if (user.data) {
      return true;
    }

    return false;
  };

  return { checkAccess };
};

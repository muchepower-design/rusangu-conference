import { useAuth } from './useAuth';

export const useModules = () => {
  const { user } = useAuth();
  const modules = user?.modules || [];
  const hasModule = (name) => modules.includes(name);
  return { modules, hasModule };
};
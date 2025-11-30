import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DEFAULT_PATH } from '../constants/routes.constant';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/user-slice';
import { selectPath } from '../store/path-slice';

export const GuestProtected = () => {
  const user = useAppSelector(selectUser);
  const path = useAppSelector(selectPath);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const target = path?.length ? `/${path}` : DEFAULT_PATH;

    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [user, navigate, location, path]);

  return <Outlet />
};

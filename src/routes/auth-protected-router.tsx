import { useEffect } from 'react';
import { Outlet, useParams, type Params } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPath, setPath } from '../store/path-slice';

export const AuthProtected = () => {
  const pathData = useAppSelector(selectPath);
  const dispatch = useAppDispatch();
  const { externalPath } = useParams<Params>();
  const path = externalPath ? decodeURIComponent(externalPath) : '';

  useEffect(() => {
    if (!path) return;
    if (pathData !== path) {
      dispatch(setPath(path));
    }
  }, [dispatch, path, pathData]);

  return <Outlet />;
};

import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data?: T;
  error?: string;
  isLoading: boolean;
}

export const useAsync = <T,>(factory: () => Promise<T>) => {
  const [state, setState] = useState<AsyncState<T>>({ isLoading: true });
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    setState((previous) => ({ data: previous.data, isLoading: true }));

    void factory()
      .then((data) => {
        if (isActive) {
          setState({ data, isLoading: false });
        }
      })
      .catch((error) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Something went wrong';
          setState({ error: message, isLoading: false });
        }
      });

    return () => {
      isActive = false;
    };
  }, [factory, refreshKey]);

  return { ...state, refetch };
};

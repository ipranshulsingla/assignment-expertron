/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {React.EffectCallback} effect
 * @param {React.DependencyList} deps
 */
export default function useUpdateEffect(effect, deps) {
  const isInitialMount = useRef(true);
  const effectRef = useRef();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effectRef.current();
    }
  }, deps);

  effectRef.current = effect;
}

import gql from 'graphql-tag';
import * as React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Query } from '../api/types';
import { useGraphQLQuery } from '../hooks';
import { jwtAtom } from './atoms';

export function useUser() {
  const jwt = useRecoilValue(jwtAtom);
  const resetJwt = useResetRecoilState(jwtAtom);

  const { data } = useGraphQLQuery<Pick<Query, 'currentPerson'>>(
    gql`
      query CurrentUser {
        currentPerson {
          id
          name
        }
      }
    `,
    { queryKey: jwt },
  );

  React.useEffect(() => {
    if (!data?.data?.currentPerson && !data?.errors) {
      resetJwt();
    }
  }, [data?.data?.currentPerson, data?.errors]);

  return data?.data?.currentPerson;
}

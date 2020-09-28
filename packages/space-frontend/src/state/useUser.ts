import gql from 'graphql-tag';
import * as React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { CurrentUserQuery, CurrentUserQueryVariables } from '../api/types';
import { useGraphQLQuery } from '../hooks';
import { jwtAtom } from './atoms';

export function useUser() {
  const jwt = useRecoilValue(jwtAtom);
  const resetJwt = useResetRecoilState(jwtAtom);

  const {
    data: {
      data: { currentPerson },
      errors,
    },
  } = useGraphQLQuery<CurrentUserQuery, CurrentUserQueryVariables>(
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
    if (!currentPerson && !errors) {
      resetJwt();
    }
  }, [currentPerson, errors]);

  return currentPerson;
}

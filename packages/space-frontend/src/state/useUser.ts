import gql from 'graphql-tag';
import * as React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { CurrentUserQuery, CurrentUserQueryVariables } from '../api/types';
import { useGraphQLQuery } from '../hooks';
import { jwt } from './atoms';

export function useUser() {
  const jwtValue = useRecoilValue(jwt);
  const resetJwt = useResetRecoilState(jwt);

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
    { queryKey: jwtValue },
  );

  React.useEffect(() => {
    if (!currentPerson && !errors) {
      resetJwt();
    }
  }, [currentPerson, errors]);

  return [currentPerson, resetJwt] as const;
}

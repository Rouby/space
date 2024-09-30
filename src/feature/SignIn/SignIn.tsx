import { useMutation } from "urql";
import { graphql } from "../../gql";

export function SignIn() {
	useMutation(
		graphql(`mutation SignIn($email:String!, $password:String!) {
    loginWithPassword(email: $email, password: $password) {
      id
      name
    }
  }`),
	);

	return <>hello?</>;
}

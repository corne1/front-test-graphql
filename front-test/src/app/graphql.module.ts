import { NgModule } from '@angular/core'
import { APOLLO_OPTIONS } from 'apollo-angular'
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { HttpLink } from 'apollo-angular/http'

const uri = 'http://localhost:3000/graphql';

export function createApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }));
  const link = ApolloLink.from([basic, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }

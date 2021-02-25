import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {setContext} from '@apollo/client/link/context';
import {HttpLink} from 'apollo-angular/http';

const uri = 'https://48p1r2roz4.sse.codesandbox.io';
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));
  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return {}
    } else {
      return {
        headers: {
          Authorization: `JWT ${token}`
        }
      }
    }
  })

  const link = ApolloLink.from([basic, auth, httpLink.create({uri})])
  const cache = new InMemoryCache();
  return {
    link,
    cache
  };
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
export class GraphQLModule {}
